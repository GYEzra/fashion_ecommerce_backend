import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class ApplyAddressDto {
  @ApiProperty({
    example: '66b0455e98a0e7320cc312f7',
    description: 'Mã địa chỉ nhận hàng',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'AddressId phải là kiểu MongoId' })
  addressId: string;
}
