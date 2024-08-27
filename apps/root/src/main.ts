import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getAvailableNetworkAddresses } from 'shared/utils/os.util';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port: number = 8000;

  app.enableCors();
  await app.listen(port);
  const { local, network } = getAvailableNetworkAddresses(port);
  const localAddress = `Local: \n${local}`;
  const networkAddress = `Network: \n${network.join('\n')}`;
  const message = `\n\n${localAddress}\n\n${networkAddress}\n`;

  Logger.log(message, 'Bootstrap');
}
bootstrap();
