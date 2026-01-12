# 🚀 场景选择功能 - 快速安装指南

## 📦 已准备好的文件

我已经为你修改好了以下文件：

1. ✅ **page.tsx** - 修改后的主页面（已添加场景选择）
2. ✅ **SceneSelector-READY.tsx** - 场景选择组件

---

## 🎯 安装步骤（3步完成）

### 第 1 步：下载文件

在这个对话中，点击下载：
- `page.tsx`
- `SceneSelector-READY.tsx`

### 第 2 步：复制文件到项目

```bash
# 打开你的项目文件夹
cd C:\Users\jojo1\ai-coach

# 方法 A：手动复制（推荐）
# 1. 把下载的 page.tsx 复制到：src/app/page.tsx（覆盖原文件）
# 2. 把 SceneSelector-READY.tsx 重命名为 SceneSelector.tsx
# 3. 把它复制到：src/components/SceneSelector.tsx
```

**或者用命令行：**

```bash
# 假设你下载到了 Downloads 文件夹
# Windows PowerShell：
copy C:\Users\jojo1\Downloads\page.tsx C:\Users\jojo1\ai-coach\src\app\page.tsx
copy C:\Users\jojo1\Downloads\SceneSelector-READY.tsx C:\Users\jojo1\ai-coach\src\components\SceneSelector.tsx
```

### 第 3 步：确保项目在运行

```bash
# 在项目目录
cd C:\Users\jojo1\ai-coach

# 如果服务器没运行，启动它
npm run dev

# 如果报错缺少依赖，安装它们
npm install
```

---

## ✅ 完成后效果

刷新浏览器 `http://localhost:3000`，你会看到：

```
┌─────────────────────────────────────┐
│  这次聊天是什么场景？               │
│  💡 选择场景后，AI 会提供更精准建议 │
│                                     │
│  [💑 异地恋]  [💝 相亲]  [💼 职场] │
│  [👫 朋友]    [❤️ 恋爱]  [👨‍👩‍👧 家庭] │
└─────────────────────────────────────┘
```

---

## 📝 主要改动说明

### 1. 添加了场景选择卡片
在上传截图之前，用户先选择场景

### 2. 场景信息传递给 API
```typescript
body: JSON.stringify({ 
  images, 
  context,
  scene_type: sceneType  // 👈 新增
}),
```

### 3. 显示当前场景
选择场景后，显示当前场景名称，并可以更改

---

## 🐛 可能遇到的问题

### 问题 1: 报错找不到 SceneSelector

**原因**：文件路径不对或文件名错误

**解决**：
1. 确保 `SceneSelector.tsx` 在 `src/components/` 文件夹下
2. 确保文件名正确（大小写敏感）

### 问题 2: 报错找不到 Card 组件

**解决**：
```bash
npx shadcn-ui@latest add card
```

### 问题 3: 样式不对

**解决**：
1. 确保 Tailwind CSS 已配置
2. 重启开发服务器：
   ```bash
   # Ctrl+C 停止
   npm run dev
   ```

---

## 🎯 下一步（可选）

场景选择功能已经完成！如果你想继续添加：

1. **话题库功能** - 200+ 话题推荐
2. **快速回复功能** - 不知道怎么回？给你 3-5 个选项
3. **历史记录功能** - 保存分析记录

告诉我你想先加哪个！

---

## 📞 需要帮助？

如果遇到问题：
1. 截图错误信息
2. 告诉我具体哪一步卡住了
3. 我继续帮你解决

---

**更新时间**: 2026-01-12  
**状态**: ✅ 可以直接使用
