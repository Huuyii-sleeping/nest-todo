// src/user/user.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return the created user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
      };
      const mockUser = { id: 1, username: 'testuser' };

      mockUserService.register.mockResolvedValue(mockUser);

      const result = await controller.register(createUserDto);

      expect(userService.register).toHaveBeenCalledWith(
        createUserDto.username,
        createUserDto.password,
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should login successfully and return access token', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
      };
      const mockLoginResult = {
        access_token: 'jwt.token.here',
        user: { id: 1, username: 'testuser' },
      };

      mockUserService.login.mockResolvedValue(mockLoginResult);

      const result = await controller.login(createUserDto);

      expect(userService.login).toHaveBeenCalledWith(
        createUserDto.username,
        createUserDto.password,
      );
      expect(result).toEqual(mockLoginResult);
    });

    it('should throw UnauthorizedException when login fails with UnauthorizedException', async () => {
      const createUserDto: CreateUserDto = {
        username: 'invalid',
        password: 'wrong',
      };

      mockUserService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login(createUserDto)).rejects.toThrow(UnauthorizedException);
      await expect(controller.login(createUserDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException when login fails with other error', async () => {
      const createUserDto: CreateUserDto = {
        username: 'invalid',
        password: 'wrong',
      };

      mockUserService.login.mockRejectedValue(new Error('Database error'));

      await expect(controller.login(createUserDto)).rejects.toThrow('Database error');
    });
  });
});