import { NestFactory } from '@nestjs/core';
import { BrowserModule } from './browser.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getAvailableNetworkAddresses } from 'shared/utils/os.util';
import { basename, resolve } from 'path';
import { consoleAppName } from 'shared/utils/log.util';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(BrowserModule);
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('Browser API').build(),
  );
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);
  const port: number = 8003;
  await app.listen(port);

  const { local, network } = getAvailableNetworkAddresses(port);
  const localAddress = `   Local: \n   - ${local}`;
  const networkAddress = `   Network: \n   - ${network.join('\n   - ')}`;
  const message = `\n\n${localAddress}\n\n${networkAddress}\n`;
  const currentModule = basename(resolve(__dirname));
  Logger.verbose(message, 'App run at');
  consoleAppName(configService.get('APP_NAME'), currentModule);
}
bootstrap();
