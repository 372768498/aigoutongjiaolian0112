# 🚀 Supabase 设置指南

> 快速配置 Supabase 数据库，让应用真正运行起来

---

## 📝 前置条件

- [x] Supabase 账号（https://supabase.com）
- [x] 项目已克隆到本地

---

## 🎯 步骤1：创建 Supabase 项目

### 1. 访问 Supabase Dashboard

```
https://supabase.com/dashboard
```

### 2. 创建新项目

```
项目名称：AI Communication Coach
Database 密码：（设置一个强密码）
Region：Northeast Asia (东京)
价格：Free Tier
```

### 3. 等待项目初始化（1-2分钟）

---

## 🗄️ 步骤2：运行数据库迁移

### 1. 打开 SQL Editor

```
Dashboard → SQL Editor → New Query
```

### 2. 复制迁移 SQL

```bash
# 本地打开文件
cat supabase/migrations/20260114_initial_schema.sql
```

或直接从 GitHub 复制：
https://github.com/372768498/aigoutongjiaolian0112/blob/main/supabase/migrations/20260114_initial_schema.sql

### 3. 粘贴到 SQL Editor

将整个 SQL 文件内容粘贴到编辑器

### 4. 执行 SQL

```
点击 "Run" 或 Ctrl+Enter
```

### 5. 验证创建成功

```sql
-- 查看表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 应该看到：
-- relationships
-- conversations
-- screenshot_analyses
```

---

## 🔑 步骤3：获取 API 密钥

### 1. 打开 Project Settings

```
Dashboard → Settings → API
```

### 2. 复制以下信息

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGc...
service_role key: eyJhbGc... (保密！)
```

---

## 📝 步骤4：配置环境变量

### 本地开发

创建 `.env.local` 文件：

```bash
# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Vercel 部署

在 Vercel Dashboard 添加环境变量：

```
Settings → Environment Variables → Add New

添加以下 4 个变量：
1. OPENAI_API_KEY
2. NEXT_PUBLIC_SUPABASE_URL
3. NEXT_PUBLIC_SUPABASE_ANON_KEY
4. SUPABASE_SERVICE_ROLE_KEY
```

---

## 🧪 步骤5：创建测试数据

### 在 SQL Editor 执行：

```sql
-- 创建测试关系
INSERT INTO relationships (
  id,
  user_id,
  person_name,
  relationship_type,
  emoji,
  goal,
  desired_persona,
  communication_style,
  learning_progress,
  conversation_count
) VALUES (
  'test-relationship-001',
  'test-user-001',
  '男友',
  'romantic',
  '💑',
  '推进到同居阶段',
  ARRAY['独立', '温柔', '不作不闹'],
  '{
    "vocabulary": ["宝贝", "呀", "哈哈", "唔唔"],
    "sentenceLength": "short",
    "emojiUsage": "frequent",
    "tone": "温柔"
  }'::jsonb,
  75,
  12
);

-- 创建测试对话
INSERT INTO conversations (
  id,
  relationship_id,
  their_message,
  replies,
  used_reply_id,
  effectiveness
) VALUES 
(
  'test-conv-001',
  'test-relationship-001',
  '随便你',
  '[
    {
      "id": "reply_1",
      "content": "宝贝你是对哪部分有疑问呀？",
      "strategy": "主动澄清",
      "strategyType": "conservative",
      "whyThis": "符合你的温柔人设",
      "riskLevel": "low"
    }
  ]'::jsonb,
  'reply_1',
  'success'
);
```

---

## ✅ 步骤6：验证连接

### 本地测试

```bash
# 启动开发服务器
npm run dev

# 访问
http://localhost:3000/api/relationships

# 应该返回：
{
  "relationships": [
    {
      "id": "test-relationship-001",
      "person_name": "男友",
      ...
    }
  ]
}
```

### 生产环境测试

```bash
# Vercel 部署完成后
curl https://aigoutongjiaolian0112.vercel.app/api/relationships \
  -H "x-user-id: test-user-001"
```

---

## 🐛 常见问题

### Q1: SQL 执行失败

**错误**：`relation "relationships" already exists`

**解决**：表已存在，跳过此步骤

### Q2: API 返回 500 错误

**排查**：
1. 检查 `.env.local` 是否正确
2. 检查 Vercel 环境变量是否配置
3. 查看 Vercel Logs

### Q3: RLS 策略错误

**错误**：`new row violates row-level security policy`

**原因**：目前使用 service_role key，绕过 RLS

**注意**：生产环境需要实现用户认证

### Q4: 数据不显示

**排查**：
1. 检查 `user_id` 是否匹配
2. 检查 SQL 查询是否正确
3. 查看 Supabase Table Editor

---

## 🛡️ 安全注意事项

### 保护 service_role key

⚠️ **绝对不要**把 `service_role key` 提交到 Git

```bash
# 检查 .gitignore
cat .gitignore | grep .env.local

# 应该有：
.env*.local
```

### RLS 策略

✅ 已启用所有表的 RLS  
✅ 用户只能访问自己的数据

### 数据备份

Supabase 自动每日备份，但建议：

```bash
# 定期手动备份
supabase db dump -f backup_$(date +%Y%m%d).sql
```

---

## 🚀 下一步

现在数据库已经配置完成，可以：

1. ✅ 本地测试 API
2. ✅ Vercel 重新部署
3. ✅ 手机测试完整流程
4. 🔴 实现用户登录系统

---

## 📚 相关文档

- [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md) - 数据库 Schema 详细文档
- [Supabase 官方文档](https://supabase.com/docs)

---

**文档版本**: v1.0  
**最后更新**: 2026-01-14