import { Controller, Post, Body, UseGuards, Res, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/models/users/dto/register-user.dto';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './auth.decorator';
import { Request, Response } from 'express';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from 'src/models/users/dto/login-user.dto';

@ApiTags('authencation')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @ResponseMessage('Thực hiện đăng ký tài khoản')
  async signUp(@Body() registerUserDto: RegisterUserDto) {
    console.warn(registerUserDto);
    return await this.authService.signUp(registerUserDto);
  }

  @ApiBody({ type: LoginUserDto })
  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Thực hiện đăng nhập')
  async login(@Res({ passthrough: true }) res: Response, @User() user: IUser) {
    return await this.authService.login(user, res);
  }

  @Get('account')
  @ResponseMessage('Lấy thông tin account bằng Token')
  getAccountByToken(@User() user: IUser) {
    return user;
  }

  @Get('refresh')
  @ResponseMessage('Đổi access token mới')
  async refreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies['refresh_token'];
    return await this.authService.processNewToken(refreshToken, response);
  }
}
