# 贡献指南

感谢您对游戏点评平台项目的关注！我们欢迎所有形式的贡献。

## 🚀 如何贡献

### 报告Bug

如果您发现了bug，请：

1. 检查 [Issues](https://github.com/your-username/game-review-platform/issues) 确认问题尚未被报告
2. 创建新的Issue，包含：
   - 清晰的标题
   - 详细的问题描述
   - 重现步骤
   - 预期行为 vs 实际行为
   - 环境信息（操作系统、浏览器、Node.js版本等）
   - 截图（如果适用）

### 功能建议

我们欢迎新功能建议！请：

1. 检查现有Issues确认建议尚未提出
2. 创建Feature Request，包含：
   - 功能描述
   - 使用场景
   - 可能的实现方案

### 代码贡献

#### 开发环境设置

1. Fork项目到您的GitHub账户
2. 克隆您的fork：
   ```bash
   git clone https://github.com/your-username/game-review-platform.git
   cd game-review-platform
   ```
3. 安装依赖：
   ```bash
   cd backend
   npm install
   ```
4. 配置环境变量（参考README.md）
5. 启动开发服务器

#### 提交代码

1. 创建新分支：
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. 进行更改
3. 测试您的更改
4. 提交更改：
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
5. 推送到您的fork：
   ```bash
   git push origin feature/your-feature-name
   ```
6. 创建Pull Request

#### 代码规范

- 使用有意义的变量和函数名
- 添加必要的注释
- 保持代码整洁和可读性
- 遵循现有的代码风格

#### 提交信息规范

使用以下格式：
- `feat: 新功能`
- `fix: 修复bug`
- `docs: 文档更新`
- `style: 代码格式调整`
- `refactor: 代码重构`
- `test: 测试相关`

## 📋 开发指南

### 项目结构

```
game-review-platform/
├── backend/          # 后端代码
├── frontend/         # 前端代码
├── database/         # 数据库脚本
└── docs/            # 文档
```

### 技术栈

- **后端**: Node.js + Express.js + MySQL
- **前端**: HTML5 + CSS3 + 原生JavaScript
- **数据库**: MySQL

### 测试

在提交代码前，请确保：
- 所有现有功能正常工作
- 新功能经过测试
- 没有明显的性能问题

## 🤝 行为准则

- 尊重所有贡献者
- 保持友好和专业的交流
- 接受建设性的反馈
- 专注于对项目最有利的事情

## 📞 联系我们

如果您有任何问题，可以：
- 创建Issue
- 发送邮件给维护者

感谢您的贡献！🎉
