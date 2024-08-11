import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/models/roles/schemas/role.schema';
import { User, UserSchema } from 'src/models/users/schemas/user.schema';
import { Permission, PermissionSchema } from 'src/models/permissions/schemas/permission.schema';
import { UsersService } from 'src/models/users/users.service';
import { RolesService } from 'src/models/roles/roles.service';

@Module({
  controllers: [DatabaseController],
  providers: [DatabaseService, UsersService, RolesService],
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
})
export class DatabaseModule {}
