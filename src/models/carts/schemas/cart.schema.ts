import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/models/users/schemas/user.schema';
import { Product } from 'src/models/products/schemas/product.schema';
import { Promotion } from 'src/models/promotions/schemas/promotion.schema';
import { Address } from 'src/models/addresses/schemas/address.schema';
import { ShippingMethod } from 'src/common/enums/enums';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        color: { type: String, required: true },
        size: { type: String, required: true },
      },
    ],
    default: [],
  })
  items: {
    product: Product;
    quantity: number;
    color: string;
    size: string;
  }[];

  @Prop({ type: String, default: ShippingMethod.Standard })
  shipping_method: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Address.name, default: null })
  shipping_address: Address;

  @Prop({ type: String, default: null })
  coupon: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
