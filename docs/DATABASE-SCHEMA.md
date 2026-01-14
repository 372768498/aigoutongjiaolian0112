# 🗄️ 数据库 Schema 文档

> AI 沟通教练 - Supabase PostgreSQL 数据库设计

---

## 📊 表概览

| 表名 | 用途 | 行数估计 |
|------|------|----------|
| `auth.users` | 用户认证（Supabase 自动管理） | - |
| `relationships` | 关系档案 | 每用户 5-20 条 |
| `conversations` | 对话历史 | 每关系 50-500 条 |
| `screenshot_analyses` | 截图分析缓存 | 每用户 10-50 条 |

---

## 1️⃣ relationships - 关系档案表

### 字段说明

```sql
CREATE TABLE relationships (
  -- 主键
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,  -- 关联到 auth.users
  
  -- 基本信息
  person_name TEXT NOT NULL,           -- 称呼（例：男友、张总）
  relationship_type TEXT NOT NULL,     -- 关系类型
  emoji TEXT DEFAULT '💬',             -- 显示图标
  
  -- 目标和人设
  goal TEXT,                           -- 关系目标
  desired_persona TEXT[],              -- 期望人设标签
  
  -- 沟通风格（JSONB）
  communication_style JSONB,
  
  -- 学习进度
  learning_progress INTEGER DEFAULT 0, -- 0-100
  conversation_count INTEGER DEFAULT 0,
  
  -- 时间戳
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### relationship_type 枚举值

```typescript
type RelationshipType = 
  | 'romantic'             // 💑 恋爱关系
  | 'dating'               // 💕 相亲/约会
  | 'workplace_boss'       // 💼 职场上级
  | 'workplace_colleague'  // 🤝 职场同事
  | 'friend'               // 👫 朋友
  | 'family'               // 👨‍👩‍👧 家人
