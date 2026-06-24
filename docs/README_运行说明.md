# 竞赛专家管理平台运行说明

## 一、项目说明
本项目是“竞赛专家管理平台 / 竞赛专家 App”的课程实验交付物，包含实验一到实验三文档、MySQL 数据库脚本、前端项目和后端项目。

新增功能：专家可在公开报名页填写《西红市职业院校技能大赛专家库人选推荐表》，管理员审核通过后，申请人自动进入专家库，并生成专家登录账号。

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
```sql
CREATE DATABASE competition_expert DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE competition_expert;
SOURCE docs/sql/schema.sql;
```

后端环境变量：
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
| 管理员 | admin | 123456 | 管理赛事、专家、报名审核、作品、任务和统计 |
| 专家 | expert01 | 123456 | 查看评审任务并提交评分 |
| 新审核专家 | 报名手机号 | 123456 | 管理员审核通过后自动生成 |

## 八、演示流程
1. 在登录页点击“专家报名申请”。
2. 填写推荐表信息并提交，系统提示等待审核。
3. 使用 `admin / 123456` 登录。
4. 进入“报名审核”，查看申请详情。
5. 点击“通过并加入专家库”，确认该专家进入“专家管理”列表。
6. 退出后使用报名手机号和 `123456` 登录专家端。
7. 进入专家评审工作台，查看任务与评分页面。

## 九、审核逻辑说明
- 报名提交后状态为 `pending`，不会直接进入专家库。
- 审核通过后状态变为 `approved`，系统写入 `experts` 表并生成 `users` 登录账号。
- 审核驳回后状态变为 `rejected`，保留申请记录但不进入专家库。
- 首页看板会显示当前待审核报名数量。

