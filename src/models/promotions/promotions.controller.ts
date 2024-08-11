import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate_object_id.pipe';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { Public } from 'src/auth/auth.decorator';
import { API_PARAM_QUERY } from 'src/common/constants/constants';

@ApiTags('promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @ResponseMessage('Tạo mới mã giảm giá')
  async create(@Body() createPromotionDto: CreatePromotionDto, @User() user: IUser) {
    return await this.promotionsService.create(createPromotionDto, user);
  }

  @Get()
  @Public()
  @ApiQuery(API_PARAM_QUERY)
  @ResponseMessage('Lấy danh sách mã giảm giá')
  async findAll(@Query('qs') qs: string) {
    return await this.promotionsService.findAll(qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Lấy thông tin mã giảm giá')
  async findOne(@Param('id', ValidateObjectIdPipe) _id: string) {
    return await this.promotionsService.findOne(_id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật thông tin mã giảm giá')
  async update(
    @Param('id', ValidateObjectIdPipe) _id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
    @User() user: IUser,
  ) {
    return await this.promotionsService.update(_id, updatePromotionDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa mã giảm giá')
  async remove(@Param('id', ValidateObjectIdPipe) _id: string, user: IUser) {
    return await this.promotionsService.remove(_id, user);
  }
}
