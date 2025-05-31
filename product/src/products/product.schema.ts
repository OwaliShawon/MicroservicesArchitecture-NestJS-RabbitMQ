import { Product } from './product.entity';
import { buildSchema } from '@typegoose/typegoose';

export const ProductSchema = buildSchema(Product);
