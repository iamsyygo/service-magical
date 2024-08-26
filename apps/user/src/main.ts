import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(UserModule);

  // app.connectMicroservice({
  //   transport: Transport.TCP,
  //   options: {
  //     port: 8089,
  //   },
  // });

  const app = await NestFactory.createMicroservice(UserModule, {
    transport: Transport.TCP,
    options: {
      port: 8089,
    },
  });
  await app.listen();
}
bootstrap();
