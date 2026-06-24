# 竞赛专家管理平台运行说明

## 一、项目说明
本项目是“竞赛专家管理平台 / 竞赛专家 App”的课程实验交付物，包含实验一到实验三文档、MySQL 数据库脚本、前端项目和后端项目。

## 二、目录结构
```text
竞赛专家管理平台_实验1-3交付物
├─ docs
│  ├─ 实验一_PRD.md
│  ├─ 实验二_技术选型与概要设计.md
│  ├─ 实验三_环境配置与Git报告.md
│  └─ sql
│     └─ schema.sql
└─ app
   ├─ frontend
   └─ backend
```

## 三、环境要求
- Node.js 18 或以上
- MySQL 8.0 或以上
- Git
- VS Code 或 WebStorm

## 四、数据库初始化
1. 创建数据库并导入脚本：
```sql
CREATE DATABASE competition_expert DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE competition_expert;
SOURCE docs/sql/schema.sql;
```

2. 修改后端环境变量：
```bash
cd app/backend
cp .env.example .env
```

根据本机 MySQL 配置修改 `.env` 中的账号、密码和数据库名。

## 五、启动后端
```bash
cd app/backend
npm install
npm run dev
```

默认地址：`http://localhost:3100`

健康检查：`http://localhost:3100/api/health`

## 六、启动前端
```bash
cd app/frontend
npm install
npm run dev
```

默认地址：`http://localhost:5173`

## 七、测试账号
| 角色 | 账号 | 密码 | 说明 |
| --- | --- | --- | --- |
| 管理员 | admin | 123456 | 管理赛事、专家、作品、任务和统计 |
| 专家 | expert01 | 123456 | 查看评审任务并提交评分 |

## 八、演示流程
1. 使用 `admin / 123456` 登录。
2. 查看首页统计看板。
3. 进入赛事管理、专家管理、作品管理和任务分配页面。
4. 退出后使用 `expert01 / 123456` 登录。
5. 进入专家评审工作台，选择作品填写评分和意见。
6. 回到管理员端查看统计结果。

