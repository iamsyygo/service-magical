import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getAvailableNetworkAddresses } from 'shared/utils/os.util';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 8089,
    },
  });

  // const app = await NestFactory.createMicroservice(UserModule, {
  //   transport: Transport.TCP,
  //   options: {
  //     port: 8089,
  //   },
  // });

  await app.startAllMicroservices();

  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      transform: true,
    }),
  );

  app.enableCors();
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('User API').build(),
  );
  SwaggerModule.setup('docs', app, document);

  const port: number = 8001;

  app.enableCors();
  await app.listen(port);
  const { local, network } = getAvailableNetworkAddresses(port);
  const localAddress = `Local: \n${local}`;
  const networkAddress = `Network: \n${network.join('\n')}`;
  const message = `\n\n${localAddress}\n\n${networkAddress}\n`;

  Logger.log(message, 'Bootstrap');
}
bootstrap();
