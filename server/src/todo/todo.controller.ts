import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Permission } from 'src/decorators/permission.decorators';
import { AuthGuard } from 'src/guards/auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { ReportLogger } from 'src/report-logger/report.logger';

@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly logger: ReportLogger,
  ) {}

  // 添加任务
  @Post('addTask')
  create(@Body() createTodoDto: CreateTodoDto) {
    this.logger.log('添加新的任务');
    return this.todoService.create(createTodoDto);
  }

  // 获取所有任务
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(20)
  @Get('getAllTask')
  findAll() {
    this.logger.log('获取全部任务');
    return this.todoService.findAll();
  }

  // 获取单独的任务
  @Get('getOneTask')
  findOne(@Param('id') id: string) {
    this.logger.log('获取单个任务');
    return this.todoService.findOne(+id);
  }

  // 更新任务
  @Post('updateTask')
  update(@Body() updateTodoDto: UpdateTodoDto) {
    this.logger.log('更新单个任务');
    return this.todoService.update(updateTodoDto);
  }

  // 删除任务
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(20)
  @Post('removeTask')
  remove(@Body() id: number) {
    this.logger.log('删除任务');
    return this.todoService.remove(id);
  }
}
