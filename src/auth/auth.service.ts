import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as ms from 'node_modules/ms';
import { CUSTOM_MESSAGES } from 'src/common/enums/custom-messages.enum';
import { USER_ROLE } from 'src/database/master-data';
import { RolesService } from 'src/models/roles/roles.service';
import { CreateUserDto } from 'src/models/users/dto/create-user.dto';
import { RegisterUserDto } from 'src/models/users/dto/register-user.dto';
import { UsersService } from 'src/models/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly rolesService: RolesService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(username);

    if (user) {
      const isValidPassword = await this.usersService.isValidPassword(password, user.password);
      if (isValidPassword) return user;
    }

    return null;
  }

  async signUp(registerUserDto: RegisterUserDto) {
    const userRole = await this.rolesService.findOneByName(USER_ROLE);
    const createUserDto: CreateUserDto = {
      email: registerUserDto.email,
      password: registerUserDto.password,
      fullname: registerUserDto.fullname,
      roleId: userRole._id as unknown as string,
    };

    const user = await this.usersService.create(createUserDto);
    return {
      fullname: user.fullname,
      role: user.role,
    };
  }

  async login(user: any, response: Response): Promise<any> {
    const { _id, email, fullname, age, address, gender, role } = user;
    const payload = {
      sub: 'refresh token',
      iss: 'from server',
      _id,
      email,
      fullname,
      age,
      address,
      gender,
      role,
    };
    const refresh_token = this.createRefreshToken(payload);
    const access_token = this.jwtService.sign(payload);

    await this.usersService.updateUserToken(user._id, refresh_token);

    response.clearCookie('refresh_token');
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    });

    return {
      access_token,
      user: {
        fullname: user.fullname,
        role: user.role,
      },
    };
  }

  createRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
  }

  async processNewToken(refreshToken: string, res: Response): Promise<any> {
    const user = await this.usersService.findUserByToken(refreshToken);

    if (user) {
      return await this.login(user, res);
    } else {
      throw new BadRequestException(CUSTOM_MESSAGES.INVALID_TOKEN);
    }
  }
}
