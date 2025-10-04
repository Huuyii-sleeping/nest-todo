import { DynamicModule, Module, Provider, Scope } from '@nestjs/common';
import { ReportLogger } from './report.logger';

export const REPOR_LOGGER = 'REPORT_LOGGER';

export const createReportLogger = (context: string): ReportLogger => {
  return new ReportLogger(context);
};

export const reportLoggerProvider: Provider = {
  provide: REPOR_LOGGER,
  useFactory: (context: string) => createReportLogger(context),
  scope: Scope.TRANSIENT,
};

@Module({
  providers: [],
  exports: [],
})
export class ReportLoggerModule {
  static forFeature(context: string): DynamicModule {
    return {
      module: ReportLoggerModule,
      providers: [
        {
          provide: REPOR_LOGGER,
          useFactory: () => createReportLogger(context),
          scope: Scope.TRANSIENT,
        },
        {
          provide: ReportLogger,
          useFactory: (loggerToken) => loggerToken,
          inject: [REPOR_LOGGER],
        },
      ],
      exports: [ReportLogger],
    };
  }
}
