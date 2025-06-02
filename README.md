# 🎮 游戏点评平台

一个基于Node.js + Express.js + MySQL + 原生JavaScript的游戏点评与社交平台。

## 📋 项目概述

旨在构建一个专注于游戏点评、用户生成内容(UGC)和玩家社交互动的综合性平台。

## 🛠️ 技术栈

### 后端
- **Node.js** - 运行时环境
- **Express.js** - Web框架
- **MySQL** - 数据库
- **Express-Session** - 会话管理
- **CORS** - 跨域支持

### 前端
- **HTML5** - 页面结构
- **CSS3** - 样式设计
- **原生JavaScript** - 交互逻辑
- **无框架** - 纯原生实现

## 🚀 快速开始

### 环境要求
- Node.js 14.0+
- MySQL 5.7+
- 现代浏览器

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/game-review-platform.git
   cd game-review-platform
   ```

2. **安装后端依赖**
   ```bash
   cd backend
   npm install
   ```

3. **配置数据库**
   - 启动MySQL服务
   - 创建数据库并执行初始化脚本：
   ```sql
   source database/init.sql
   ```

4. **配置环境变量**
   - 复制环境变量模板文件：
   ```bash
   cd backend
   cp .env.example .env
   ```
   - 修改 `.env` 文件中的数据库连接信息：
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=game_review_platform
   SESSION_SECRET=your_session_secret_key
   ```

5. **启动项目**
   ```bash
   # Windows
   start.bat
   
   # 或手动启动
   cd backend
   npm start
   ```

6. **访问应用**
   - 打开浏览器访问: http://localhost:3000

## 📁 项目结构

```
game-review-platform/
├── backend/                 # 后端代码
│   ├── server.js           # 主服务器文件
│   ├── package.json        # 依赖配置
│   └── .env               # 环境变量
├── frontend/               # 前端代码
│   ├── index.html         # 主页面
│   ├── styles/            # CSS样式
│   │   ├── main.css       # 主样式
│   │   └── components.css # 组件样式
│   └── js/                # JavaScript文件
│       ├── api.js         # API工具类
│       ├── auth.js        # 认证管理
│       ├── games.js       # 游戏管理
│       ├── comments.js    # 评论管理
│       └── main.js        # 主应用入口
├── database/               # 数据库相关
│   └── init.sql           # 数据库初始化脚本
├── start.bat              # Windows启动脚本
└── README.md              # 项目说明
```

## 🎯 核心功能

### ✅ 已完成功能 (第一周)

1. **用户认证系统**
   - 用户注册/登录
   - 会话管理
   - 密码加密存储

2. **游戏信息展示**
   - 游戏列表页面
   - 游戏详情页面
   - 游戏搜索功能
   - 排序功能

3. **评论系统**
   - 星级评分 (1-5星)
   - 文字评论
   - 评论展示
   - 平均评分计算

4. **响应式界面**
   - 移动端适配
   - 现代化UI设计
   - 用户友好的交互

### 🔄 API接口

#### 用户认证
- `POST /api/register` - 用户注册
- `POST /api/login` - 用户登录
- `POST /api/logout` - 用户登出
- `GET /api/user` - 获取当前用户信息

#### 游戏管理
- `GET /api/games` - 获取游戏列表
- `GET /api/games/:id` - 获取游戏详情
- `GET /api/games/search` - 搜索游戏

#### 评论管理
- `GET /api/games/:id/comments` - 获取游戏评论
- `POST /api/comments` - 发布评论

## 🗄️ 数据库设计

### 核心表结构

1. **users** - 用户表
   - id, username, email, password_hash, created_at

2. **games** - 游戏表
   - id, name, platform, description, cover_url, avg_rating, review_count

3. **comments** - 评论表
   - id, user_id, game_id, rating, content, created_at

## 🧪 测试数据

系统预置了10款热门游戏的测试数据：
- 塞尔达传说：王国之泪
- 艾尔登法环
- 赛博朋克2077
- 原神
- 我的世界
- 英雄联盟
- 守望先锋2
- 动物森友会
- 只狼：影逝二度
- 荒野大镖客：救赎2

## 📅 开发计划

### 第一周 ✅ (已完成)
- [x] 技术栈搭建与数据库初始化
- [x] 游戏数据处理与展示
- [x] 评论与评分功能

### 第二周 (计划中)
- [ ] 用户认证优化
- [ ] 搜索功能增强
- [ ] 管理后台
- [ ] 测试与部署

## 🐛 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查MySQL服务是否启动
   - 验证.env文件中的数据库配置
   - 确认数据库已创建并执行了init.sql

2. **端口占用**
   - 默认端口3000，可在.env中修改PORT变量

3. **依赖安装失败**
   - 确保Node.js版本14.0+
   - 尝试清除npm缓存: `npm cache clean --force`

## 📝 开发日志

- **2025-06-01**: 完成第一周所有核心功能开发
  - 后端API服务搭建完成
  - 前端页面和交互逻辑实现
  - 数据库设计和初始化
  - 用户认证、游戏展示、评论系统全部就绪

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目！

### 贡献指南

1. **Fork 项目**
2. **创建功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **创建 Pull Request**

### 问题反馈

如果您发现了bug或有功能建议，请：
- 查看现有的 [Issues](https://github.com/your-username/game-review-platform/issues)
- 如果没有相关问题，请创建新的Issue
- 详细描述问题或建议

## ⭐ 支持项目

如果这个项目对您有帮助，请给我们一个Star！⭐

## 📞 联系我们

- **项目主页**: https://github.com/your-username/game-review-platform
- **问题反馈**: https://github.com/your-username/game-review-platform/issues

---

