import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Permission } from '../decorators/permission.decorators';
import { AuthGuard } from '../guards/auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { ReportLogger } from '../report-logger/report.logger';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('todo')
@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly logger: ReportLogger,
  ) {}

  // 添加任务
  @Post('addTask')
  @ApiOperation({ summary: '添加任务' })
  @ApiResponse({ status: 201, description: '任务添加成功' })
  create(@Body() createTodoDto: CreateTodoDto) {
    this.logger.log('添加新的任务');
    return this.todoService.create(createTodoDto);
  }

  // 获取所有任务
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(20)
  @Get('getAllTask')
  @ApiOperation({ summary: '获取所有任务' })
  @ApiResponse({ status: 200, description: '成功返回任务列表' })
  findAll() {
    this.logger.log('获取全部任务');
    return this.todoService.findAll();
  }

  // 获取单独的任务
  @Get('getOneTask')
  @ApiOperation({ summary: '获取单个任务' })
  @ApiResponse({ status: 200, description: '成功返回单个任务' })
  findOne(@Param('id') id: string) {
    this.logger.log('获取单个任务');
    return this.todoService.findOne(+id);
  }

  // 更新任务
  @Post('updateTask')
  @ApiOperation({ summary: '更新任务' })
  @ApiResponse({ status: 200, description: '成功更新用户列表' })
  update(@Body() updateTodoDto: UpdateTodoDto) {
    this.logger.log('更新单个任务');
    return this.todoService.update(updateTodoDto);
  }

  // 删除任务
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission(20)
  @ApiOperation({ summary: '删除任务' })
  @ApiResponse({ status: 200, description: '成功删除任务' })
  @Post('removeTask')
  remove(@Body() id: number) {
    this.logger.log('删除任务');
    return this.todoService.remove(id);
  }
}
