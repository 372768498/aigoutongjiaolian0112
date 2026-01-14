-- ==========================================
-- AI 沟通教练 - 数据库 Schema
-- MVP 1.0 版本
-- ==========================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. 用户表
-- ==========================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_tier VARCHAR(50) DEFAULT 'free', -- 'free', 'premium'
  
  -- 索引
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ==========================================
-- 2. 截图分析记录表
-- ==========================================
CREATE TABLE screenshot_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- 截图信息
  image_url TEXT,
  
  -- AI 分析结果
  extracted_conversation JSONB, -- 提取的对话内容
  relationship_guess VARCHAR(50), -- 推测的关系类型
  person_style JSONB, -- 对方风格特征
  
  -- 用户确认
  user_confirmed BOOLEAN DEFAULT FALSE,
  user_corrections JSONB,
  
  -- 是否转为关系档案
  converted_to_relationship BOOLEAN DEFAULT FALSE,
  relationship_id UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 索引
  CONSTRAINT relationship_type_check CHECK (
    relationship_guess IN ('romantic', 'workplace_boss', 'workplace_colleague', 'family', 'friend', 'unknown')
  )
);

CREATE INDEX idx_screenshot_user_id ON screenshot_analysis(user_id);
CREATE INDEX idx_screenshot_created_at ON screenshot_analysis(created_at);
CREATE INDEX idx_screenshot_relationship_id ON screenshot_analysis(relationship_id);

-- ==========================================
-- 3. 关系档案表（核心！）
-- ==========================================
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- 基础信息
  person_name VARCHAR(100) NOT NULL, -- "男友"、"张总"
  relationship_type VARCHAR(50) NOT NULL, -- 'romantic', 'workplace_boss', etc.
  
  -- 目标和人设
  goal TEXT, -- "深化感情，推进到同居阶段"
  persona JSONB, -- ["独立", "温柔"]
  
  -- 背景信息（可选）
  duration VARCHAR(50), -- "1个月"
  current_stage VARCHAR(50), -- "热恋期"
  special_notes TEXT, -- "异地"、"有矛盾"等
  
  -- AI 学习的洞察
  auto_insights JSONB, -- AI 自动学习到的特征
  learning_progress INT DEFAULT 0, -- 学习进度 0-100
  
  -- 状态
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 索引和约束
  CONSTRAINT relationship_type_check CHECK (
    relationship_type IN ('romantic', 'workplace_boss', 'workplace_colleague', 'family', 'friend')
  ),
  CONSTRAINT learning_progress_check CHECK (learning_progress BETWEEN 0 AND 100)
);

CREATE INDEX idx_relationships_user_id ON relationships(user_id);
CREATE INDEX idx_relationships_type ON relationships(relationship_type);
CREATE INDEX idx_relationships_active ON relationships(is_active);
CREATE INDEX idx_relationships_updated_at ON relationships(updated_at);

-- ==========================================
-- 4. 对话历史表
-- ==========================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  relationship_id UUID REFERENCES relationships(id) ON DELETE CASCADE,
  
  -- 对话内容
  their_message TEXT NOT NULL, -- 对方说的话
  our_reply TEXT, -- 用户实际使用的回复
  context TEXT, -- 上下文（可选）
  
  -- AI 建议
  ai_suggestions JSONB, -- 当时 AI 给的建议
  used_suggestion_index INT, -- 用户使用了哪个建议（0,1,2，-1=自己写的）
  
  -- 策略信息
  suggested_strategy VARCHAR(100), -- AI 推荐的策略
  user_confirmed_strategy BOOLEAN, -- 用户是否确认策略
  
  -- 效果反馈
  effect VARCHAR(50), -- 'success', 'neutral', 'failure', 'unknown'
  their_response TEXT, -- 对方实际的回复（用户可选填）
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 约束
  CONSTRAINT effect_check CHECK (effect IN ('success', 'neutral', 'failure', 'unknown'))
);

