// src/user/user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

// Mock 用户数据
const mockUser = {
  id: 1,
  username: 'testuser',
  password: 'hashedPassword123',
};

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let userRepository: any;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          // 模拟 UserRepository
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        {
          // 模拟 JwtService
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user with hashed password', async () => {
      const username = 'newuser';
      const password = 'plainPassword';
      const hashedPassword = 'hashedPassword';

      // 模拟 bcrypt.hash
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      userRepository.create.mockReturnValue({ username, password: hashedPassword });
      userRepository.save.mockResolvedValue({ id: 2, username, password: hashedPassword });

      const result = await service.register(username, password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        username,
        password: hashedPassword,
      });
      expect(userRepository.save).toHaveBeenCalledWith({
        username,
        password: hashedPassword,
      });
      expect(result).toEqual({ id: 2, username, password: hashedPassword });
    });
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser('testuser', 'correctPassword');

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ username: 'testuser' });
      expect(bcrypt.compare).toHaveBeenCalledWith('correctPassword', mockUser.password);
      expect(result).toEqual({ id: 1, username: 'testuser' }); // 无 password 字段
    });

    it('should return null if user is not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent', 'password');

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.validateUser('testuser', 'wrongPassword');

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', mockUser.password);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user on successful login', async () => {
      const mockValidatedUser = { id: 1, username: 'testuser' };
      const mockToken = 'jwt.token.here';

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockValidatedUser);
      (jwtService.sign as any).mockReturnValue(mockToken);

      const result = await service.login('testuser', 'password');

      expect(service.validateUser).toHaveBeenCalledWith('testuser', 'password');
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'testuser',
        sub: 1,
      });
      expect(result).toEqual({
        access_token: mockToken,
        user: { id: 1, username: 'testuser' },
      });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login('invalid', 'user')).rejects.toThrow(UnauthorizedException);
      await expect(service.login('invalid', 'user')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });
});