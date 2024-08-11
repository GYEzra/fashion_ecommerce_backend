import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDate,
  IsNotEmpty,
  Min,
  Max,
  MinDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CouponStatus, DiscountType } from 'src/common/enums/enums';

export class CreatePromotionDto {
  @ApiProperty({
    type: String,
    example: 'SUMMER2023',
    description: 'Mã khuyến mãi',
    required: true,
  })
  @IsNotEmpty({ message: 'Mã khuyến mãi không được bỏ trống' })
  @IsString({ message: 'Mã khuyến mãi phải là kiểu String' })
  coupon: string;

  @ApiProperty({
    type: String,
    enum: CouponStatus,
    example: 'Không hoạt động',
    description: 'Trạng thái của mã khuyến mãi',
    required: true,
  })
  @IsNotEmpty({ message: 'Trạng thái không được bỏ trống' })
  @IsEnum(CouponStatus, {
    message: 'Trạng thái không hợp lệ',
  })
  status: string;

  @ApiProperty({
    type: String,
    example: 'Giảm giá mùa hè',
    description: 'Mô tả cho mã khuyến mãi',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là kiểu String' })
  description?: string;

  @ApiProperty({
    type: Number,
    example: 100000,
    description: 'Số tiền giảm giá',
    required: true,
  })
  @IsNotEmpty({ message: 'Số tiền giảm giá không được bỏ trống' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'Số tiền giảm giá không hợp lệ' },
  )
  @Min(0, { message: 'Số tiền giảm giá tối thiểu là 0 VND' })
  @Max(500000000, { message: 'Số tiền giảm giá tối đa là 500.000.000 VND' })
  discount_amount: number;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Miễn phí vận chuyển',
    required: true,
  })
  @IsNotEmpty({ message: 'Miễn phí vận chuyển không được bỏ trống' })
  @IsBoolean({ message: 'Miễn phí vận chuyển phải là kiểu Boolean ' })
  free_shipping: boolean;

  @ApiProperty({
    type: String,
    enum: DiscountType,
    example: 'Phần trăm',
    description: 'Loại giảm giá',
    required: true,
  })
  @IsNotEmpty({ message: 'Loại giảm giá không được bỏ trống' })
  @IsEnum(DiscountType, { message: 'Loại giảm giá không hợp lệ' })
  discount_type: string;

  @ApiProperty({
    type: Number,
    example: 1000000,
    description: 'Điều kiện áp dụng mã khuyến mãi (Tổng giá trị đơn hàng)',
    required: false,
  })
  @IsOptional()
  condition: number; // Điều kiện là tổng giá trị đơn hàng - (Mở rộng: Minimum_purchase, Specific_products, Customer_group)

  @ApiProperty({
    type: Date,
    example: '2023-06-01T00:00:00.000Z',
    description: 'Ngày bắt đầu áp dụng mã khuyến mãi',
    required: true,
  })
  @IsNotEmpty({ message: 'Ngày bắt đầu không được bỏ trống' })
  @IsDate({ message: 'Ngày bắt đầu phải là kiểu Date' })
  @MinDate(new Date(), { message: 'Ngày bắt đầu phải lớn hơn ngày hiện tại' })
  @Type(() => Date)
  start_date: Date;

  @ApiProperty({
    type: Date,
    example: '2023-07-31T00:00:00.000Z',
    description: 'Ngày kết thúc áp dụng mã khuyến mãi',
    required: true,
  })
  @IsNotEmpty({ message: 'Ngày kết thúc không được bỏ trống' })
  @IsDate({ message: 'Ngày kết thúc phải là kiểu Date' })
  @MinDate(new Date(), { message: 'Ngày kết thúc phải lớn hơn ngày hiện tại' })
  @Type(() => Date)
  end_date: Date;
}
