# Magical

🌟 一个基于 NestJS 的微服务项目，让开发变得更加神奇！

## 特性

- 📦 使用 pnpm 作为包管理工具
- 🚀 基于 NestJS 微服务架构
- 🔄 Prisma ORM 数据库管理
- 📚 模块化设计
- 🛠 完整的开发工具链

## 快速开始

### 环境准备

确保你的开发环境中已安装：

- [Node.js](https://nodejs.org/) (>= 16.x)
- [pnpm](https://pnpm.io/) (>= 8.x)

### 安装

```bash
# 克隆项目
git clone https://github.com/iamsyygo/magical.git

# 进入目录
cd magical

# 安装依赖
pnpm install
```

### 开发

```bash
# 启动开发服务器
pnpm run start:dev
```

## 项目开发指南

### 创建新模块

```bash
# 创建应用模块
nest g app <module-name>

# 创建共享库
nest g lib <library-name>
```

### 数据库操作

```bash
# 重置数据库
npx prisma migrate reset

# 创建新的数据库迁移
npx prisma migrate dev --name <migration-name>
```

## 项目结构

```
.
├── apps/                # 应用程序目录
│   ├── root/           # 主应用
│   └── user/           # 用户服务
├── libs/               # 共享库
├── prisma/             # 数据库模型
├── shared/             # 共享代码
├── nest-cli.json       # NestJS 配置
└── package.json        # 项目配置
```

## 开发规范

- 遵循 TypeScript 开发规范
- 使用 ESLint 进行代码检查
- 遵循 Angular Commit 规范
- 模块化开发，保持代码整洁

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m '🍻 添加某个特性'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 了解详情

## 关于 Magical

Magical（神奇的、魔法的）这个名字的灵感来源于我们对编程的理解：

- 🪄 像魔法一样，通过代码创造无限可能
- ✨ 追求开发体验的优雅和流畅，就像施展魔法般丝滑
- 🎯 致力于将复杂的问题简单化，让开发过程充满魔力
- 🌈 希望这个框架能为开发者带来惊喜和愉悦的体验

正如魔法能让不可能变为可能，我们希望 Magical 能让微服务开发变得更加简单和有趣。

## 联系我们

- 项目作者：[Magical]
- GitHub：[项目地址](https://github.com/iamsyygo/service-magical)
