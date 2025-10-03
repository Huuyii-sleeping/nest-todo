import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // 添加任务
  @Post('addTask')
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  // 获取所有任务
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
  @Post('removeTask')
  remove(@Body() id: number) { 
    return this.todoService.remove(id);
  }
}
 