import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from 'src/common/enums/status.enum';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: 'Chờ xử lý',
    description: 'Trạng thái đơn hàng',
    required: true,
  })
  @IsNotEmpty({ message: 'Trạng thái đơn hàng không được bỏ trống' })
  @IsEnum(OrderStatus, { message: 'Trạng thái đơn hàng không hợp lệ' })
  order_status: string;
}
