# 选择较小的 Alpine 版本以减小镜像体积
FROM node:20.9.0-alpine AS builder

# 设置工作目录
WORKDIR /home/backend/service-magical
RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g pnpm && \
    pnpm config set registry https://registry.npmmirror.com

COPY package*.json .
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# 清理不必要的依赖，仅保留生产依赖
# RUN pnpm prune --prod

# 暴露应用端口
EXPOSE 3000

# 设置环境变量，指定运行环境为生产环境
ENV NODE_ENV=production

# 启动应用
CMD ["node", "dist/main"]

