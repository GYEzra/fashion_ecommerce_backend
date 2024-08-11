import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { CartRemoveType } from '../cart-remove-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveCartItemsDto {
  @ApiProperty({
    example: 'DECREASE',
    enum: CartRemoveType,
    required: true,
  })
  @IsNotEmpty({ message: 'Loại không được để trống' })
  @IsEnum(CartRemoveType, { message: 'Loại không hợp lệ' })
  type: string;
}
