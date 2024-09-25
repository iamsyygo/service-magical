import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { ConfigService } from '@nestjs/config';
import { MINIO_CLIENT } from 'shared/constants';
import { Client } from 'minio';

@Module({
  providers: [
    ConfigService,
    FileService,
    {
      inject: [ConfigService],
      provide: MINIO_CLIENT,
      async useFactory(configService) {
        const endPoint = configService.get('MINIO_ENDPOINT');
        const port = configService.get('MINIO_PORT');
        const useSSL = configService.get('MINIO_USE_SSL');
        const accessKey = configService.get('MINIO_ACCESS_KEY');
        const secretKey = configService.get('MINIO_SECRET_KEY');
        const config = { endPoint, port, useSSL, accessKey, secretKey };
        const client = new Client(config);
        return client;
      },
    },
  ],
  exports: [FileService],
})
export class FileModule {}
