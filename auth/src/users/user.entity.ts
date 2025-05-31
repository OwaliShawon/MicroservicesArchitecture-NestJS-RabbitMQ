import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class User {
  _id?: Types.ObjectId;

  @prop({ required: true })
  name: string;

  @prop({ required: true, unique: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop({ default: 'user' })
  role?: string;

  @prop({ default: Date.now() })
  createdAt?: Date;

  @prop({ default: Date.now() })
  updatedAt?: Date;
}
