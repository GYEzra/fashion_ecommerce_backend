import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'example@gmail.com',
    description: 'Email của người dùng',
    required: true,
  })
  @IsEmail({}, { message: 'Vui lòng nhập đúng định email' })
  @IsNotEmpty({ message: 'Email không được bỏ trống' })
  email: string;

  @ApiProperty({
    type: String,
    example: 'Example123@',
    description: 'Mật khẩu của người dùng',
    required: true,
  })
  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống' })
  @IsString({ message: 'Mật khẩu phải là kiểu String' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message: 'Mật khẩu tối thiểu 8 ký tự và bao gồm các ký tự in hoa, số và 1 ký tự đặc biệt',
    },
  )
  password: string;

  @ApiProperty({
    type: String,
    example: 'Nguyễn Văn A',
    description: 'Tên của người dùng',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên người dùng không được bỏ trống' })
  @IsString({ message: 'Tên người dùng phải là kiểu String' })
  fullname: string;

  @ApiProperty({
    type: String,
    example: '66acad58fc32612044cf6d0d',
    description: 'ID của vai trò',
    required: true,
  })
  @IsNotEmpty({ message: 'Role không được bỏ trống' })
  @IsMongoId({ message: 'Role phải là kiểu MongoId' })
  roleId: string;

  @ApiProperty({
    type: String,
    example: 'Sư Vạn Hạnh, Q.10, TPHCM',
    description: 'Địa chỉ của người dùng',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là kiểu String' })
  address?: string;
}
