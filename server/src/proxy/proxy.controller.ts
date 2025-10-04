import { HttpService } from '@nestjs/axios';
import { Controller, Get, Query, Headers, Post, Body } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Controller('api')
export class ProxyController {
  constructor(private readonly httpService: HttpService) {}

  // 转发get请求
  @Get('users')
  async getUsers(@Query() query, @Headers() headers) {
    const response = await firstValueFrom(
      // 新转发的路径
      this.httpService.get('http://localhost:3000/users', {
        params: query,
        headers: { ...headers, host: undefined }, // 避免 Host 冲突
      }),
    );
    return response.data; // 返回目标服务的响应
  }

  //   转发post请求
  @Post('users')
  async createUser(@Body() body, @Headers() headers) {
    const response = await firstValueFrom(
      this.httpService.post('http://localhost:3000/users', body, {
        headers,
      }),
    );
    return response.data;
  }
}
