// ormconfig.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // 加载 .env 文件

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT as string, 10) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity{.ts,.js}'],     // 实体类路径
  migrations: ['db/migrations/*{.ts,.js}'],   // 迁移文件路径
  synchronize: false,                         // 必须关闭！生产环境不能开
});