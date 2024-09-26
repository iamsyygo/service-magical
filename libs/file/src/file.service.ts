import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, hash } from 'crypto';
import { Client } from 'minio';
import { MINIO_CLIENT } from 'shared/constants';

@Injectable()
export class FileService {
  @Inject(MINIO_CLIENT)
  private readonly minioClient: Client;

  bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get('MINIO_BUCKET');
    if (!this.bucketName) {
      Logger.error('缺少 minio bucket 配置', 'FileService');
    }
  }

  createHash(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }
  createHashFileName(data: string) {
    const now = Date.now();
    const hashFileName = this.createHash(data).substring(0, 8);
    return `${data}_${now}_${hashFileName}`;
  }

  getMinioClient(key: string): Client {
    if (key === MINIO_CLIENT) {
      return this.minioClient;
    }
  }

  async deleteFile(objectName: string, bucketName?: string) {
    return this.minioClient.removeObject(
      bucketName || this.bucketName,
      objectName,
    );
  }

  // 获取预签名，预签名的 GET URL，用于从 Minio 存储中读取文件
  async createGetPresignedUrl(objectName: string, bucketName?: string) {
    return this.minioClient.presignedGetObject(
      bucketName || this.bucketName,
      objectName,
    );
  }

  // 获取预签名，预签名的 PUT URL，用于向 Minio 存储中上传文件
  async createPutPresignedUrl(filename: string, bucketName?: string) {
    return this.minioClient.presignedPutObject(
      bucketName || this.bucketName,
      this.createHashFileName(filename),
    );
  }
}
