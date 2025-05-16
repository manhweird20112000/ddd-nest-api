import * as uuid from 'uuid';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as sharp from 'sharp';
import * as process from 'node:process';

type IImageOptionType = 'original' | '16x9' | '4x3' | 'square';

interface IImageOptions {
  accepts?: string[];
  maxSize?: number;
  type?: IImageOptionType;
  folder?: string;
}

interface IImageCropMetadata {
  width: number;
  height: number;
  left: number;
  top: number;
  format: string;
}

export class ImageUtils {
  static basePath = path.join(process.cwd(), 'storages');

  static async storage(
    file: Express.Multer.File,
    options: IImageOptions = {
      accepts: ['image/jpeg', 'image/png'],
      maxSize: 1024 * 1024,
      type: 'original',
      folder: 'user',
    },
  ): Promise<string> {
    const { accepts, maxSize, type = 'original', folder = 'user' } = options;

    const pathStorage = path.join(this.basePath, folder);

    if (!fs.existsSync(pathStorage)) {
      fs.mkdirSync(pathStorage, { recursive: true });
    }

    const filename = uuid.v7() + '.webp';

    const metadata = await this.getCropMetadata(file, type);

    const image = sharp(file.buffer);

    switch (metadata.format) {
      case 'jpeg':
        image.jpeg({ quality: 80 });
        break;
      case 'png':
        image.png({ compressionLevel: 5 });
        break;
      case 'webp':
        image.webp({ quality: 80 });
        break;
    }

    if (metadata.format !== 'webp') {
      image.extract(metadata).toFormat('webp', { quality: 80 });
    }
    await image.toFile(path.join(pathStorage, filename));
    return filename;
  }

  static async getCropMetadata(
    file: Express.Multer.File,
    type?: IImageOptionType,
  ): Promise<IImageCropMetadata> {
    const metadata = await sharp(file.buffer).metadata();

    const data: IImageCropMetadata = {
      width: metadata.width,
      height: metadata.height,
      left: 0,
      top: 0,
      format: metadata.format,
    };
    switch (type) {
      case '4x3':
        data.width = Math.floor(metadata.height * (4 / 3));
        data.left = Math.floor((metadata.width - data.width) / 2);
        return data;
      case '16x9':
        data.height = Math.floor(metadata.height / (16 / 9));
        data.top = Math.floor((metadata.height - data.height) / 2);
        return data;
      case 'square':
        data.width = data.height = Math.min(metadata.width, metadata.height);
        data.left = Math.floor((metadata.width - data.width) / 2);
        return data;
      default:
        return data;
    }
  }
}
