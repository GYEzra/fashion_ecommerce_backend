import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CartExists } from 'src/common/decorators/cart-exists.decorator';
import { PaymentMethod } from 'src/common/enums/enums';
import { OrderStatus } from 'src/common/enums/status.enum';

export class CreateOrderDto {
  @ApiProperty({
    example: '66b090c57336945ce1a69ffd',
    description: 'ID giỏ hàng',
    required: true,
  })
  @IsNotEmpty({ message: 'ID giỏ hàng không được bỏ trống' })
  @IsMongoId({ message: 'ID giỏ hàng phải là kiểu MongoID' })
  @CartExists()
  cartId: string;

  @ApiProperty({
    enum: PaymentMethod,
    example: 'Ví điện tử VNPay',
    description: 'Phương thức thanh toán',
    required: true,
  })
  @IsNotEmpty({ message: 'Phương thức thanh toán không được bỏ trống' })
  @IsEnum(PaymentMethod, { message: 'Phương thức thanh toán không hợp lệ' })
  payment_method: string;

  @ApiProperty({
    example: 'Giao hàng giờ hành chính',
    description: 'Ghi chú cho đơn hàng',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Ghi chú giao hàng phải là kiểu String' })
  note?: string;
}
