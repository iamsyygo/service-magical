import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyseService {
  getHello(): string {
    return 'This is the analyse app';
  }
}
