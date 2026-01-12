# 🗣️ AI 沟通教练

> 像心理咨询师一样帮你看懂对方，像沟通教练一样教你怎么说

[![Deploy with Vercel](https://vercel.com/button)](https://aigoutongjiaolian0112.vercel.app/)

## ✨ 功能特点

- 📸 **截图分析** - 上传聊天截图，AI 自动识别对话内容
- 🎭 **情绪诊断** - 分析双方情绪状态和强度
- ⚠️ **问题识别** - 找出沟通中的核心问题
- 💡 **策略推荐** - 提供3个差异化沟通策略
- 💬 **话术指导** - 分步话术模板 + 使用解释

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/372768498/aigoutongjiaolian0112.git
cd aigoutongjiaolian0112

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 OPENAI_API_KEY

# 启动开发服务器
npm run dev
```

打开 http://localhost:3000 查看应用

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **UI**: shadcn/ui
- **AI**: OpenAI GPT-4o
- **部署**: Vercel

## 📁 项目结构

```
src/
├── app/
│   ├── api/analyze/route.ts  # AI 分析接口
│   ├── page.tsx              # 主页面
│   ├── layout.tsx            # 布局
│   └── globals.css           # 全局样式
├── components/ui/            # UI 组件
└── lib/utils.ts              # 工具函数
```

## 📖 文档

详细项目文档请查看 [PROJECT_DOC.md](./PROJECT_DOC.md)

## 📝 License

MIT
