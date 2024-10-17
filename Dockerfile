# 选择较小的 Alpine 版本以减小镜像体积
FROM node:20.9.0-alpine

RUN mkdir -p /home/backend/service-magical && cd /home/backend/service-magical

# 设置工作目录
WORKDIR /home/backend/service-magical

# 设置镜像源以加速依赖安装
RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g pnpm && pnpm config set registry https://registry.npmmirror.com
RUN npm install rimraf @nestjs/cli -g

# 缓存优化：
# Docker 构建过程中，每一步都会创建一个缓存层。
# 如果 package.json 没有变化，Docker 可以使用缓存层来加速构建过程，而不需要每次都重新安装依赖。这可以显著减少构建时间。
COPY package*.json .
RUN rm -rf pnpm-lock.yaml node_modules
RUN pnpm install

# 复制项目文件到工作目录
COPY . .

RUN rm -rf dist
RUN pnpm build

# 暴露应用运行的端口
EXPOSE 3000

# 设置环境变量，指定运行环境为生产环境
ENV NODE_ENV=production

# 启动 NestJS 应用
CMD ["node", "dist/main"]