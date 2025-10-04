import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

//创建一个Logger专门记录错误的日志实例
const errorLogger = new Logger('GlobalExceptionFilter');

// 创建一个Logger错误捕获器
@Catch() // 异常过滤器
export class GlobalExceptionFilter implements ExceptionFilter {
  // 抛出异常对象，数据库错误，自定义错误等
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 默认错误结构
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse = {
      statusCode: status,
      errorCode: 'INTERNAL_ERROR',
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // 如果是HttpException的错误形式（包括自定义的错误）
    if (exception instanceof HttpException) {
      const httpException = exception;
      //   获取错误携带的响应内容
      const responseBody = httpException.getResponse() as any;

      //   当错误的内容是对象，就保持原有的错误结构
      if (typeof responseBody === 'object' && responseBody !== null) {
        errorResponse = {
          ...responseBody,
          timestamp: responseBody.timestamp || new Date().toISOString(),
          path: request.url,
        };
        status = httpException.getStatus();
      } else {
        // 当异常响应是字符串
        errorResponse = {
          statusCode: httpException.getStatus(),
          errorCode: 'HTTP_EXCEPTION',
          message: responseBody,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
        status = httpException.getStatus();
      }
    } else {
      // 不是HttpExcetion 就像数据库错误，未捕获异常之类的
      errorLogger.error(
        `Unexception error: ${exception}`,
        (exception as any).stack,
        'GlobalExceptionFilter',
      );
    }
    if (status >= 500) {
      errorLogger.error(`5xx Error: ${JSON.stringify(errorResponse)}`);
    } else {
      errorLogger.warn(`4xx Error: ${JSON.stringify(errorResponse)}`);
    }
    (response as any).status(status).json(errorResponse)
  }
}
