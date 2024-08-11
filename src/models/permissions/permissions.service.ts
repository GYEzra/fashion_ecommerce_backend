import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/common/interfaces/user.interface';
import aqp from 'api-query-params';
import { CUSTOM_MESSAGES } from 'src/common/enums/custom-messages.enum';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const permission = await this.permissionModel.findOne({
      apiPath: createPermissionDto.apiPath,
      method: createPermissionDto.method,
    });

    if (permission) throw new BadRequestException(CUSTOM_MESSAGES.PERMISSION_EXIST);

    let result = await this.permissionModel.create({
      ...createPermissionDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: result.id,
      createdAt: result.createdAt,
    };
  }

  async findAll(query: string) {
    const { filter, sort, population, projection } = aqp(query);
    const current = +filter.current;
    const pageSize = +filter.pageSize;
    delete filter.current;
    delete filter.pageSize;

    let offset = (current - 1) * pageSize;
    let limit = pageSize ? pageSize : 10;

    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);

    let defaultSort = sort ? (sort as unknown as string) : '-updatedAt';

    const result = await this.permissionModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(defaultSort)
      .populate(population);

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(_id: string) {
    return await this.permissionModel.findById(_id);
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    return await this.permissionModel.updateOne(
      { _id: id },
      {
        ...updatePermissionDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.permissionModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return await this.permissionModel.softDelete({ _id: id });
  }

  async checkExistPermissions(permissions: string[]): Promise<string[]> {
    return permissions.filter(
      async permission => !(await this.permissionModel.findOne({ _id: permission })),
    );
  }
}
