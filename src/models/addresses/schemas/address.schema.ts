import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/models/users/schemas/user.schema';

export type AddressDocument = HydratedDocument<Address>;

@Schema({ timestamps: true })
export class Address {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  user: User;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  streetAddress: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  phoneNumber: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
