import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './models/users/users.module';
import { RolesModule } from './models/roles/roles.module';
import { PermissionsModule } from './models/permissions/permissions.module';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { CategoriesModule } from './models/categories/categories.module';
import { ProductsModule } from './models/products/products.module';
import { ReviewsModule } from './models/reviews/reviews.module';
import { PromotionsModule } from './models/promotions/promotions.module';
import { CartsModule } from './models/carts/carts.module';
import { OrdersModule } from './models/orders/orders.module';
import { AddressesModule } from './models/addresses/addresses.module';
import { FilesModule } from './models/files/files.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { CartExistsRule } from './common/validators/cart-exists.rule';
import { ProductExistsRule } from './common/validators/product-exists.rule';

const modelModule = [
  AuthModule,
  UsersModule,
  RolesModule,
  PermissionsModule,
  CategoriesModule,
  ProductsModule,
  ReviewsModule,
  PromotionsModule,
  AddressesModule,
  OrdersModule,
  CartsModule,
  FilesModule,
  CartsModule,
  DatabaseModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: connection => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ...modelModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    CartExistsRule,
    ProductExistsRule,
  ],
})
export class AppModule {}
