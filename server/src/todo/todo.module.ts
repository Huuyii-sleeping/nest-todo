import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { UserModule } from '../user/user.module';
import { ReportLoggerModule } from '../report-logger/report-logger.module';

@Module({
  imports: [
    ReportLoggerModule.forFeature('todo'),
    TypeOrmModule.forFeature([Todo]), 
    UserModule
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
