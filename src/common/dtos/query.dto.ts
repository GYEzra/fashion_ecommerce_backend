import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @ApiProperty({
    required: false,
    type: String,
    example: 'current=1&pageSize=2&populate=role&fields=-fullname&fullname=Khánh&sort=createdAt',
    description:
      'Build query string để thực hiện phân trang, tìm kiếm, sắp xếp, lấy thêm dữ liệu từ Related documents',
  })
  @IsOptional()
  @IsString({ message: 'Query string phải là kiểu String' })
  qs: string;
}
