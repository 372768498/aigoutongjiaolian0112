// ==========================================
// AI 沟通教练 - TypeScript 类型定义
// MVP 1.0 版本
// ==========================================

// 关系类型
export type RelationshipType = 
  | 'romantic'
  | 'workplace_boss'
  | 'workplace_colleague'
  | 'family'
  | 'friend';

// 效果类型
export type Effect = 'success' | 'neutral' | 'failure' | 'unknown';

// 风险等级
export type RiskLevel = 'low' | 'medium' | 'high';

// 订阅层级
export type SubscriptionTier = 'free' | 'premium';

// ==========================================
// 截图分析
// ==========================================
export interface ScreenshotAnalysisRequest {
  imageBase64: string;
  userId?: string;
}

export interface ExtractedConversation {
  messages: Array<{
    speaker: 'user' | 'other';
    content: string;
    timestamp?: string;
  }>;
  context?: string;
}

export interface ScreenshotAnalysisResponse {
  id: string;
  extractedConversation: ExtractedConversation;
  relationshipGuess: RelationshipType | 'unknown';
  personStyle: any;
  confidence: number;
}

// ==========================================
// 快速回复
// ==========================================
export interface QuickReplyRequest {
  theirMessage: string;
  context?: string;
  relationshipId?: string;
  screenshotAnalysisId?: string;
}

export interface Reply {
  id: string;
  content: string;
  strategy: string;
  strategyType: string;
  whyThis: string;
  riskLevel: RiskLevel;
}

export interface QuickReplyResponse {
  analysis?: {
    subtext?: string;
    emotion?: string;
    risk?: string;
  };
  replies: Reply[];
  recommendedReplyId: string;
  tips?: string;
}
