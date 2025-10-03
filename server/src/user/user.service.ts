import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  /**
   * 用户注册
   * @param username
   * @param password
   * @returns
   */
  async register(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  /**
   * 验证用户凭据
   * @param username
   * @param password
   * @returns
   */
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, username: user.username },
    };
  }
}
