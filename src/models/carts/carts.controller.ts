import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate_object_id.pipe';
import { ApplyPromotionDto } from '../promotions/dto/apply-promotion.dto';
import { ApplyAddressDto } from '../addresses/dto/apply-address.dto';
import { Public } from 'src/auth/auth.decorator';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { CartItemDto } from './dto/cart-item.dto';
import { RemoveCartItemsDto } from './dto/remove-cart-items.dto';

@ApiTags('carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @ResponseMessage('Tạo mới giỏ hàng')
  async create(@Body() createCartDto: CreateCartDto, @User() user: IUser) {
    return await this.cartsService.create(createCartDto, user._id);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin giỏ hàng')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.cartsService.findOne(id);
  }

  @Post(':id/items')
  @ResponseMessage('Thêm sản phẩm vào giỏ hàng')
  async addItem(@Param('id', ValidateObjectIdPipe) id: string, @Body() cartItemDto: CartItemDto) {
    return await this.cartsService.addItem(id, cartItemDto);
  }

  @Delete(':id/items/:itemId')
  @ResponseMessage('Xóa sản phẩm trong giỏ hàng')
  async remove(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Param('itemId', ValidateObjectIdPipe) itemId: string,
    @Body() removeCartDto: RemoveCartItemsDto,
  ) {
    return await this.cartsService.remove(id, itemId, removeCartDto.type);
  }

  @Post(':id/promotions')
  @ResponseMessage('Áp dụng mã giảm giá')
  async applyCoupon(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() applyPromotionDto: ApplyPromotionDto,
  ) {
    return await this.cartsService.applyPromotion(id, applyPromotionDto.coupon);
  }

  @Public()
  @ResponseMessage('Áp dụng địa chỉ nhận hàng')
  @Post(':id/addresses')
  async applyAddress(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() applyAddressDto: ApplyAddressDto,
  ) {
    return await this.cartsService.applyAddress(id, applyAddressDto.addressId);
  }
}
