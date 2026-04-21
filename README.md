# 账号管家公司 - Account Manager

A macOS desktop application for managing multi-platform social media accounts and publish schedules.

## 功能特性

- **账号管理** - 支持10+主流平台（抖音、小红书、微信视频号、B站、微博等）
- **发布计划** - 创建和管理内容发布时间线
- **日历视图** - 月度日历可视化展示发布计划
- **一键发布** - 快速打开平台、复制内容到剪贴板
- **数据统计** - 账号分布、发布进度统计
- **本地存储** - SQLite本地数据库，保护隐私
- **系统通知** - macOS原生通知提醒

## 支持的平台

| 平台 | 颜色 |
|------|------|
| 抖音 | #FE2C55 |
| 小红书 | #FF2442 |
| 微信视频号 | #07C160 |
| B站 | #00A1D6 |
| 微博 | #E6162D |
| 得物 | #CDE900 |
| 什么值得买 | #FF4500 |
| 快手 | #FF4906 |
| 美图 | #FF2D68 |
| Soul | #FF5C2D |

## 技术栈

- **框架**: Tauri 2.x
- **前端**: React 18 + TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **数据库**: SQLite
- **图标**: Lucide React

## 开发

### 环境要求

- Node.js 18+
- Rust 1.70+
- macOS (用于构建.dmg)

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run tauri dev
```

### 构建

```bash
# macOS
npm run tauri build

# Windows (生成.exe)
npm run tauri build
```

## 构建 .dmg

由于 .dmg 是 macOS 特有格式，需要在 macOS 系统上构建。

### 方法1: GitHub Actions (推荐)

1. 推送代码到 GitHub
2. Actions 会自动构建
3. 下载 artifact 中的 .dmg

### 方法2: 本地 macOS

```bash
npm install
npm run tauri build
# 输出: src-tauri/target/release/bundle/macos/*.dmg
```

## 项目结构

```
account-manager/
├── src/                      # React前端
│   ├── components/           # UI组件
│   ├── stores/               # Zustand状态管理
│   ├── lib/                  # 工具函数
│   ├── types/                # TypeScript类型
│   └── App.tsx               # 主应用
├── src-tauri/                # Rust后端
│   ├── src/                  # Rust源代码
│   ├── Cargo.toml            # Rust依赖
│   └── tauri.conf.json       # Tauri配置
├── public/                   # 静态资源
├── SPEC.md                   # 详细规格说明
└── package.json              # Node依赖
```

## 使用说明

1. **添加账号**: 点击"添加账号"，选择平台，输入账号信息
2. **创建计划**: 点击"创建计划"，选择目标账号，设置发布时间
3. **一键发布**: 在计划列表点击"一键发布"，自动打开平台并复制内容
4. **查看日历**: 日历视图展示每月发布计划

## License

MIT
