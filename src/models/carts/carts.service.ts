import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateCartDto } from './dto/create-cart.dto';
import { PromotionsService } from '../promotions/promotions.service';
import { AddressesService } from '../addresses/addresses.service';
import { CUSTOM_MESSAGES } from 'src/common/enums/custom-messages.enum';
import { ProductsService } from '../products/products.service';
import { CartItemDto } from './dto/cart-item.dto';
import { CartRemoveType } from './cart-remove-type.enum';
import { OrderSummary } from 'src/common/interfaces/order-summary.interface';
import { TAX_RATE } from 'src/common/constants/constants';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: SoftDeleteModel<CartDocument>,
    private readonly promotionService: PromotionsService,
    private readonly addressService: AddressesService,
    private readonly productService: ProductsService,
  ) {}

  async create(createCartDto: CreateCartDto, userId: string) {
    const { items } = createCartDto;

    // Validate all items in parallel
    const isValid = await Promise.all(
      items.map(async item => {
        return await this.productService.getProductIfValid(item.productId, item.color, item.size);
      }),
    );

    // If all items are valid, create the cart
    if (isValid.every(item => item !== null)) {
      const cart = await this.cartModel.create({
        user: userId,
        items: items.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        })),
      });
      return cart;
    } else {
      throw new BadRequestException('Invalid product information in the cart.');
    }
  }

  async findOne(id: string) {
    const cart = await this.cartModel
      .findById(id)
      .populate('items.product')
      .populate('shipping_address');

    if (!cart) {
      throw new NotFoundException(CUSTOM_MESSAGES.CART_ID_NOT_EXIST);
    }

    return await this.formatCartResponse(cart);
  }

  async addItem(id: string, cartItemDto: CartItemDto) {
    const { productId, quantity, color, size } = cartItemDto;
    let cart = await this.cartModel
      .findById(id)
      .populate('items.product')
      .populate('shipping_address');

    if (!cart) {
      throw new NotFoundException(CUSTOM_MESSAGES.CART_ID_NOT_EXIST);
    }

    const validProduct = await this.productService.getProductIfValid(productId, color, size);

    if (!validProduct) {
      throw new BadRequestException('Invalid product information.');
    }

    const cartItemExist = cart.items.find(
      item =>
        item.product.toString() === validProduct._id.toString() &&
        item.color === color &&
        item.size === size,
    );

    if (cartItemExist) {
      cart = await this.cartModel
        .findOneAndUpdate(
          {
            _id: id,
            'items.product': validProduct._id,
            'items.color': color,
            'items.size': size,
          },
          { $inc: { 'items.$.quantity': quantity } },
          { new: true },
        )
        .populate('items.product')
        .populate('shipping_address');
    } else {
      cart = await this.cartModel
        .findOneAndUpdate(
          { _id: id },
          {
            $push: {
              items: {
                product: validProduct._id,
                color: color,
                size: size,
                quantity,
              },
            },
          },
          { new: true },
        )
        .populate('items.product')
        .populate('shipping_address');
    }

    return await this.formatCartResponse(cart);
  }

  async remove(id: string, itemId: string, type: string) {
    let cart = (
      await this.cartModel.findById(id).populate('items.product').populate('shipping_address')
    )?.toObject();

    if (!cart) {
      throw new NotFoundException(CUSTOM_MESSAGES.CART_ID_NOT_EXIST);
    }

    if (type === CartRemoveType.ALL) {
      cart = await this.cartModel
        .findOneAndUpdate({ _id: id }, { items: [] }, { new: true })
        .populate('items.product')
        .populate('shipping_address');
    } else {
      const cartItem = cart.items.find(item => (item as any)._id.toString() === itemId);

      if (!cartItem) {
        throw new NotFoundException(CUSTOM_MESSAGES.CART_ITEM_ID_NOT_EXIST);
      }

      if (type === CartRemoveType.SINGLE) {
        cart = await this.cartModel
          .findOneAndUpdate({ _id: id }, { $pull: { items: { _id: itemId } } }, { new: true })
          .populate('items.product')
          .populate('shipping_address');
      }

      if (type === CartRemoveType.DESCREASE) {
        cart = await this.cartModel
          .findOneAndUpdate(
            { _id: id, 'items._id': itemId },
            { $inc: { 'items.$.quantity': -1 } },
            { new: true },
          )
          .populate('items.product')
          .populate('shipping_address');
      }
    }

    return await this.formatCartResponse(cart);
  }

  async applyPromotion(id: string, coupon: string | null): Promise<any> {
    let cart = await this.cartModel.findById(id).populate('items.product');

    if (!cart) {
      throw new NotFoundException(CUSTOM_MESSAGES.CART_ID_NOT_EXIST);
    }

    if (coupon) {
      const subTotal = cart.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      );
      const validPromotion = await this.promotionService.getValidPromotion(coupon, subTotal);

      if (validPromotion) {
        cart = await this.cartModel
          .findOneAndUpdate({ _id: id }, { coupon: coupon }, { new: true })
          .populate('items.product')
          .populate('shipping_address');
      }
    } else {
      cart = await this.cartModel
        .findOneAndUpdate({ _id: id }, { coupon: null }, { new: true })
        .populate('items.product')
        .populate('shipping_address');
    }

    return {
      coupon,
      orderSummary: await this.getOrderSummary(cart),
    };
  }

  async applyAddress(id: string, addressId: string | null) {
    let cart = await this.cartModel
      .findById(id)
      .populate('shipping_address')
      .populate('items.product');

    if (!cart) {
      throw new NotFoundException(CUSTOM_MESSAGES.CART_ID_NOT_EXIST);
    }

    if (addressId) {
      const address = await this.addressService.findOne(addressId);

      if (!address) {
        throw new NotFoundException(CUSTOM_MESSAGES.ADDRESS_ID_NOT_EXIST);
      }

      cart = await this.cartModel
        .findOneAndUpdate({ _id: id }, { shipping_address: addressId }, { new: true })
        .populate('shipping_address')
        .populate('items.product');
    } else {
      cart = await this.cartModel
        .findOneAndUpdate({ _id: id }, { shipping_address: null }, { new: true })
        .populate('shipping_address')
        .populate('items.product');
    }

    return {
      shipping_address: cart.shipping_address,
      orderSummary: await this.getOrderSummary(cart),
    };
  }

  private async getOrderSummary(cart: Cart): Promise<OrderSummary> {
    const { items, shipping_address, coupon } = cart;
    const taxRate = TAX_RATE;
    const itemCount = items.reduce((total, item) => total + item.quantity, 0) ?? 0;
    const subTotal = this.calculateTotalAmount(cart.items);
    const shippingCost = this.addressService.calculateShippingCost(shipping_address?.province) ?? 0;
    const discountAmount = await this.promotionService.calculateDiscountAmount(coupon, subTotal);
    const taxAmount = subTotal * taxRate;
    const totalAmount = subTotal + taxAmount + shippingCost - discountAmount;

    return {
      itemCount: itemCount,
      subTotal: subTotal,
      taxAmount: taxAmount,
      shippingCost: shippingCost,
      discountAmount: discountAmount,
      total: totalAmount,
    };
  }

  private calculateTotalAmount(items: any[]): number {
    if (!items || items.length === 0) {
      return 0;
    }

    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  private async formatCartResponse(cart: Cart) {
    const orderSummary = await this.getOrderSummary(cart);
    const items = this.formatItemsResponse(cart.items);

    return {
      _id: (cart as any)._id,
      items: items,
      shipping_address: cart.shipping_address,
      coupon: cart.coupon,
      orderSummary: orderSummary,
    };
  }

  formatItemsResponse(items: Cart['items']) {
    return items.map((item: any) => ({
      _id: item._id,
      productId: item.product._id,
      name: item.product.name,
      image: item.product.images[0] ?? null,
      price: item.product.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
    }));
  }
}
