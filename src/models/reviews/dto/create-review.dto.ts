import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import mongoose from 'mongoose';

export class CreateReviewDto {
  @ApiProperty({
    type: String,
    example: '66ae2bf115e4b8f80d4d15c5',
    description: 'Product ID',
    required: true,
  })
  @IsMongoId({ message: 'Product phải là kiểu MongoID' })
  @IsNotEmpty({ message: 'Product không được bỏ trống' })
  productId: string;

  @ApiProperty({
    example: 5,
    description: 'Điểm đánh giá',
    required: true,
  })
  @IsNotEmpty({ message: 'Score không được bỏ trống' })
  @IsNumber(
    { allowInfinity: false, maxDecimalPlaces: 0, allowNaN: false },
    { message: 'Score phải từ 1 - 5' },
  )
  @Min(1, { message: 'Score không được nhỏ hơn 1' })
  @Max(5, { message: 'Score không được lớn hơn 5' })
  score: number;

  @ApiProperty({
    example: 'Sản phẩm tuyệt vời',
    description: 'Nội dung đánh giá',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Comment phải là kiểu String' })
  comment?: string;
}
