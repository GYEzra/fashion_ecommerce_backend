import { ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty({ message: 'Không có file để upload' })
  file: Express.Multer.File;
}
