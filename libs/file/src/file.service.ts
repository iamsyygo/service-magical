import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { MINIO_CLIENT } from 'shared/constants';

@Injectable()
export class FileService {
  @Inject(MINIO_CLIENT)
  private minioClient: Client;
}
