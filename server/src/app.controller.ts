import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ReportLogger } from './report-logger/report.logger';

@Controller()
export class AppController {
  constructor(private readonly logger: ReportLogger) {}

  @Get()
  getHello() {
    this.logger.log('Handing GET/');
    this.logger.warn('This is a simulated warning');
    return 'hello with ReportLogger';
  }
}
