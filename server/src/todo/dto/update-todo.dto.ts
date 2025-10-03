import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { IsString } from 'class-validator';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
    @IsString()
    id: number;
    @IsString()
    title?: string | undefined;
    @IsString()
    content?: string | undefined;
}
