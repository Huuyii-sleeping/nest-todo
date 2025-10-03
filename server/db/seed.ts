// db/seed.ts
import { DataSource } from 'typeorm';
import config from '../ormconfig';
import { UserSeeder } from './seeds/user.seeder';

async function runSeed() {
  const dataSource = new DataSource(config as any);
  await dataSource.initialize();

  try {
    const seeder = new UserSeeder();
    await seeder.run(dataSource);
  } finally {
    await dataSource.destroy(); // 关闭连接
  }
}

runSeed().catch(console.error);