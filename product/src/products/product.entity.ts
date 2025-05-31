import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class Product {
  _id?: Types.ObjectId;

  @prop({ required: true })
  name: string;

  @prop()
  description?: string;

  @prop({ required: true })
  price: number;

  @prop({ required: true })
  userId: string;

  @prop({ default: Date.now() })
  createdAt?: Date;

  @prop({ default: Date.now() })
  updatedAt?: Date;
}
