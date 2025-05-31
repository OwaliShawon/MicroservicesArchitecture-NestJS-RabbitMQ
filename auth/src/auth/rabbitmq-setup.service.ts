import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMqSetupService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const rabbitMqUrl = this.configService.getOrThrow<string>('RABBITMQ_URL');
    const exchange = this.configService.getOrThrow<string>(
      'RABBITMQ_USER_CREATED_EXCHANGE',
    );
    const queue = this.configService.getOrThrow<string>(
      'RABBITMQ_USER_EVENTS_QUEUE',
    );
    const routingKey = this.configService.getOrThrow<string>(
      'RABBITMQ_USER_CREATED_ROUTING_KEY',
    );

    const connection = await amqp.connect(rabbitMqUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'topic', { durable: true });
    await channel.assertQueue(queue, { durable: false });
    await channel.bindQueue(queue, exchange, routingKey);

    await channel.close();
    await connection.close();
  }
}