CREATE INDEX idx_conversations_relationship_id ON conversations(relationship_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);
CREATE INDEX idx_conversations_effect ON conversations(effect);

-- ==========================================
-- 5. 策略库表（学习的关键！）
-- ==========================================
CREATE TABLE strategies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  relationship_id UUID REFERENCES relationships(id) ON DELETE CASCADE,
  
  -- 策略信息
  situation VARCHAR(200) NOT NULL, -- "对方说'随便'"
  strategy_name VARCHAR(100) NOT NULL, -- "撒娇式决策"
  strategy_content TEXT, -- 具体怎么做
  strategy_type VARCHAR(50), -- 策略类型分类
  
  -- 效果统计
  used_count INT DEFAULT 0,
  success_count INT DEFAULT 0,
  success_rate FLOAT DEFAULT 0.0,
  
  -- 状态
  is_recommended BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 约束
  CONSTRAINT success_rate_check CHECK (success_rate BETWEEN 0 AND 1),
  CONSTRAINT counts_check CHECK (success_count <= used_count)
);

CREATE INDEX idx_strategies_relationship_id ON strategies(relationship_id);
CREATE INDEX idx_strategies_success_rate ON strategies(success_rate DESC);
CREATE INDEX idx_strategies_is_recommended ON strategies(is_recommended);

-- ==========================================
-- 6. 效果反馈表
-- ==========================================
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  
  effect VARCHAR(50) NOT NULL,
  what_worked TEXT,
  what_to_avoid TEXT,
  user_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 约束
  CONSTRAINT feedback_effect_check CHECK (effect IN ('success', 'failure'))
);

CREATE INDEX idx_feedback_conversation_id ON feedback(conversation_id);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);

-- ==========================================
-- 触发器：自动更新 updated_at
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_relationships_updated_at BEFORE UPDATE ON relationships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strategies_updated_at BEFORE UPDATE ON strategies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 视图：关系概览
-- ==========================================
CREATE VIEW relationship_overview AS
SELECT 
  r.id,
  r.user_id,
  r.person_name,
  r.relationship_type,
  r.goal,
  r.learning_progress,
  COUNT(DISTINCT c.id) as conversation_count,
  COUNT(DISTINCT s.id) as strategy_count,
  AVG(s.success_rate) as avg_success_rate,
  MAX(c.created_at) as last_conversation_at,
  r.updated_at
FROM relationships r
LEFT JOIN conversations c ON r.id = c.relationship_id
LEFT JOIN strategies s ON r.id = s.relationship_id AND s.is_recommended = TRUE
GROUP BY r.id;

-- ==========================================
-- 示例数据（测试用）
-- ==========================================
-- 插入测试用户
-- INSERT INTO users (email, name) VALUES 
--   ('test@example.com', '测试用户');

-- ==========================================
-- RLS（Row Level Security）策略
-- ==========================================
-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- 用户只能看到自己的数据
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own screenshots" ON screenshot_analysis
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own relationships" ON relationships
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own conversations" ON conversations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM relationships 
      WHERE relationships.id = conversations.relationship_id 
      AND relationships.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own strategies" ON strategies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM relationships 
      WHERE relationships.id = strategies.relationship_id 
      AND relationships.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own feedback" ON feedback
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM conversations c
      JOIN relationships r ON c.relationship_id = r.id
      WHERE c.id = feedback.conversation_id 
      AND r.user_id = auth.uid()
    )
  );

-- ==========================================
-- 完成！
-- ==========================================
COMMENT ON TABLE users IS '用户表';
COMMENT ON TABLE screenshot_analysis IS '截图分析记录';
COMMENT ON TABLE relationships IS '关系档案表（核心）';
COMMENT ON TABLE conversations IS '对话历史表';
COMMENT ON TABLE strategies IS '策略库表';
COMMENT ON TABLE feedback IS '效果反馈表';
