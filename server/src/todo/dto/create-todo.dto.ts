import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ example: 'title', description: '标题' })
  @IsString()
  title: string;

  @ApiProperty({ example: '吃饭', description: '内容' })
  @IsString()
  content: string;
}
