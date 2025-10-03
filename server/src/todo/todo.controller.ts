import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Permission } from 'src/decorators/permission.decorators';
import { AuthGuard } from 'src/guards/auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // 添加任务
  @Post('addTask')
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  // 获取所有任务
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(10)
  @Get('getAllTask')
  findAll() {
    return this.todoService.findAll();
  }

  // 获取单独的任务
  @Get('getOneTask')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  // 更新任务
  @Post('updateTask')
  update(@Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(updateTodoDto);
  }

  // 删除任务
  @UseGuards(PermissionGuard)
  @Permission(20)
  @Post('removeTask')
  @Permission(20)
  remove(@Body() id: number) {
    return this.todoService.remove(id);
  }
}
