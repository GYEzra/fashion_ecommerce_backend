import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate_object_id.pipe';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { API_PARAM_QUERY } from 'src/common/constants/constants';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Tạo mới người dùng')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiParam(API_PARAM_QUERY)
  @ResponseMessage('Lấy danh sách người dùng')
  async findAll(@Query() query: string) {
    return await this.usersService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin người dùng')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật thông tin người dùng')
  async update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @User() user: IUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa người dùng')
  remove(@Param('id', ValidateObjectIdPipe) id: string, @User() user: IUser) {
    return this.usersService.remove(user, id);
  }
}
