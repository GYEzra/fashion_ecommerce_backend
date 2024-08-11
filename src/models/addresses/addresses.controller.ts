import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate_object_id.pipe';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { ResponseMessage } from 'src/common/decorators/response.decorator';

@ApiTags('addresses')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ResponseMessage('Tạo mới địa chỉ')
  async create(@Body() createShippingAddressDto: CreateAddressDto, @User() user: IUser) {
    return await this.addressesService.create(createShippingAddressDto, user._id);
  }

  @Get()
  @ResponseMessage('Lấy danh sách địa chỉ')
  async findAllByUser(@User() user: IUser) {
    return await this.addressesService.findAllByUser(user._id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật địa chỉ')
  async update(@Param('id') _id: string, @Body() updateShippingAddressDto: UpdateAddressDto) {
    return await this.addressesService.update(_id, updateShippingAddressDto);
  }

  @Delete(':id')
  @ResponseMessage('Xóa địa chỉ')
  async remove(@Param('id') _id: string) {
    return await this.addressesService.remove(_id);
  }
}
