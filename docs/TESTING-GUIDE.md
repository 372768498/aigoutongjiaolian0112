# 🧪 智能 Prompt 测试指南

## 🎯 测试目标

验证智能 Prompt 能否生成**更像用户自己说的话**

---

## 🚦 测试场景1：无档案（快速模式）

### API 请求
```bash
curl -X POST https://aigoutongjiaolian0112.vercel.app/api/quick-reply \
  -H "Content-Type: application/json" \
  -d '{
    "theirMessage": "随便你",
    "context": "正在讨论晚饭吃什么"
  }'
```

### 预期结果
- ✅ 3秒内返回
- ✅ 3个通用建议
- ✅ 质量：60-70分（可用但不够个性化）

---

## 💎 测试场景2：有档案（精准模式）

### 第一步：创建测试数据

在 Supabase Dashboard 执行：

```sql
-- 1. 创建关系档案
INSERT INTO relationships (
  id,
  user_id,
  person_name,
  relationship_type,
  goal,
  desired_persona,
  communication_style,
  created_at
) VALUES (
  'test-relationship-001',
  'test-user-001',
  '男友',
  'romantic',
  '推进到同居阶段',
  ARRAY['独立', '温柔', '不作不闹'],
  '{
    "vocabulary": ["宝贝", "呀", "哈哈", "唔唔"],
    "sentenceLength": "short",
    "emojiUsage": "frequent",
    "tone": "温柔"
  }'::jsonb,
  NOW()
);

-- 2. 创建成功对话历史
INSERT INTO conversations (
  id,
  relationship_id,
  their_message,
  replies,
  used_reply_id,
  effectiveness,
  created_at
) VALUES 
(
  'test-conv-001',
  'test-relationship-001',
  '今天好累',
  '[
    {
      "id": "reply_1",
      "content": "宝贝辛苦了！要不要我给你按按肩呀？😊",
      "strategy": "撒娇式关心"
    }
  ]'::jsonb,
  'reply_1',
  'success',
  NOW() - INTERVAL '1 day'
),
(
  'test-conv-002',
  'test-relationship-001',
  '我也不知道怎么办',
  '[
    {
      "id": "reply_1",
      "content": "没关系呀，我们一起想办法嘛~",
      "strategy": "主动承担"
    }
  ]'::jsonb,
  'reply_1',
  'success',
  NOW() - INTERVAL '2 days'
);
```

### 第二步：API 请求（带档案）

```bash
curl -X POST https://aigoutongjiaolian0112.vercel.app/api/quick-reply \
  -H "Content-Type: application/json" \
  -d '{
    "theirMessage": "随便你",
    "context": "正在讨论晚饭吃什么",
    "relationshipId": "test-relationship-001"
  }'
```

### 预期结果
- ✅ 5-8秒内返回
- ✅ 3个高度个性化建议
- ✅ **使用“宝贝”、“呀”等用户常用词**
- ✅ **短句为主**
- ✅ **有emoji**
- ✅ **语气温柔**
- ✅ 质量：85-95分（就像用户自己说的）

---

## 📊 对比检查清单

### 回复内容检查

| 检查项 | 无档案 | 有档案 | 说明 |
|--------|--------|--------|------|
| 用词 | 通用 | 个性化（宝贝、呀） | ✅ 关键指标 |
| 句长 | 不定 | 短句 | ✅ 关键指标 |
| Emoji | 可能没有 | 频繁使用 | ✅ 关键指标 |
| 语气 | 中性 | 温柔 | ✅ 关键指标 |
| 策略 | 通用 | 基于历史成功 | ✅ 关键指标 |

### 示例对比

#### 无档案（通用）：
```json
{
  "content": "你是想让我做决定吗？那我们就去吃火锅吧！",
  "strategy": "主动建议",
  "whyThis": "对方可能希望你做决定"
}
```

#### 有档案（个性化）：
```json
{
  "content": "宝贝你是对哪部分有疑问呀？我可以详细说说~😊",
  "strategy": "撒娇式澄清",
  "whyThis": "符合你温柔独立的人设，用撒娇式沟通之前成功率80%"
}
```

**关键差异：**
- ✅ 用了“宝贝”、“呀”（用户常用词）
- ✅ 用了emoji（用户习惯）
- ✅ 短句（用户风格）
- ✅ 语气温柔（用户人设）
- ✅ 基于历史成功策略

---

## ✅ 成功标准

### 质量提升指标
- [ ] 有档案的回复**明显更个性化**
- [ ] 使用了用户的常用词汇
- [ ] 符合用户的说话风格
- [ ] 基于历史成功经验
- [ ] 避免了历史失败模式

### 响应时间
- [ ] 无档案：< 5秒
- [ ] 有档案：< 10秒

### 成本
- [ ] 每次调用 < $0.05

---

## 🐛 常见问题

### 问题1：档案没生效
**症状**：即使传了 relationshipId，回复仍然通用

**排查**：
1. 检查数据库中是否真的存在这个关系
2. 检查 Vercel Logs 是否显示 `hasProfile: true`
3. 检查环境变量 `SUPABASE_SERVICE_ROLE_KEY` 是否正确

### 问题2：回复质量不好
**症状**：回复虽然个性化，但不符合预期

**排查**：
1. 检查 `communication_style` 字段格式是否正确
2. 增加更多成功对话历史
3. 调整 `desired_persona` 更具体

### 问题3：响应太慢
**症状**：超过10秒才返回

**排查**：
1. 检查是否有太多历史对话需要加载
2. 优化数据库查询（添加索引）
3. 考虑缓存档案信息

---

## 📝 快速测试命令

```bash
# 无档案测试
curl -X POST https://aigoutongjiaolian0112.vercel.app/api/quick-reply \
  -H "Content-Type: application/json" \
  -d '{"theirMessage": "随便你"}' | jq

# 有档案测试
curl -X POST https://aigoutongjiaolian0112.vercel.app/api/quick-reply \
  -H "Content-Type: application/json" \
  -d '{
    "theirMessage": "随便你",
    "relationshipId": "test-relationship-001"
  }' | jq
```

---

**文档版本**: v1.0  
**更新时间**: 2026-01-14