import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { User } from 'src/common/decorators/user.decorator';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate_object_id.pipe';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryDto } from 'src/common/dtos/query.dto';
import { API_PARAM_QUERY } from 'src/common/constants/constants';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ResponseMessage('Tạo mới vai trò')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @ResponseMessage('Lấy danh sách vai trò với phân trang')
  @Get()
  @ApiQuery(API_PARAM_QUERY)
  findAll(@Query('qs') qs: string) {
    return this.rolesService.findAll(qs);
  }

  @ResponseMessage('Lấy thông tin của vai trò')
  @Get(':id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @ResponseMessage('Cập nhật thông tin của một vai trò')
  @Patch(':id')
  update(
    @Param('id', ValidateObjectIdPipe) _id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: IUser,
  ) {
    return this.rolesService.update(_id, updateRoleDto, user);
  }

  @ResponseMessage('Xóa một vai trò')
  @Delete(':id')
  remove(@Param('id', ValidateObjectIdPipe) id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
