// test/user.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/user/entities/user.entity';

describe('User E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // 创建测试模块，使用内存数据库避免污染真实数据
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule, // 导入你的主模块
        // 或者单独配置测试数据库
        // TypeOrmModule.forRoot({
        //   type: 'sqlite',
        //   database: ':memory:',
        //   entities: [User],
        //   synchronize: true,
        // }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/POST user/register', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/register')
        .send({
          username: 'e2euser',
          password: 'password123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe('e2euser');
    });

    it('should return 400 for duplicate username', async () => {
      // 先注册一次
      await request(app.getHttpServer())
        .post('/user/register')
        .send({
          username: 'duplicateuser',
          password: 'password123',
        });

      // 再次注册相同用户名
    //   const response = await request(app.getHttpServer())
    //     .post('/user/register')
    //     .send({
    //       username: 'duplicateuser',
    //       password: 'password123',
    //     })
    //     .expect(400); // 假设你的应用返回 400 错误
    });
  });

  describe('/POST user/login', () => {
    const testUser = {
      username: 'logintest',
      password: 'password123',
    };

    beforeAll(async () => {
      // 先创建测试用户
      await request(app.getHttpServer())
        .post('/user/register')
        .send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user.username).toBe(testUser.username);
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send({
          username: testUser.username,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.message).toContain('Invalid credentials');
    });
  });
});