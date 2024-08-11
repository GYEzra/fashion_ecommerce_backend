import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class RegisterUserDto extends PickType(CreateUserDto, [
  'fullname',
  'email',
  'password',
] as const) {}
