# 🚀 AI 沟通教练 MVP 1.0 - 部署指南

> 从 0 到上线的完整步骤

请参考这个文档完成部署配置。

部署完成后，可以通过以下 API 测试：

## API 端点

### 1. 截图识别 API
```
POST /api/analyze-screenshot
{
  "imageBase64": "data:image/png;base64,...",
  "userId": "可选"
}
```

### 2. 快速回复 API (快速模式)
```
POST /api/quick-reply
{
  "theirMessage": "对方说的话",
  "context": "可选背景"
}
```

### 3. 快速回复 API (精准模式)
```
POST /api/quick-reply
{
  "theirMessage": "对方说的话",
  "relationshipId": "关系档案ID",
  "context": "可选背景"
}
```
