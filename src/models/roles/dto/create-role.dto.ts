import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @ApiProperty({
    example: 'ADMIN',
    description: 'Tên vai trò',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên Role không được bỏ trống' })
  @IsString({ message: 'Tên Role phải là kiểu String' })
  name: string;

  @ApiProperty({
    type: [String],
    example: ['66acbd21063ecc329966db01', '66acbe9d87b37e9a46ed0a2d'],
    description: 'Danh sách ID của các permission (chưa có thì để [])',
    required: true,
  })
  @IsArray({ message: 'Permissions phải là kiểu Array' })
  @IsMongoId({ each: true, message: 'Permission phải là kiểu ObjectId' })
  @IsNotEmpty({ message: 'Permission không được bỏ trống' })
  permissions: string[];

  @ApiProperty({
    example: false,
    description: 'Trạng thái của vai trò',
    required: true,
  })
  @IsBoolean({ message: 'Trạng thái phải là kiểu Boolean' })
  @IsNotEmpty({ message: 'Trạng thái không được bỏ trống' })
  isActive: boolean;

  @ApiProperty({
    example: 'Đây là vai trò của ABCXYZ',
    description: 'Mô tả của vai trò',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là kiểu String' })
  description: string;
}
