import { Exclude, Expose, Transform, Type } from 'class-transformer';

// 表示默认排除所有的片段 只暴露标记的
@Exclude()
export class UserResponseDto {
  // 直接定义暴露的接口
  @Expose()
  id: number;

  @Expose({ name: 'user_email' })
  email: string;

  // 定义需要经过转换的接口
  @Expose()
  @Transform((value) => {
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    return value;
  })
  createdAt: Date;

  // 对于某些敏感的模块直接取消Expose （password之类的）

  // 添加计算字段 返回计算之后的属性
//   @Expose()
//   get fullName(): string {
//     return `${this.firstName}${this.lastName}`;
//   }

  // 嵌套对象
  @Expose()
  @Type(() => ProfileDto)
  profile: ProfileDto;
}

@Exclude()
class ProfileDto {
  @Expose()
  bio: string;

  @Expose()
  avatarUrl: string;
}
