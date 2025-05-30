import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const rabbitMqUrl = configService.get<string>('RABBITMQ_URL');
  const rabbitMqAuthQueue = configService.get<string>('RABBITMQ_AUTH_QUEUE');
  if (!port || !rabbitMqUrl || !rabbitMqAuthQueue) {
    throw new Error('Missing required environment variables');
  }

  await app.listen(port);

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: rabbitMqAuthQueue,
        queueOptions: {
          durable: false,
        },
      },
    });
  await microservice.listen();
}
bootstrap();
