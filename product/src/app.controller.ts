import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @EventPattern('user.created')
  async handleUserCreated(
    @Payload() data: { userId: string; email: string; name: string },
  ) {
    console.log('LISTEN user.created event', data);
  }
}
