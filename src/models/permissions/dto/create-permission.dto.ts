import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'Fetch users with paginate',
    description: 'Tên của permission',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên Permission không được bỏ trống' })
  @IsString({ message: 'Tên Permission phải là String' })
  name: string;

  @ApiProperty({
    example: '/api/v1/users',
    description: 'Path của permission (dùng /api/v1/{tên route})',
    required: true,
  })
  @IsNotEmpty({ message: 'ApiPath không được bỏ trống' })
  @IsString({ message: 'ApiPath phải là String' })
  apiPath: string;

  @ApiProperty({
    example: 'GET',
    description: 'Method của permission',
    required: true,
  })
  @IsNotEmpty({ message: 'Method không được bỏ trống' })
  @IsString({ message: 'Method phải là String' })
  method: string;

  @ApiProperty({
    example: 'USERS',
    description: 'Module chứa các permission giống kiểu category',
    required: true,
  })
  @IsString({ message: 'Module phải là String' })
  @IsNotEmpty({ message: 'Module không được bỏ trống' })
  module: string;
}
