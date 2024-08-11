import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/common/interfaces/user.interface';
import aqp from 'api-query-params';
import { RoleType } from 'src/common/enums/enums';
import { PermissionsService } from '../permissions/permissions.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class RolesService implements OnModuleInit {
  private permissionsService: PermissionsService;

  constructor(
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.permissionsService = this.moduleRef.get(PermissionsService, { strict: false });
  }

  async findAll(query: string) {
    const { filter, sort, population } = aqp(query);
    const current = +filter.current;
    const pageSize = +filter.pageSize;
    delete filter.current;
    delete filter.pageSize;

    filter.name = { $ne: RoleType.ADMIN };

    let offset = (current - 1) * pageSize;
    let limit = pageSize ? pageSize : 10;

    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);

    let defaultSort = sort ? (sort as unknown as string) : '-updatedAt';

    const result = await this.roleModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(defaultSort)
      .populate(population);

    return {
      meta: {
        current, //trang hiện tại
        pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    return await this.roleModel.findById(id).populate('permissions');
  }

  async findOneByName(name: string) {
    return await this.roleModel.findOne({ name });
  }

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, permissions } = createRoleDto;

    const existingRole = await this.roleModel.findOne({ name });
    if (existingRole) {
      throw new BadRequestException(`Role ${name} đã tồn tại!`);
    }

    const invalidPermissions = await this.permissionsService.checkExistPermissions(permissions);
    if (invalidPermissions.length > 0) {
      throw new NotFoundException(`Permissions không tồn tại: ${invalidPermissions.join(', ')}`);
    }

    return await this.roleModel.create({
      ...createRoleDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async update(_id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    const role = await this.roleModel.findOne({ _id });
    if (role && role.name === RoleType.ADMIN) {
      throw new BadRequestException('Bạn không được phép cập nhật Role ADMIN');
    }

    const invalidPermissions = await this.permissionsService.checkExistPermissions(
      updateRoleDto.permissions,
    );
    if (invalidPermissions.length > 0) {
      throw new NotFoundException(`Permissions không tồn tại: ${invalidPermissions.join(', ')}`);
    }

    return await this.roleModel.updateOne(
      { _id },
      {
        ...updateRoleDto,
        updatedBy: {
          _id: user._id,
          email: user._id,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    const role = await this.roleModel.findOne({ _id: id });

    if (role && role.name === RoleType.ADMIN)
      throw new BadRequestException('Bạn không được phép xóa Role ADMIN');

    await this.roleModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.roleModel.softDelete({ _id: id });
  }
}
