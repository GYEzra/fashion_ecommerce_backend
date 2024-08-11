import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { RolesService } from '../roles/roles.service';
import aqp from 'api-query-params';
import { IUser } from 'src/common/interfaces/user.interface';
import { ConfigService } from '@nestjs/config';
var bcrypt = require('bcryptjs');

@Injectable()
export class UsersService {
  private readonly adminEmail: string;

  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    private readonly rolesService: RolesService,
    private readonly configService: ConfigService,
  ) {
    this.adminEmail = this.configService.get<string>('ADMIN_EMAIL');
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const hashedPassword = await this.getHashPassword(createUserDto.password);
    const role = await this.rolesService.findOne(createUserDto.roleId);

    if (!role) {
      throw new NotFoundException('Role không tồn tại');
    }

    return await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      role: role._id,
    });
  }

  async findAll(query: string) {
    console.warn(query);
    const { filter, sort, population } = aqp(query);
    const current = +filter.current || 1;
    const pageSize = +filter.pageSize || 10;
    delete filter.current;
    delete filter.pageSize;

    const totalItems = await this.userModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / pageSize);

    let defaultSort = sort ? (sort as unknown as string) : '-updatedAt';

    const result = await this.userModel
      .find(filter)
      .select('-password')
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .sort(defaultSort)
      .populate(population);

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Tài khoản không tồn tại');
    }

    return user;
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findUserByToken(refreshToken: string) {
    return await this.userModel.findOne({ refresh_token: refreshToken });
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    const existingUser = await this.findOne(id);

    if (existingUser.email === this.adminEmail) {
      throw new BadRequestException('Bạn không có quyền cập nhật tài khoản ADMIN');
    }

    return await this.userModel.updateOne(
      { _id: id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(user: IUser, id: string) {
    const existingUser = await this.findOne(id);

    if (existingUser.email === this.adminEmail) {
      throw new BadRequestException('Bạn không có quyền xóa tài khoản ADMIN');
    }

    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return this.userModel.softDelete({ _id: id });
  }

  async updateUserToken(_id: string, refresh_token: string) {
    return await this.userModel.updateOne({ _id }, { refresh_token });
  }

  async getHashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async isValidPassword(password: string, hashPassword: string) {
    return await bcrypt.compareSync(password, hashPassword);
  }
}
