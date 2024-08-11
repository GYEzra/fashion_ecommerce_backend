import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { AddressesService } from '../addresses/addresses.service';
import aqp from 'api-query-params';
import { IUser } from 'src/common/interfaces/user.interface';
import { CartsService } from '../carts/carts.service';
import { OrderStatus } from 'src/common/enums/status.enum';
import { PaymentStatus } from 'src/common/enums/enums';
import { CUSTOM_MESSAGES } from 'src/common/enums/custom-messages.enum';
import { Document } from 'mongoose';
import { Utils } from 'src/utils/utils';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatusTransitions, PaymentStatusTransitions } from 'src/common/constants/constants';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: SoftDeleteModel<OrderDocument>,
    private readonly cartService: CartsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: IUser) {
    const { cartId, payment_method, note } = createOrderDto;
    const cart = await this.cartService.findOne(cartId);
    const { shipping_address, coupon, orderSummary, items } = cart;

    const order = await this.orderModel.create({
      user: user._id,
      items: items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
        size: item.size,
      })),
      customer_full_name: shipping_address.fullName,
      customer_phone_number: shipping_address.phoneNumber,
      order_status: OrderStatus.Pending,
      payment_method: payment_method,
      payment_status: PaymentStatus.Pending,
      coupon: coupon,
      discount_amount: orderSummary.discountAmount,
      shipping_address: shipping_address.streetAddress + ', ' + shipping_address.province,
      shipping_cost: orderSummary.shippingCost,
      tax_amount: orderSummary.taxAmount,
      total_amount: orderSummary.total,
      note: note,
    });

    return this.formatOrderResponse(order);
  }

  async findAll(query: string) {
    const { filter, sort, population } = aqp(query);
    const current = +filter.current;
    const pageSize = +filter.pageSize;
    delete filter.current;
    delete filter.pageSize;

    let offset = (current - 1) * pageSize;
    let limit = pageSize ? pageSize : 10;

    const totalItems = (await this.orderModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);
    const defaultSort = sort ? (sort as unknown as string) : '-createdAt';

    const orders = await this.orderModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(defaultSort)
      .populate(population)
      .populate('items.product');

    const result = orders.map(order => this.formatOrderResponse(order));

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id).populate('items.product');
    if (!order) {
      throw new NotFoundException(CUSTOM_MESSAGES.ORDER_NOT_EXIST);
    }
    return this.formatOrderResponse(order);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, user: IUser) {
    const order = await this.orderModel.findById(id).populate('items.product');
    if (!order) throw new NotFoundException(CUSTOM_MESSAGES.ORDER_NOT_EXIST);

    if (order.order_status !== OrderStatus.Pending) {
      throw new BadRequestException(CUSTOM_MESSAGES.ORDER_CANNOT_UPDATE);
    }

    const changes = Utils.getDataChange(updateOrderDto, order.toObject());

    if (changes) {
      const newOrder = await this.orderModel
        .findOneAndUpdate(
          { _id: id },
          {
            ...updateOrderDto,
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
          { new: true },
        )
        .populate('items.product');
      return this.formatOrderResponse(newOrder);
    }

    return null;
  }

  async updateOrderStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const { order_status } = updateOrderStatusDto;
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException(CUSTOM_MESSAGES.ORDER_NOT_EXIST);
    }

    const currentStatus = order.order_status;
    const validNewStatuses = OrderStatusTransitions[currentStatus];
    if (!validNewStatuses || !validNewStatuses.includes(order_status)) {
      throw new BadRequestException(CUSTOM_MESSAGES.ORDER_STATUS_INVALID);
    }

    const newOrder = await this.orderModel
      .findOneAndUpdate({ _id: id }, { order_status }, { new: true })
      .populate('items.product');
    return this.formatOrderResponse(newOrder);
  }

  async updatePaymentStatus(id: string, updatePaymentStatusDto: UpdatePaymentStatusDto) {
    const { payment_status } = updatePaymentStatusDto;
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException(CUSTOM_MESSAGES.ORDER_NOT_EXIST);
    }

    const currentStatus = order.payment_status;
    const validNewStatuses = PaymentStatusTransitions[currentStatus];
    if (!validNewStatuses || !validNewStatuses.includes(payment_status)) {
      throw new BadRequestException(CUSTOM_MESSAGES.ORDER_STATUS_INVALID);
    }

    const newOrder = await this.orderModel
      .findOneAndUpdate({ _id: id }, { payment_status }, { new: true })
      .populate('items.product');
    return this.formatOrderResponse(newOrder);
  }

  private formatOrderResponse(order: Order) {
    const { items, ...rest } = (order as unknown as Document).toObject();
    const itemsResponse = this.cartService.formatItemsResponse(order.items);

    return {
      items: itemsResponse,
      ...rest,
    };
  }
}
