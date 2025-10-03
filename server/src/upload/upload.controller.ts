import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

/**
 *  实现NestJS当中的文件上传功能，专门用来处理图片上传功能
 *  基于express的multer中间件
 */
@Controller('upload')
export class UploadController {
  @Post('image')
  // 文件上传拦截器，处理文件解析和验证
  @UseInterceptors(
    FileInterceptor('file', {
      // dickStorage存储配置
      storage: diskStorage({
        destination: './uploads', // 保存到 uploads 文件夹
        filename: (req, file, callback) => {
          // 生成唯一文件名：时间戳 + 随机数 + 扩展名
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname).toLowerCase();
          callback(null, `image-${uniqueSuffix}${ext}`);
        },
      }),
      //   文件过滤
      fileFilter: (req, file, callback) => {
        // 只允许图片格式
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(
            new HttpException(
              '只支持 JPG、JPEG、PNG、GIF 格式',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 限制 5MB
      },
    }),
  )
  //   UploadFile获取文件上传
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('文件上传失败', HttpStatus.BAD_REQUEST);
    }

    // 返回可访问的 URL（假设静态资源通过 /uploads 提供）
    return {
      url: `/uploads/${file.filename}`,
      originalName: file.originalname,
      size: file.size,
    };
  }
}
