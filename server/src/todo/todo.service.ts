import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
  // 注入todo实体的Repository
  constructor(@InjectRepository(Todo) private todoRepository: Repository<Todo>) { }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create(createTodoDto)
    return await this.todoRepository.save(todo)
  }

  async findAll() {
    return await this.todoRepository.find()
  }

  async findOne(id: number) {
    const todo = await this.todoRepository.findOneBy({ id })
    if (!todo) {
      throw new NotFoundException(`task with ID ${id} not found`)
    }
    return todo
  }

  async update(updateTodoDto: UpdateTodoDto) {
    const { id, title, content } = updateTodoDto
    const existingTodo = await this.findOne(id)
    Object.assign(existingTodo, updateTodoDto)
    return await this.todoRepository.save(existingTodo)
  }

  async remove(id: number) {
    await this.todoRepository.delete(id)
  }
}
 