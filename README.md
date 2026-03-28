# 🎰 抽奖助手 - 微信小程序

基于 **uni-app + 微信云开发** 的抽奖助手小程序，支持创建抽奖活动、参与抽奖、随机开奖、结果分享。

## ✨ 功能

- 🎯 **创建抽奖** — 自定义奖品、数量、截止时间
- 👥 **参与抽奖** — 一键参与，支持人数限制
- 🎰 **随机开奖** — 公平公正的随机抽取算法
- 📊 **结果展示** — 中奖名单、统计信息
- 📤 **分享功能** — 分享给好友/群
- 📋 **我的抽奖** — 我创建的、我参与的

## 🛠️ 技术栈

- **框架**: uni-app (Vue 3 + TypeScript)
- **后端**: 微信云开发 (CloudBase)
- **数据库**: 云开发数据库

## 📦 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置云开发

1. 在 `src/utils/config.ts` 中填入你的云开发环境 ID
2. 在 `src/manifest.json` 中填入你的小程序 AppID

### 3. 开发运行

```bash
# 微信小程序开发
npm run dev:mp-weixin

# H5 开发预览
npm run dev:h5
```

### 4. 上传发布

```bash
# 构建微信小程序
npm run build:mp-weixin
```

使用微信开发者工具打开 `dist/build/mp-weixin` 目录，上传代码即可。

## 📁 项目结构

```
src/
├── pages/              # 页面
│   ├── index/          # 首页（活动列表）
│   ├── create/         # 创建抽奖
│   ├── detail/         # 抽奖详情
│   ├── result/         # 抽奖结果
│   ├── my/             # 我的抽奖
│   └── profile/        # 个人中心
├── utils/              # 工具函数
│   ├── config.ts       # 配置
│   ├── cloud.ts        # 云开发封装
│   ├── common.ts       # 通用工具
│   └── mock.ts         # Mock 数据
├── cloudfunctions/     # 云函数
│   ├── login/          # 登录获取 OpenID
│   └── drawLottery/    # 开奖逻辑
├── static/             # 静态资源
├── pages.json          # 页面配置
├── manifest.json       # 应用配置
└── App.vue             # 根组件
```

## 📝 云开发数据库设计

### lotteries（抽奖活动）
| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 活动ID |
| title | string | 活动标题 |
| description | string | 活动描述 |
| prizes | array | 奖品列表 |
| status | number | 状态 0未开始 1进行中 2已结束 3已取消 |
| endTime | date | 截止时间 |
| creatorId | string | 创建者 OpenID |
| participants | array | 参与者列表 |

### participants（参与者）
| 字段 | 类型 | 说明 |
|------|------|------|
| lotteryId | string | 活动ID |
| userId | string | 用户 OpenID |
| nickName | string | 昵称 |
| createTime | date | 参与时间 |

## 📄 License

MIT
