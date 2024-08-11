import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemDto } from './cart-item.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ProductExists } from 'src/common/decorators/product-exists.decorator';
export class CreateCartDto {
  @ApiProperty({
    description: 'Danh sách sản phẩm trong giỏ hàng',
    type: [CartItemDto],
    required: true,
    example: [
      {
        productId: '66b585d13bbbf0141a9d284a',
        quantity: 1,
        color: 'Màu sắc 1',
        size: 'Kích cỡ 1',
      },
      {
        productId: '66b585da09162457ad25baea',
        quantity: 2,
        color: 'Màu sắc 2',
        size: 'Kích cỡ 2',
      },
    ],
  })
  @IsNotEmpty({ message: 'items không được để trống' })
  @IsArray({ message: 'items phải là kiểu Array' })
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
