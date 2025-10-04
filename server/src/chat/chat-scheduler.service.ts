import { Injectable } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ChatSchedulerService {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  sendPeriodicAnnouncement() {
    this.chatGateway.boardcastMessage('记得完成代办事项哦!');
  }

  @Cron('0 * * * *')
  sendHourlyTime() {
    const hour = new Date().getHours();
    this.chatGateway.boardcastMessage(`现在是${hour}点整`);
  }
}
