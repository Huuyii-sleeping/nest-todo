import { HttpException, HttpStatus } from "@nestjs/common";

// 自定义异常类
export class BusinessException extends HttpException {
    constructor(message: string | object, errorCode: string = 'BUSINESS_ERROR') {
        super(
            {
                statusCode: HttpStatus.BAD_GATEWAY,
                errorCode,
                message: message,
                timestamp: new Date().toISOString()
            },
            HttpStatus.BAD_GATEWAY,
        )
    }
}