import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Danh mục 1',
    description: 'Tên danh mục',
    required: true,
  })
  @IsNotEmpty({ message: 'Name không được bỏ trống' })
  @IsString({ message: 'Name phải là kiểu String' })
  name: string;

  @ApiProperty({
    example: 'e2ccb489-21e0-43a5-9a8d-f1be2ef547cf.jpg',
    description: 'Hình ảnh danh mục',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Image phải là kiểu String' })
  image?: string;

  @ApiProperty({
    example: 'Mô tả danh mục 1',
    description: 'Mô tả danh mục',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description phải là kiểu String' })
  description?: string;
}
