import { SetMetadata } from '@nestjs/common';

// 创建特定的装饰器 SetMetadata是专门的装饰器 用来字方法/类上面存储元数据
// 后面就可以使用 @Permission 进行操作 声明式权限控制
export const Permission = (roleId: number = 10) =>
  SetMetadata('permission:roleId', roleId);
