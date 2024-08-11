import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from 'src/models/products/schemas/product.schema';
import { User } from 'src/models/users/schemas/user.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: User.name })
  user: User;

  @Prop({
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        color: { type: String, required: true },
        size: { type: String, required: true },
      },
    ],
    default: [],
  })
  items: {
    product: Product;
    quantity: number;
    price: number;
    color: string;
    size: string;
  }[];

  @Prop({ required: true })
  customer_full_name: string;

  @Prop({ required: true })
  customer_phone_number: string;

  @Prop({ required: true })
  order_status: string;

  @Prop({ required: true })
  payment_method: string;

  @Prop({ required: true })
  payment_status: string;

  @Prop({ default: null })
  coupon: string;

  @Prop({ default: 0 })
  discount_amount: number;

  @Prop({ required: true })
  shipping_address: string;

  @Prop({ required: true })
  shipping_cost: number;

  @Prop({ required: true })
  tax_amount: number;

  @Prop({ required: true })
  total_amount: number;

  @Prop({ default: null })
  note: string;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
