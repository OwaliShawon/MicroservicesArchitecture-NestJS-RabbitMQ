import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(
    userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const createdUser = new this.userModel({
        ...userData,
        password: hashedPassword,
      });
      return createdUser.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      return this.userModel.findOne({ email }).exec();
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new InternalServerErrorException('Could not find user by email');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return this.userModel.findById(id).exec();
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new InternalServerErrorException('Could not find user by ID');
    }
  }
}
