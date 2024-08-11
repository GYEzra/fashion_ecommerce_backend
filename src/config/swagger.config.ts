import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('Danh sách API thương hiệu K-Project')
  .setDescription('API chuyên biệt cho việc quản lý và tự động hóa các hoạt động bán hàng.')
  .setVersion('1.0.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'Bearer',
      bearerFormat: 'JWT',
      in: 'header',
    },
    'token',
  )
  .addSecurityRequirements('token')
  .build();
