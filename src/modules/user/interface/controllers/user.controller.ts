import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ImageUtils } from '@/shared/utils/image';

@Controller({
  version: '1',
  path: 'users',
})
export class UserController {
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return ImageUtils.storage(file, { type: 'square' });
  }
}
