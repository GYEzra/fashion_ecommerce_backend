import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from 'src/models/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/models/roles/schemas/role.schema';
import { User, UserDocument } from 'src/models/users/schemas/user.schema';
import { UsersService } from 'src/models/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './master-data';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get<string>('HAS_INIT') === 'true' ? true : false;

    if (isInit) {
      const countPermission = await this.permissionModel.countDocuments({});
      const countRole = await this.roleModel.countDocuments({});
      const countUser = await this.userModel.countDocuments({});

      if (countPermission === 0) await this.permissionModel.insertMany(INIT_PERMISSIONS);

      if (countRole === 0) {
        const permissions = await this.permissionModel.find({}).select('_id');
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'Admin full quyền',
            isActive: true,
            permissions: permissions,
          },
          {
            name: USER_ROLE,
            description: 'USER không có quyền',
            isActive: true,
            permissions: [
              '66b1a082dceab9ffa83859b2',
              '66b1a0f083f52957f939db71',
              '648ab750fa16b294212e404c',
              '66b48f8f40dcef39a3b69366',
              '648ad4fedafdb9754f40b863',
              '648ad511dafdb9754f40b868',
              '648ad522dafdb9754f40b86d',
              '648ad53bdafdb9754f40b872',
              '66b23378479f3a391f6de1d1',
              '648ad56ddafdb9754f40b87c',
              '66b1907d501d62fae994efde',
              '66b191a1f6b6fb427a86fbcf',
              '66b191a9ec8b8a81d95f0529',
              '66b191af653fc6a655b6bfb5',
              '66b192b2cf1438d644e4b1d8',
              '66b192dba213d537f77e9de5',
              '66b192ece8ba550a7158c94a',
              '66b1934e8101f94033fdd60d',
              '66b1936b1d011920962d999c',
              '66b1937104add905a56447d8',
            ],
          },
        ]);
      }

      if (countUser === 0) {
        const roleAdmin = await this.roleModel.findOne({ name: ADMIN_ROLE });
        const roleUser = await this.roleModel.findOne({ name: USER_ROLE });
        const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
        const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
        const password = await this.userService.getHashPassword(adminPassword);

        await this.userModel.insertMany([
          {
            email: 'user@gmail.com',
            password: password,
            fullname: 'Người dùng',
            address: 'TPHCM',
            role: roleUser._id,
          },
          {
            email: adminEmail,
            password: password,
            fullname: 'Quản trị viên',
            address: 'TPHCM',
            role: roleAdmin._id,
          },
        ]);

        this.logger.log('Init Data Success');
      }
    }
  }
}
