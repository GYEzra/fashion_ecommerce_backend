import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    type: String,
    example: 'Nguyễn Văn A',
    description: 'Họ và tên người nhận',
    required: true,
  })
  @IsNotEmpty({ message: 'Họ và tên không được bỏ trống' })
  @IsString({ message: 'Họ và tên phải là kiểu String' })
  fullName: string;

  @ApiProperty({
    type: String,
    example: '123 Đường ABC, Phường XYZ, Quận DEF',
    description: 'Địa chỉ cụ thể',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên đường không được bỏ trống' })
  @IsString({ message: 'Tên đường phải là kiểu String' })
  streetAddress: string;

  @ApiProperty({
    type: String,
    example: 'TP. Hồ Chí Minh',
    description: 'Tên tỉnh/thành phố',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên tỉnh không được bỏ trống' })
  @IsString({ message: 'Tên tỉnh phải là kiểu String' })
  province: string;

  @ApiProperty({
    type: String,
    example: '0987654321',
    description: 'Số điện thoại liên lạc',
    required: true,
  })
  @IsNotEmpty({ message: 'Số điện thoại không được bỏ trống' })
  @IsString({ message: 'Số điện thoại phải là kiểu String' })
  phoneNumber: string;
}
