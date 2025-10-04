import { Injectable, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'http';


@Injectable() // 必须开启才能注入调度器
@WebSocketGateway({ // 标记网关接口
  namespace: 'chat', // 所有的连接必须携带/chat前缀 隔离网关
  cors: {
    origin: '*', // 允许任何域名连接
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server; // 注入底层的socketIO服务器实例
  // 底层的服务器对象进行注入 赋值给this.server
  private logger: Logger = new Logger('ChatGateway');
  users = 0; // 统计在线人数

  boardcastMessage(message: string){
    const payload = {
      time: new Date().toLocaleString('zh-CN'),
      data: `[系统]${message}`
    }
    this.server.emit('msgToClient', payload)
  }

  @SubscribeMessage('msgToServer') // 监听传递的消息 前端调用 socket.emit('msgToServer', 'hello')调用这个方法
  handleMessage(client: Socket, payload: string): void {
    // 根据当前时间格式化
    const currentTime = new Date()
      .toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replace(/\//g, '-')
      .replace(/,/, ' '); // 替换分隔符号，符合所需要的格式

    const messageWithTime = {
      time: currentTime,
      data: payload,
    };
    this.server.emit('msgToClient', messageWithTime); // 发送到这个网关的客户端
  }
  afterInit(server: Server) {
    this.logger.log('init');
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnect: ${client.id}`);
    this.users--;
    this.server.emit('users', this.users);
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connect: ${client.id}`);
    this.users++;
    this.server.emit('users', this.users);
  }
}
