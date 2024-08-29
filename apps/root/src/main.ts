import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getAvailableNetworkAddresses } from 'shared/utils/os.util';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { consoleAppName } from 'shared/utils/log.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port: number = 8000;
  const configService = app.get(ConfigService);

  app.enableCors();
  await app.listen(port);
  const { local, network } = getAvailableNetworkAddresses(port);
  const localAddress = `   Local: \n   - ${local}`;
  const networkAddress = `   Network: \n   - ${network.join('\n   - ')}`;
  const message = `\n\n${localAddress}\n\n${networkAddress}\n`;

  Logger.verbose(message, 'App run at');
  consoleAppName(configService.get('APP_NAME'));
}
bootstrap();
