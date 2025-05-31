import { User } from './user.entity';
import { buildSchema } from '@typegoose/typegoose';

export const UserSchema = buildSchema(User);
