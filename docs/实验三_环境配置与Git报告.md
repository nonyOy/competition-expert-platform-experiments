# 实验三：AI 编码与全栈环境配置、Git 版本控制

## 1. 实验目标
完成竞赛专家管理平台的全栈开发环境配置，使用 AI 编码工具辅助生成文档和代码，并通过 Git 完成版本控制留痕。

## 2. 开发环境
| 工具 | 版本建议 | 用途 |
| --- | --- | --- |
| Node.js | 18 或以上 | 运行前端和后端项目 |
| npm | 9 或以上 | 安装依赖和执行脚本 |
| MySQL | 8.0 或以上 | 保存业务数据 |
| Git | 2.40 或以上 | 版本控制 |
| VS Code | 最新稳定版 | 代码编辑 |
| AI 编码工具 | Codex / ChatGPT / Copilot | 辅助生成代码、文档和检查问题 |

## 3. 环境配置过程
### 3.1 Node.js 验证
```bash
node -v
npm -v
```
截图占位：此处补充 Node 与 npm 版本截图。

### 3.2 MySQL 验证
```bash
mysql --version
mysql -u root -p
```
截图占位：此处补充 MySQL 登录或版本截图。

### 3.3 Git 验证
```bash
git --version
git config --global user.name "你的姓名"
git config --global user.email "你的邮箱"
```
截图占位：此处补充 Git 版本与配置截图。

## 4. 项目运行验证
### 4.1 后端启动
```bash
cd app/backend
npm install
npm run dev
```
访问：`http://localhost:3100/api/health`

预期结果：
```json
{ "status": "ok" }
```

### 4.2 前端启动
```bash
cd app/frontend
npm install
npm run dev
```
访问：`http://localhost:5173`

预期结果：浏览器显示竞赛专家管理平台登录页。

## 5. AI 编码工具使用记录
本实验使用 AI 编码工具辅助完成：
- 需求分析与 PRD 文档结构整理。
- 技术选型与概要设计说明。
- 数据库表结构设计和 SQL 脚本生成。
- Vue 前端页面、Express 后端接口和运行说明编写。
- 检查项目目录结构、接口命名和实验交付完整性。

## 6. Git 版本控制过程
### 6.1 初始化仓库
```bash
git init
git add .
git commit -m "init: create competition expert platform project"
```

### 6.2 文档提交
```bash
git add docs
git commit -m "docs: complete experiment reports and database design"
```

### 6.3 功能提交
```bash
git add app
git commit -m "feat: implement full stack competition expert platform"
```

### 6.4 查看提交记录
```bash
git log --oneline
```

截图占位：此处补充 Git 提交记录截图。

## 7. 托管平台流程
可选择 Gitee 或 GitHub：
1. 在托管平台创建空仓库。
2. 复制远程仓库地址。
3. 执行：
```bash
git remote add origin 仓库地址
git branch -M main
git push -u origin main
```
截图占位：此处补充远程仓库页面截图。

## 8. 实验总结
本实验完成了全栈环境配置、AI 编码辅助实践、前后端项目运行验证和 Git 版本控制流程。通过本实验，掌握了从需求、设计到代码实现和版本留痕的完整项目交付过程。

