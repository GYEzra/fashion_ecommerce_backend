import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ColorsType, SizesType } from 'src/common/enums/enums';

export class CreateProductDto {
  @ApiProperty({
    description: 'Mã định danh sản phẩm',
    example: 'SKU 1',
    required: true,
  })
  @IsNotEmpty({ message: 'SKU không được trống' })
  @IsString({ message: 'SKU phải là kiểu String' })
  sku: string;

  @ApiProperty({
    description: 'Tên sản phẩm',
    example: 'Sản phẩm 1',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên sản phẩm không được trống' })
  @IsString({ message: 'Tên sản phẩm phải là kiểu String' })
  name: string;

  @ApiProperty({
    minimum: 0,
    maximum: 1000000000,
    description: 'Giá bán',
    example: 100000,
    required: true,
  })
  @IsNotEmpty({ message: 'Giá không được trống' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'Giá không hợp lệ' },
  )
  @Min(0, { message: 'Giá không được nhỏ hơn 0' })
  @Max(1000000000, { message: 'Giá không được lớn hơn 1.000.000.000 VND' })
  price: number;

  @ApiProperty({
    type: [String],
    enumName: 'Màu sắc hợp lệ:',
    enum: ColorsType,
    example: ['Màu sắc 1', 'Màu sắc 2'],
    required: true,
  })
  @IsNotEmpty({ message: 'Màu sắc không được trống' })
  @IsArray({ message: 'Màu sắc phải là kiểu Array' })
  @IsEnum(ColorsType, { each: true, message: 'Màu sắc không hợp lệ' })
  colors: string[];

  @ApiProperty({
    type: [String],
    enumName: 'Kích cỡ hợp lệ:',
    enum: SizesType,
    example: ['Kích cỡ 1', 'Kích cỡ 2'],
    required: true,
  })
  @IsNotEmpty({ message: 'Kích cỡ không được trống' })
  @IsArray({ message: 'Kích cỡ phải là kiểu Array' })
  @IsEnum(SizesType, { each: true, message: 'Kích cỡ không hợp lệ' })
  sizes: string[];

  @ApiProperty({
    minimum: 0,
    maximum: 1000000,
    description: 'Số lượng kho',
    example: 100,
    required: true,
  })
  @IsNotEmpty({ message: 'Số lượng kho không được trống' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'Số lượng kho không hợp lệ' },
  )
  @Min(0, { message: 'Số lượng kho không được nhỏ hơn 0' })
  @Max(1000000, { message: 'Số lượng kho không được lớn hơn 1.000.000 VND' })
  stock: number;

  @ApiProperty({
    description: 'ID danh mục sản phẩm',
    example: '64d8c080a78a9c46126a8a2a',
    required: true,
  })
  @IsNotEmpty({ message: 'ID danh mục không được trống' })
  @IsMongoId({ message: 'ID danh mục phải là kiểu MongoId' })
  categoryId: string;

  @ApiProperty({
    type: [String],
    description: 'Lưu ý: thực hiện upload file để có tên hình ảnh',
    example: [
      '906a3aa4-870a-4922-a418-2cdad00d09e2.jpg',
      'e2ccb489-21e0-43a5-9a8d-f1be2ef547cf.jpg',
    ],
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Hình ảnh phải là kiểu String', each: true })
  images?: string[];

  @ApiProperty({
    description: 'Mô tả sản phẩm',
    example: 'Sản phẩm 1',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là kiểu String' })
  description?: string;

  @ApiProperty({
    description: 'Chất liệu sản phẩm',
    example: 'Chất liệu 1',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Chất liệu phải là kiểu String' })
  fabric?: string;

  @ApiProperty({
    description: 'Hướng dẫn bảo quản sản phẩm',
    example: 'Hướng dẫn bảo quản 1',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Hướng dẫn bảo quản phải là kiểu String' })
  care_instructions: string;
}
