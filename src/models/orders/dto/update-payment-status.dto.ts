import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentStatus } from 'src/common/enums/enums';

export class UpdatePaymentStatusDto {
  @ApiProperty({
    enum: PaymentStatus,
    example: 'Đang chờ xử lý',
    description: 'Trạng thái thanh toán',
    required: true,
  })
  @IsNotEmpty({ message: 'Trạng thái thanh toán không được bỏ trống' })
  @IsEnum(PaymentStatus, { message: 'Trạng thái thanh toán không hợp lệ' })
  payment_status: string;
}
