// ==========================================
// AI 沟通教练 - TypeScript 类型定义
// v2.0 - 场景决策引擎
// ==========================================

// 关系类型
export type RelationshipType = 
  | 'romantic'
  | 'dating'
  | 'workplace_boss'
  | 'workplace_colleague'
  | 'family'
  | 'friend';

// 效果类型
export type Effect = 'success' | 'neutral' | 'failure' | 'unknown';

// 风险等级
export type RiskLevel = 'low' | 'medium' | 'high';

// 策略类型
export type StrategyType = 'conservative' | 'moderate' | 'bold';

// ==========================================
// 快速回复 v2.0
// ==========================================
export interface QuickReplyRequest {
  theirMessage: string;
  context?: string;
  relationshipId?: string;
}

export interface SceneAnalysis {
  matchedScenario?: string;
  relationshipType?: string;
  scenarioType?: string;
  urgency?: string;
}

export interface SafetyAnalysis {
  bestCase: string;
  worstCase: string;
  ifWorstHappens: string;
}

export interface NextPossibleResponse {
  theirResponse: string;
  meaning: string;
  yourReply: string;
}

export interface RecommendedReply {
  id: string;
  content: string;
  strategy: string;
  strategyType: StrategyType;
  whyThis: string;
  riskLevel: RiskLevel;
  safetyAnalysis: SafetyAnalysis;
  nextPossible: NextPossibleResponse[];
}

export interface AlternativeReply {
  id: string;
  content: string;
  strategy: string;
  strategyType: StrategyType;
  whyThis: string;
  riskLevel: RiskLevel;
}

export interface AvoidSaying {
  content: string;
  reason: string;
}

export interface QuickReplyResponse {
  sceneAnalysis?: SceneAnalysis;
  analysis?: {
    subtext?: string;
    emotion?: string;
    risk?: string;
  };
  recommendedReply: RecommendedReply;
  alternativeReplies?: AlternativeReply[];
  avoidSaying?: AvoidSaying[];
  tips?: string;
  
  // 为了兼容旧版本
  replies?: any[];
  recommendedReplyId?: string;
}

// ==========================================
// 截图分析
// ==========================================
export interface ScreenshotAnalysisRequest {
  imageBase64: string;
  userId?: string;
}

export interface ExtractedMessage {
  speaker: 'user' | 'other';
  content: string;
}

export interface ExtractedConversation {
  messages: ExtractedMessage[];
  context?: string;
}

export interface PersonStyle {
  communicationStyle?: 'concise' | 'detailed' | 'emotional' | 'casual' | 'formal';
  characteristics?: string[];
  notes?: string;
}

export interface ScreenshotAnalysisResponse {
  id: string;
  extractedConversation: ExtractedConversation;
  relationshipGuess: string;
  personStyle: PersonStyle;
  confidence: number;
}
