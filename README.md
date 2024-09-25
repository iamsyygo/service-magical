# Magical

欢迎来到 **神奇的 Magical** 项目！这是一个基于 NestJS 的微服务项目。我们使用 pnpm 作为包管理工具，让我们一起开启这段神奇的旅程吧！

## 目录

- [Magical](#magical)
  - [目录](#目录)
  - [安装](#安装)
  - [运行](#运行)
  - [添加模块](#添加模块)
  - [添加共享库](#添加共享库)
  - [重置下数据库](#重置下数据库)
  - [创建新模型](#创建新模型)
  - [项目结构](#项目结构)
  - [贡献](#贡献)
  - [许可证](#许可证)

## 安装

首先，确保你已经安装了 [Node.js](https://nodejs.org/) 和 [pnpm](https://pnpm.io/)。

```bash
# 克隆仓库
git clone https://github.com/iamsyygo/magical.git

# 进入项目目录
cd magical

# 安装依赖
pnpm install
```

## 运行

要启动项目，请运行以下命令：

```bash
# 启动开发服务器
pnpm run start:dev
```

服务器将会根据每个微服务的端口号启动。

## 添加模块

想要添加一个新的模块？没问题！只需运行以下命令：

```bash
# 使用 Nest CLI 添加新模块
nest g app <name>
```

例如，添加一个名为 `cats` 的模块：

```bash
nest g app cats
```

## 添加共享库

```bash
nest g lib <name>
```

## 重置下数据库

```bash
npx prisma migrate reset
```

## 创建新模型

```bash
npx prisma migrate dev --name <name>
```

## 项目结构

项目的基本结构如下：

```bash
.
├── apps
│   ├── root # 根应用
│   │   ├── src
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.controller.ts
│   │   │   └── app.service.ts
│   │   └── tsconfig.json
│   │
│   ├── user # 用户微服务
│   │   ├── user.module.ts
│   │   ├── user.controller.ts
│   │   └── user.service.ts
│   │
│   ├── libs   # 共享库
│   ├── shared # 共享代码
│   ├── prisma # 数据库模型
│   └── .env
│
├── ...
├── nest-cli.json
├── package.json
├── README.md
└── tsconfig.json
```

## 贡献

欢迎任何形式的贡献！请先阅读 [贡献指南](CONTRIBUTING.md) 以了解如何参与。

## 许可证

本项目使用 [MIT 许可证](LICENSE)。
