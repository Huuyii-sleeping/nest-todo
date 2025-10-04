import { Logger } from '@nestjs/common';

export class ReportLogger extends Logger {
  private async report(level: string, message: any, ...optionsParams: any[]) {
    // 实际项目当中可以是HTTP请求，Kafka。数据库等
    console.log(
      `[📤 REPORT] [${level}] [${this.context}]`,
      message,
      optionsParams,
    );
  }

  log(message: any, ...optionsParams: any[]) {
    super.log(message, ...optionsParams);
    this.report('LOG', message, ...optionsParams);
  }

  error(message: any, ...optionsParams: any[]) {
    super.error(message, ...optionsParams);
    this.report('ERROR', message, ...optionsParams);
  }

  warn(message: any, ...optionsParams: any[]) {
    super.warn(message, ...optionsParams);
    this.report('WARN', message, ...optionsParams);
  }
}
