import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto)
    return this.userService.register(
      createUserDto.username,
      createUserDto.password,
    );
  }

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    try {
      return this.userService.login(
        createUserDto.username,
        createUserDto.password,
      );
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Login Failed');
    }
  }
}
