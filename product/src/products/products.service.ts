import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    userId: string,
  ): Promise<Product> {
    try {
      const createdProduct = new this.productModel({
        ...createProductDto,
        userId,
      });
      return createdProduct.save();
    } catch (error) {
      console.error('Error creating product:', error);
      throw new InternalServerErrorException('Could not create product');
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return this.productModel.find().exec();
    } catch (error) {
      console.error('Error finding products:', error);
      throw new InternalServerErrorException('Could not retrieve products');
    }
  }

  async findOne(id: string): Promise<Product | null> {
    try {
      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error finding product by ID:', error);
      throw new InternalServerErrorException('Could not find product');
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    userId: string,
  ): Promise<Product> {
    const product = await this.findOne(id);
    if (product && product.userId !== userId) {
      throw new ForbiddenException('You do not own this product');
    }
    try {
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, { $set: updateProductDto }, { new: true })
        .exec();

      if (!updatedProduct) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new InternalServerErrorException('Could not update product');
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    const product = await this.findOne(id);
    if (product && product.userId !== userId) {
      throw new ForbiddenException('You do not own this product');
    }
    try {
      const result = await this.productModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      console.error('Error deleting product:', error);
      throw new InternalServerErrorException('Could not delete product');
    }
  }

  async validateUserToken(token: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.authServiceClient
          .send<boolean>('validate_token', { token })
          .pipe(timeout(5000)),
      );
      return response;
    } catch (error) {
      console.error(
        'Error communicating with Auth Service for token validation:',
        error,
      );
      return false;
    }
  }

  async decodeUserToken(token: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.authServiceClient
          .send<any>('decode_token', { token })
          .pipe(timeout(5000)),
      );
      return response;
    } catch (error) {
      console.error(
        'Error communicating with Auth Service for token decoding:',
        error,
      );
      return null;
    }
  }
}
