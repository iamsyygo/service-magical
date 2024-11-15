import { NestFactory } from '@nestjs/core';
import { MenuModule } from './menu.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { basename, resolve } from 'path';
import { getAvailableNetworkAddresses } from 'shared/utils/os.util';
import { consoleAppName } from 'shared/utils/log.util';

async function bootstrap() {
  const app = await NestFactory.create(MenuModule);

  const configService = app.get(ConfigService);

  await app.startAllMicroservices();

  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');
  app.enableCors();
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('User API').build(),
  );
  SwaggerModule.setup('docs', app, document);

  const currentModule = basename(resolve(__dirname));
  const port: number = configService.get(
    currentModule.toLocaleUpperCase() + '_PORT',
    8031,
  );

  app.enableCors();
  await app.listen(port);

  const { local, network } = getAvailableNetworkAddresses(port);
  const localAddress = `   Local: \n   - ${local}`;
  const networkAddress = `   Network: \n   - ${network.join('\n   - ')}`;
  const message = `\n\n${localAddress}\n\n${networkAddress}\n`;
  Logger.verbose(message, 'App run at');
  consoleAppName(configService.get('APP_NAME'), currentModule);
}
bootstrap();