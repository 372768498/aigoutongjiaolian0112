-- AI 沟通教练数据库 Schema
-- Version: 1.0
-- Date: 2026-01-14

-- ============================================
-- 1. 用户表（由 Supabase Auth 自动管理）
-- ============================================
-- auth.users 表已存在，无需创建

-- ============================================
-- 2. 关系档案表
-- ============================================
CREATE TABLE IF NOT EXISTS relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 基本信息
  person_name TEXT NOT NULL,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN (
    'romantic',           -- 恋爱关系
    'dating',            -- 相亲/约会
    'workplace_boss',    -- 职场上级
    'workplace_colleague', -- 职场同事
    'friend',            -- 朋友
    'family'             -- 家人
  )),
  emoji TEXT DEFAULT '💬',
  
  -- 目标和人设
  goal TEXT,
  desired_persona TEXT[] DEFAULT '{}',
  
  -- 沟通风格（JSONB 格式）
  communication_style JSONB DEFAULT '{}',
  -- 示例: {
  --   "vocabulary": ["宝贝", "呀", "哈哈"],
  --   "sentenceLength": "short",
  --   "emojiUsage": "frequent",
  --   "tone": "温柔"
  -- }
  
  -- 学习进度
  learning_progress INTEGER DEFAULT 0 CHECK (learning_progress >= 0 AND learning_progress <= 100),
  conversation_count INTEGER DEFAULT 0,
  
  -- 元数据
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_relationships_user_id ON relationships(user_id);
CREATE INDEX idx_relationships_created_at ON relationships(created_at DESC);

-- 更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_relationships_updated_at
BEFORE UPDATE ON relationships
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. 对话历史表
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id UUID NOT NULL REFERENCES relationships(id) ON DELETE CASCADE,
  
  -- 对话内容
  their_message TEXT NOT NULL,
  context TEXT,
  
  -- AI 生成的建议（JSONB 数组）
  replies JSONB NOT NULL DEFAULT '[]',
  -- 示例: [
  --   {
  --     "id": "reply_1",
  --     "content": "具体回复内容",
  --     "strategy": "策略名称",
  --     "strategyType": "conservative",
  --     "whyThis": "为什么这样说",
  --     "riskLevel": "low",
  --     "riskReason": "风险说明",
  --     "prediction": {...}
  --   }
  -- ]
  
  -- 用户选择
  used_reply_id TEXT,
  
  -- 效果反馈
  effectiveness TEXT CHECK (effectiveness IN ('success', 'failed', 'neutral', NULL)),
  feedback_note TEXT,
  
  -- 元数据
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_conversations_relationship_id ON conversations(relationship_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX idx_conversations_effectiveness ON conversations(effectiveness);

CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. 截图分析表（可选，用于缓存）
-- ============================================
CREATE TABLE IF NOT EXISTS screenshot_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 图片信息
  image_urls TEXT[] NOT NULL,
  
  -- 分析结果
  analysis_result JSONB NOT NULL,
  -- 示例: {
  --   "personName": "男友",
  --   "relationshipType": "romantic",
  --   "communicationStyle": {...},
  --   "suggestedGoal": "推进关系",
  --   "suggestedPersona": [...]
  -- }
  
  -- 是否已创建关系
  relationship_id UUID REFERENCES relationships(id) ON DELETE SET NULL,
  
  -- 元数据
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_screenshot_analyses_user_id ON screenshot_analyses(user_id);
CREATE INDEX idx_screenshot_analyses_created_at ON screenshot_analyses(created_at DESC);

-- ============================================
-- 5. Row Level Security (RLS) 策略
-- ============================================

-- 启用 RLS
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_analyses ENABLE ROW LEVEL SECURITY;

-- relationships 表策略
CREATE POLICY "Users can view their own relationships"
  ON relationships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own relationships"
  ON relationships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own relationships"
  ON relationships FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own relationships"
  ON relationships FOR DELETE
  USING (auth.uid() = user_id);

-- conversations 表策略
CREATE POLICY "Users can view conversations of their relationships"
  ON conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.id = conversations.relationship_id
      AND relationships.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert conversations for their relationships"
  ON conversations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.id = conversations.relationship_id
      AND relationships.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own conversations"
  ON conversations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.id = conversations.relationship_id
      AND relationships.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own conversations"
  ON conversations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.id = conversations.relationship_id
      AND relationships.user_id = auth.uid()
    )
  );

-- screenshot_analyses 表策略
CREATE POLICY "Users can view their own screenshot analyses"
  ON screenshot_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own screenshot analyses"
  ON screenshot_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own screenshot analyses"
  ON screenshot_analyses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own screenshot analyses"
  ON screenshot_analyses FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 6. 函数：更新学习进度
-- ============================================
CREATE OR REPLACE FUNCTION update_relationship_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新对话次数
  UPDATE relationships
  SET 
    conversation_count = conversation_count + 1,
    -- 简单的学习进度算法：每10次对话增加5%，最高100%
    learning_progress = LEAST(100, (conversation_count + 1) * 5)
  WHERE id = NEW.relationship_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_progress_on_new_conversation
AFTER INSERT ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_relationship_progress();

-- ============================================
-- 7. 示例数据（开发环境）
-- ============================================
-- 注意：生产环境不要执行此部分

-- 仅在开发环境执行
-- INSERT INTO relationships (
--   user_id,
--   person_name,
--   relationship_type,
--   emoji,
--   goal,
--   desired_persona,
--   communication_style,
--   learning_progress,
--   conversation_count
-- ) VALUES (
--   'user-uuid-here',  -- 替换为实际用户 ID
--   '男友',
--   'romantic',
--   '💑',
--   '推进到同居阶段',
--   ARRAY['独立', '温柔', '不作不闹'],
--   '{
--     "vocabulary": ["宝贝", "呀", "哈哈", "嗯嗯"],
--     "sentenceLength": "short",
--     "emojiUsage": "frequent",
--     "tone": "温柔"
--   }'::jsonb,
--   75,
--   12
-- );

-- ============================================
-- 完成
-- ============================================