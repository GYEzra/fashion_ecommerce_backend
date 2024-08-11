import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CouponStatus, DiscountType } from 'src/common/enums/enums';

export type PromotionDocument = Promotion & Document;

@Schema({ timestamps: true })
export class Promotion {
  @Prop({ unique: true, required: true })
  coupon: string;

  @Prop({ enum: CouponStatus, required: true })
  status: string;

  @Prop()
  description: string;

  @Prop({ type: Number, required: true })
  discount_amount: number;

  @Prop({ type: Boolean, required: true })
  free_shipping: boolean;

  @Prop({ enum: DiscountType, required: true })
  discount_type: string;

  @Prop({ type: Number, default: 0 })
  condition: number; // Điều kiện là tổng giá trị đơn hàng - (Mở rộng: Minimum_purchase, Specific_products, Customer_group)

  @Prop({ type: Date, required: true })
  start_date: Date;

  @Prop({ type: Date, required: true })
  end_date: Date;

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

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
