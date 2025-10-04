import { Module } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';

@Module({
    // 异常过滤器 通常不是provider 而是全局绑定
})
export class ErrorModule {}
