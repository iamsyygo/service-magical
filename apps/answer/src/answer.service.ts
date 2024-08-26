import { Injectable } from '@nestjs/common';

@Injectable()
export class AnswerService {
  getHello(): string {
    return 'This is the answer app';
  }
}
