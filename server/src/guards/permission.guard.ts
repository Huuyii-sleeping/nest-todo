import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  // 进行依赖注入
  constructor(private userService: UserService) {}
  canActivate( // Guard的核心接口 nest会在路由的前面进行调用
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // @Permission 中拿到的
    const roleId = this.getRoleId(context) || 10;
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;
    if (!userId) {
      throw new ForbiddenException('missing user ID');
    }
    return this.validateRole(userId, roleId);
  }

  // 封装单独的函数 进行业务逻辑的操作
  private async validateRole(userId: number, expectedRoleId: number): Promise<boolean> {
    const user = await this.userService.findOne(userId)
    if(!user || user.roleId !== expectedRoleId){
        throw new ForbiddenException('Access denied')
    }
    return true
  }

  private getRoleId(context: ExecutionContext): number|undefined {
    return Reflect.getMetadata('permission:roleId', context.getHandler())
  }
}
