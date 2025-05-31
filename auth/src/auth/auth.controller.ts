import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Req() req: any) {
    const payload = {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role,
    };
    return {
      accessToken: this.authService.generateAccessToken(payload),
      refreshToken: req.user.refreshToken,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() { refreshToken }: { refreshToken: string }) {
    return this.authService.logout(refreshToken);
  }

  @MessagePattern('validate_token')
  async validateToken(@Payload() data: { token: string }): Promise<boolean> {
    return this.authService.validateToken(data.token);
  }

  @MessagePattern('decode_token')
  async decodeToken(@Payload() data: { token: string }): Promise<any> {
    return this.authService.decodeToken(data.token);
  }
}
