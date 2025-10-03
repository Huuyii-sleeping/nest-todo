// db/seeds/user.seeder.ts
import { DataSource } from 'typeorm';
import { User } from '../../src/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export class UserSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    // 检查是否已存在 admin 用户
    const existingAdmin = await userRepository.findOne({ where: { username: 'admin' } });
    if (!existingAdmin) {
      const admin = userRepository.create({
        username: 'admin',
        password: await bcrypt.hash('admin123', 10), // 密码加密
      });

      await userRepository.save(admin);
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  }
}