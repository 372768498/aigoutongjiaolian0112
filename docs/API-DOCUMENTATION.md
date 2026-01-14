# 🔌 API 文档

> AI 沟通教练 - 完整 API 接口文档

---

## 🔑 认证

### 当前阶段（测试）

```bash
# 所有请求需要带 header
X-User-Id: test-user-001
```

### 未来（生产）

```bash
# 使用 Supabase Auth Token
Authorization: Bearer <access_token>
```

---

## 📁 关系管理 API

### 1. 获取关系列表

```http
GET /api/relationships
```

**Headers**:
```
X-User-Id: test-user-001
```

**Response**:
```json
{
  "relationships": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "person_name": "男友",
      "relationship_type": "romantic",
      "emoji": "💑",
      "goal": "推进到同居阶段",
      "desired_persona": ["独立", "温柔"],
      "communication_style": {
        "vocabulary": ["宝贝", "呀"],
        "sentenceLength": "short",
        "emojiUsage": "frequent",
        "tone": "温柔"
      },
      "learning_progress": 75,
      "conversation_count": 12,
      "created_at": "2026-01-14T10:00:00Z",
      "updated_at": "2026-01-14T10:00:00Z"
    }
  ]
}
```

---

### 2. 创建关系

```http
POST /api/relationships
```

**Headers**:
```
X-User-Id: test-user-001
Content-Type: application/json
```

**Body**:
```json
{
  "personName": "男友",
  "relationshipType": "romantic",
  "emoji": "💑",
  "goal": "推进到同居阶段",
  "desiredPersona": ["独立", "温柔"],
  "communicationStyle": {
    "vocabulary": ["宝贝", "呀"],
    "sentenceLength": "short",
    "emojiUsage": "frequent",
    "tone": "温柔"
  }
}
```

**Response**:
```json
{
  "relationship": {
    "id": "uuid",
    ...
  }
}
```

---

### 3. 获取关系详情

```http
GET /api/relationships/{id}
```

**Response**:
```json
{
  "relationship": {
    "id": "uuid",
    ...
  }
}
```

---

### 4. 更新关系

```http
PATCH /api/relationships/{id}
```

**Body** (可选字段):
```json
{
  "goal": "新目标",
  "desired_persona": ["新人设"],
  "communication_style": {...}
}
```

---

### 5. 删除关系

```http
DELETE /api/relationships/{id}
```

**Response**:
```json
{
  "success": true
}
```

---

## 💬 对话管理 API

### 6. 获取对话历史

```http
GET /api/relationships/{id}/conversations?limit=20&offset=0
```

**Response**:
```json
{
  "conversations": [
    {
      "id": "uuid",
      "relationship_id": "uuid",
      "their_message": "随便你",
      "context": "讨论晚饭",
      "replies": [
        {
          "id": "reply_1",
          "content": "宝贝你是对哪部分有疑问呀？",
          "strategy": "主动澄清",
          "strategyType": "conservative",
          "whyThis": "符合你的温柔人设",
          "riskLevel": "low",
          "riskReason": "风险较低",
          "prediction": {...}
        }
      ],
      "used_reply_id": "reply_1",
      "effectiveness": "success",
      "feedback_note": null,
      "created_at": "2026-01-14T10:00:00Z"
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

---

### 7. 创建对话

```http
POST /api/relationships/{id}/conversations
```

**Body**:
```json
{
  "theirMessage": "随便你",
  "context": "讨论晚饭",
  "replies": [
    {
      "id": "reply_1",
      "content": "...",
      "strategy": "...",
      ...
    }
  ],
  "usedReplyId": "reply_1",
  "effectiveness": "success",
  "feedbackNote": "效果很好"
}
```

---

### 8. 更新对话反馈

```http
PATCH /api/conversations/{id}/feedback
```

**Body**:
```json
{
  "usedReplyId": "reply_2",
  "effectiveness": "success",
  "feedbackNote": "对方很满意"
}
```

---

## 💎 快速回复 API

### 9. 获取快速建议

```http
POST /api/quick-reply
```

**Body**:
```json
{
  "theirMessage": "随便你",
  "context": "讨论晚饭",
  "relationshipId": "uuid"  // 可选，有则使用智能 Prompt
}
```

**Response**:
```json
{
  "analysis": {
    "emotion": "对方情绪",
    "intention": "对方意图",
    "context": "情境分析"
  },
  "suggestedStrategy": {
    "name": "推荐策略",
    "type": "conservative",
    "reason": "为什么推荐"
  },
  "replies": [
    {
      "id": "reply_1",
      "content": "具体回复",
      "strategy": "策略名称",
      "strategyType": "conservative",
      "whyThis": "为什么这样说",
      "riskLevel": "low",
      "riskReason": "风险说明",
      "prediction": {
        "scenario1": { "probability": 70, "response": "..." },
        "scenario2": { "probability": 20, "response": "..." },
        "scenario3": { "probability": 10, "response": "..." }
      }
    }
  ],
  "recommendedReplyId": "reply_2"
}
```

---

## ⚠️ 错误处理

### 通用错误格式

```json
{
  "error": "错误消息",
  "details": "详细信息"
}
```

### HTTP 状态码

| 状态码 | 说明 |
|---------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 📊 限流

### 当前限制

- OpenAI API: 根据你的 API Key 限制
- Supabase: Free Tier 限制
  - 500MB 数据库
  - 5GB 文件存储
  - 2GB 带宽/月

---

## 🧪 测试命令

### 获取关系列表

```bash
curl -X GET https://aigoutongjiaolian0112.vercel.app/api/relationships \
  -H "X-User-Id: test-user-001"
```

### 创建关系

```bash
curl -X POST https://aigoutongjiaolian0112.vercel.app/api/relationships \
  -H "X-User-Id: test-user-001" \
  -H "Content-Type: application/json" \
  -d '{
    "personName": "测试关系",
    "relationshipType": "friend"
  }'
```

### 快速回复

```bash
curl -X POST https://aigoutongjiaolian0112.vercel.app/api/quick-reply \
  -H "Content-Type: application/json" \
  -d '{
    "theirMessage": "随便你",
    "context": "讨论晚饭"
  }'
```

---

**文档版本**: v1.0  
**最后更新**: 2026-01-14