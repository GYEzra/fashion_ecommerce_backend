import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate_object_id.pipe';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { API_PARAM_QUERY } from 'src/common/constants/constants';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ResponseMessage('Tạo mới đơn hàng')
  async create(@Body() createOrderDto: CreateOrderDto, @User() user: IUser) {
    return await this.ordersService.create(createOrderDto, user);
  }

  @Get()
  @ApiQuery(API_PARAM_QUERY)
  @ResponseMessage('Lấy danh sách đơn hàng')
  findAll(@Query('qs') qs: string) {
    return this.ordersService.findAll(qs);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin đơn hàng')
  async findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật thông tin đơn hàng')
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @User() user: IUser,
  ) {
    return this.ordersService.update(id, updateOrderDto, user);
  }

  @Patch(':id/status')
  @ResponseMessage('Cập nhật trạng thái đơn hàng')
  async updateOrderStatus(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return await this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Patch(':id/payment-status')
  @ResponseMessage('Cập nhật trạng thái thanh toán')
  async updatePaymentStatus(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    return await this.ordersService.updatePaymentStatus(id, updatePaymentStatusDto);
  }
}
