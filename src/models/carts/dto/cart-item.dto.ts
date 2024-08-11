import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ColorsType, SizesType } from 'src/common/enums/enums';
import { ProductExists } from 'src/common/decorators/product-exists.decorator';

export class CartItemDto {
  @ApiProperty({
    description: 'ID sản phẩm',
    example: '64d8c080a78a9c46126a8a2a',
    required: true,
  })
  @IsNotEmpty({ message: 'ID sản phẩm không được để trống' })
  @IsString({ message: 'ID sản phẩm phải là kiểu String' })
  @ProductExists()
  productId: string;

  @ApiProperty({
    minimum: 1,
    maximum: 1000000,
    description: 'Số lượng sản phẩm',
    example: 1,
    required: true,
  })
  @IsNotEmpty({ message: 'Số lượng không được để trống' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'Số lượng không hợp lệ' },
  )
  @Min(1, { message: 'Số lượng phải lớn hơn 0' })
  @Max(1000000, { message: 'Số lượng không được lớn hơn 1.000.000' })
  quantity: number;

  @ApiProperty({
    type: String,
    enum: ColorsType,
    example: 'Màu sắc 1',
    required: true,
  })
  @IsNotEmpty({ message: 'Màu sắc không được để trống' })
  @IsString({ message: 'Màu sắc phải là kiểu String' })
  @IsEnum(ColorsType, { message: 'Màu sắc không hợp lệ' })
  color: string;

  @ApiProperty({
    type: String,
    enum: SizesType,
    example: 'Kích cỡ 1',
    required: true,
  })
  @IsNotEmpty({ message: 'Kích cỡ không được để trống' })
  @IsString({ message: 'Kích cỡ phải là kiểu String' })
  @IsEnum(SizesType, { message: 'Kích cỡ không hợp lệ' })
  size: string;
}
