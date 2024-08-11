import { ApiProperty, IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateAddressDto } from 'src/models/addresses/dto/create-address.dto';
import { PaymentMethod } from 'src/common/enums/enums';

export class UpdateOrderDto extends PartialType(
  PickType(CreateOrderDto, ['payment_method', 'note'] as const),
) {
  @ApiProperty({
    type: String,
    example: 'Nguyễn Văn A',
    description: 'Họ và tên người nhận',
    required: false,
  })
  @IsString({ message: 'Họ và tên phải là kiểu String' })
  customer_full_name: string;

  @ApiProperty({
    type: String,
    example: '0987654321',
    description: 'Số điện thoại liên lạc',
    required: false,
  })
  @IsString({ message: 'Số điện thoại phải là kiểu String' })
  customer_phone_number: string;

  @ApiProperty({
    enum: PaymentMethod,
    example: 'Ví điện tử VNPay',
    description: 'Phương thức thanh toán',
    required: false,
  })
  @IsEnum(PaymentMethod, { message: 'Phương thức thanh toán không hợp lệ' })
  payment_method: string;

  @ApiProperty({
    type: String,
    example: '123 Đường ABC, Phường XYZ, Quận DEF, TPHCM',
    description: 'Địa chỉ cụ thể',
    required: false,
  })
  @IsString({ message: 'Địa chỉ phải là kiểu String' })
  shipping_address: string;
}
