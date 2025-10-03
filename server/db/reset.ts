// db/reset.ts
import { execSync } from 'child_process';
import { DataSource } from 'typeorm';
import config from '../ormconfig';

async function resetDatabase() {
  const dataSource = new DataSource(config as any);
  await dataSource.initialize();

  try {
    // 1. 删除所有表（MySQL 特定）
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = '${process.env.DB_DATABASE}'
    `);

    if (tables.length > 0) {
      const tableNames = tables.map((t: any) => t.table_name).join(', ');
      await dataSource.query(`DROP TABLE ${tableNames} CASCADE`);
      console.log('🗑️ All tables dropped');
    }

    // 2. 重新运行所有 migration
    console.log('🔄 Running migrations...');
    execSync('npx typeorm-ts-node-commonjs migration:run -d ormconfig.ts', { stdio: 'inherit' });

    // 3. 重新运行 seed
    console.log('🌱 Running seeds...');
    execSync('npx ts-node db/seed.ts', { stdio: 'inherit' });

    console.log('🎉 Database reset complete!');
  } finally {
    await dataSource.destroy();
  }
}

resetDatabase().catch(console.error);