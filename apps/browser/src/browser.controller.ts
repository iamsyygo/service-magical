import {
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BrowserService } from './browser.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';

@Controller()
export class BrowserController {
  constructor(private readonly browserService: BrowserService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      // dest: 'uploads',
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '文件',
        },
      },
    },
  })
  @Put('upload')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    this.browserService.uploadFile(file);
  }
}
