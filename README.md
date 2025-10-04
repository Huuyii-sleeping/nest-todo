## nest-todo

### 简单介绍

刚学习完nest，为了理解一些nest的东西是怎么进行配置的，因此写了一个这样的一个简单的demo

基本就是简陋的前端页面配合功能较多的nest实现的后端

仓库地址 https://github.com/Huuyii-sleeping/nest-todo.git

实现流程：

- user和todo 两个资源的CURD接口（大部分的教程也就是只有这个）
- 数据库模块，TypeOrm + MySQL实现的，数据库迁移，数据库seed
- 文件上传模块，我这里是直接上传到了本地，（可以学一下使用Node SDK上传到OSS当中）
- 日志模块，ReportLogger 模拟日志上报
- 静态资源模块，使用StatiecModule实现
- 用户的身份认证，local和JWT两种认证策略
- 用户角色验证，区分普通的用户和管理员两种角色
- Docker部署环境
- Swagger 构建API文档
- WebSocket 实现数据传输
- Http模块，http的转发功能
- Error模块，出错时，拦截错误，并将当错误按照一定的格式返回
- Transform模块，使用一定格式进行返回数据
- Task Scheduling 定时推送消息
- 编写单元测试
- 编写e2e测试

### 技术栈：

#### 前端：

- vue + typescript

#### 后端：

- NestJS
- Typescript
- TypeORM
- MySQL
- Swagger