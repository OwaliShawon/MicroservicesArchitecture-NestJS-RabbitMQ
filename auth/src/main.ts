import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const rabbitMqUrl = configService.get<string>('RABBITMQ_URL');
  const rabbitMqAuthQueue = configService.get<string>('RABBITMQ_AUTH_QUEUE');
  if (!port || !rabbitMqUrl || !rabbitMqAuthQueue) {
    throw new Error('Missing required environment variables');
  }

  const config = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('API documentation for the Auth Service')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

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
