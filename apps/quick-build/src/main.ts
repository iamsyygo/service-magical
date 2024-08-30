import { NestFactory } from '@nestjs/core';
import { QuickBuildModule } from './quick-build.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getAvailableNetworkAddresses } from 'shared/utils/os.util';
import { basename, resolve } from 'path';
import { consoleAppName } from 'shared/utils/log.util';
declare global {
  interface BigInt {
    toJSON(): string | number;
  }
}
async function bootstrap() {
  const app = await NestFactory.create(QuickBuildModule);
  /**
   * fix: Do not know how to serialize a BigInt
   * see: https://github.com/prisma/studio/issues/614
   */
  BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
  };

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 8085,
    },
  });

  const configService = app.get(ConfigService);

  await app.startAllMicroservices();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors();
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('User API').build(),
  );
  SwaggerModule.setup('docs', app, document);

  const port: number = 8005;

  app.enableCors();
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
