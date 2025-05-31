import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '../users/user.entity';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
  ) {}

  async register(registerDto: RegisterAuthDto): Promise<User> {
    const existingUser = await this.usersService.findOneByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    try {
      const user = await this.usersService.create({
        ...registerDto,
        password: registerDto.password,
      });
      this.client
        .emit('user.created', {
          userId: user._id,
          email: user.email,
          name: user.name,
        })
        .subscribe({
          error: (err) =>
            console.error('Error publishing user.created event:', err),
        });
      return user;
    } catch (error) {
      console.error('Error during registration:', error);
      throw new InternalServerErrorException('Could not register user');
    }
  }

  async login(
    loginDto: LoginAuthDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { userId: user._id, email: user.email, role: user.role };
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  async logout(refreshToken: string): Promise<void> {
    console.log(`Logout requested for token: ${refreshToken}`);
    return;
  }

  generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION'),
    });
  }

  generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION'),
    });
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  async decodeToken(token: string): Promise<any> {
    try {
      return await this.jwtService.decode(token);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }
}