```

### communication_style 结构

```json
{
  "vocabulary": ["宝贝", "呀", "哈哈"],
  "sentenceLength": "short",  // "short" | "medium" | "long"
  "emojiUsage": "frequent",    // "frequent" | "occasional" | "rare"
  "tone": "温柔"               // 自由文本
}
```

### 索引

```sql
CREATE INDEX idx_relationships_user_id ON relationships(user_id);
CREATE INDEX idx_relationships_created_at ON relationships(created_at DESC);
```

---

## 2️⃣ conversations - 对话历史表

### 字段说明

```sql
CREATE TABLE conversations (
  -- 主键
  id UUID PRIMARY KEY,
  relationship_id UUID NOT NULL,  -- 关联到 relationships
  
  -- 对话内容
  their_message TEXT NOT NULL,    -- 对方说的话
  context TEXT,                   -- 背景信息（可选）
  
  -- AI 建议
  replies JSONB NOT NULL,         -- AI 生成的多个建议
  used_reply_id TEXT,             -- 用户选择的建议 ID
  
  -- 效果反馈
  effectiveness TEXT,             -- 'success' | 'failed' | 'neutral'
  feedback_note TEXT,             -- 用户的文字反馈
  
  -- 时间戳
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### replies 结构（JSONB 数组）

```json
[
  {
    "id": "reply_1",
    "content": "宝贝你是对哪部分有疑问呀？",
    "strategy": "主动澄清",
    "strategyType": "conservative",
    "whyThis": "符合你的温柔人设",
    "riskLevel": "low",
    "riskReason": "风险较低，安全选择",
    "prediction": {
      "scenario1": { "probability": 70, "response": "..." },
      "scenario2": { "probability": 20, "response": "..." },
      "scenario3": { "probability": 10, "response": "..." }
    }
  },
  // ... 更多建议
]
```

### effectiveness 枚举值

```typescript
type Effectiveness = 
  | 'success'  // ✅ 效果好
  | 'failed'   // ❌ 效果不好
  | 'neutral'  // ⏸️ 一般
  | null       // 未反馈
```

### 索引

```sql
CREATE INDEX idx_conversations_relationship_id ON conversations(relationship_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX idx_conversations_effectiveness ON conversations(effectiveness);
```

---

## 3️⃣ screenshot_analyses - 截图分析表

### 字段说明

```sql
CREATE TABLE screenshot_analyses (
  -- 主键
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- 图片
  image_urls TEXT[],              -- 截图 URL 数组
  
  -- 分析结果
  analysis_result JSONB NOT NULL,
  
  -- 关联关系（如果已创建）
  relationship_id UUID,
  
  -- 时间戳
  created_at TIMESTAMPTZ
);
```

### analysis_result 结构

```json
{
  "personName": "男友",
  "relationshipType": "romantic",
  "communicationStyle": {
    "vocabulary": ["宝贝", "呀"],
    "sentenceLength": "short",
    "emojiUsage": "frequent",
    "tone": "温柔"
  },
  "suggestedGoal": "推进关系发展",
  "suggestedPersona": ["独立", "温柔", "体贴"]
}
```

---

## 🔒 Row Level Security (RLS)

### 策略概述

所有表都启用了 RLS，确保用户只能访问自己的数据。

### relationships 表策略

```sql
-- 用户只能查看/修改自己的关系
auth.uid() = user_id
```

### conversations 表策略

```sql
-- 用户只能查看/修改自己关系的对话
EXISTS (
  SELECT 1 FROM relationships
  WHERE relationships.id = conversations.relationship_id
  AND relationships.user_id = auth.uid()
)
```

---

## 🔄 触发器和函数

### 1. 自动更新 updated_at

```sql
CREATE TRIGGER update_relationships_updated_at
BEFORE UPDATE ON relationships
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### 2. 自动更新学习进度

```sql
CREATE TRIGGER update_progress_on_new_conversation
AFTER INSERT ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_relationship_progress();
```

**算法**：每10次对话增加5%进度，最高100%

---

## 📈 查询示例

### 1. 获取用户的所有关系

```sql
SELECT *
FROM relationships
WHERE user_id = auth.uid()
ORDER BY updated_at DESC;
```

### 2. 获取关系的对话历史

```sql
SELECT *
FROM conversations
WHERE relationship_id = $1
ORDER BY created_at DESC
LIMIT 20;
```

### 3. 获取成功的对话策略

```sql
SELECT 
  used_reply_id,
  replies,
  COUNT(*) as success_count
FROM conversations
WHERE relationship_id = $1
  AND effectiveness = 'success'
  AND used_reply_id IS NOT NULL
GROUP BY used_reply_id, replies
ORDER BY success_count DESC
LIMIT 5;
```

### 4. 计算关系的成功率

```sql
SELECT 
  relationship_id,
  COUNT(*) FILTER (WHERE effectiveness = 'success') * 100.0 / COUNT(*) as success_rate
FROM conversations
WHERE relationship_id = $1
  AND effectiveness IS NOT NULL
GROUP BY relationship_id;
```

---

## 🚀 迁移步骤

### 1. 本地开发

```bash
# 连接到 Supabase
supabase link --project-ref your-project-ref

# 运行迁移
supabase db push
```

### 2. 生产环境

在 Supabase Dashboard:
1. SQL Editor
2. 粘贴 `20260114_initial_schema.sql`
3. Run

---

## 📊 存储估算

### 单个用户

```
关系数：5-20 条
每关系对话数：50-500 条
总对话数：250-10,000 条

存储空间估算：
- relationships: 5KB-20KB
- conversations: 100KB-5MB
- 总计：~100KB-5MB/用户
```

### 1000用户

```
总存储：100MB - 5GB
```

---

## 🔧 维护建议

### 1. 定期清理

```sql
-- 删除90天前的截图分析
DELETE FROM screenshot_analyses
WHERE created_at < NOW() - INTERVAL '90 days'
  AND relationship_id IS NOT NULL;
```

### 2. 性能优化

```sql
-- 分析慢查询
EXPLAIN ANALYZE
SELECT * FROM conversations
WHERE relationship_id = 'xxx'
ORDER BY created_at DESC;
```

### 3. 备份

```bash
# Supabase 自动每日备份
# 手动备份
supabase db dump > backup.sql
```

---

## 📝 更新日志

### v1.0 (2026-01-14)
- ✅ 初始 Schema
- ✅ RLS 策略
- ✅ 触发器和函数
- ✅ 索引优化

---

**文档版本**: v1.0  
**最后更新**: 2026-01-14