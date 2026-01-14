// ==========================================
// AI 沟通教练 - TypeScript 类型定义
// MVP 1.0 版本
// ==========================================

// ==========================================
// 关系类型
// ==========================================
export type RelationshipType = 
  | 'romantic'           // 恋爱关系
  | 'workplace_boss'     // 职场-上级
  | 'workplace_colleague' // 职场-同事
  | 'family'             // 家庭关系
  | 'friend';            // 朋友关系

// ==========================================
// 效果类型
// ==========================================
export type Effect = 'success' | 'neutral' | 'failure' | 'unknown';

// ==========================================
// 风险等级
// ==========================================
export type RiskLevel = 'low' | 'medium' | 'high';

// ==========================================
// 订阅层级
// ==========================================
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

export interface PersonStyle {
  communicationStyle?: string; // 'concise', 'detailed', 'emotional', etc.
  characteristics?: string[];
  notes?: string;
}

export interface ScreenshotAnalysisResponse {
  id: string;
  extractedConversation: ExtractedConversation;
  relationshipGuess: RelationshipType | 'unknown';
  personStyle: PersonStyle;
  confidence: number; // 0-1
}

// ==========================================
// 关系档案
// ==========================================
export interface Relationship {
  id: string;
  userId: string;
  personName: string;
  relationshipType: RelationshipType;
  goal?: string;
  persona?: string[];
  duration?: string;
  currentStage?: string;
  specialNotes?: string;
  autoInsights?: RelationshipInsights;
  learningProgress: number; // 0-100
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RelationshipInsights {
  personCharacteristics: string[];
  effectiveStrategies: string[];
  thingsToAvoid: string[];
  communicationPattern?: string;
  emotionalTrends?: string[];
}

export interface CreateRelationshipRequest {
  personName: string;
  relationshipType: RelationshipType;
  goal?: string;
  persona?: string[];
  duration?: string;
  currentStage?: string;
  specialNotes?: string;
  // 从截图分析预填充
  screenshotAnalysisId?: string;
}

// ==========================================
// AI 建议
// ==========================================
export interface QuickReplyRequest {
  theirMessage: string;
  context?: string;
  relationshipId?: string; // 如果有关系档案
  screenshotAnalysisId?: string; // 如果是从截图来的
}

export interface Reply {
  id: string;
  content: string;
  strategy: string;
  strategyType: string;
  explanation: string;
  whyThis: string;
  riskLevel: RiskLevel;
  riskReason?: string;
  prediction: {
    scenario1: { probability: number; response: string };
    scenario2: { probability: number; response: string };
    scenario3: { probability: number; response: string };
  };
  fitsGoal: boolean;
  fitsPersona: boolean;
}

export interface QuickReplyResponse {
  analysis: {
    emotion: string;
    intention: string;
    context: string;
  };
  suggestedStrategy: {
    name: string;
    type: string;
    reason: string;
    fitsRelationship: boolean;
  };
  replies: Reply[];
  recommendedReplyId: string;
}

// ==========================================
// 精准建议（基于关系档案）
// ==========================================
export interface PreciseReplyRequest extends QuickReplyRequest {
  relationshipId: string; // 必须有关系档案
}

export interface PreciseReplyResponse extends QuickReplyResponse {
  relationshipContext: {
    conversationCount: number;
    lastConversationAt: string;
    recentSuccessfulStrategies: string[];
    learningProgress: number;
  };
  continuityNote?: string; // 如"延续上次成功的策略"
}

// ==========================================
// 对话历史
// ==========================================
export interface Conversation {
  id: string;
  relationshipId: string;
  theirMessage: string;
  ourReply?: string;
  context?: string;
  aiSuggestions: QuickReplyResponse;
  usedSuggestionIndex?: number; // 0,1,2, -1表示自己写的
  suggestedStrategy?: string;
  userConfirmedStrategy?: boolean;
  effect?: Effect;
  theirResponse?: string;
  createdAt: string;
}

export interface SaveConversationRequest {
  relationshipId: string;
  theirMessage: string;
  ourReply: string;
  aiSuggestions: QuickReplyResponse;
  usedSuggestionIndex?: number;
  context?: string;
}

// ==========================================
// 策略
// ==========================================
export interface Strategy {
  id: string;
  relationshipId: string;
  situation: string;
  strategyName: string;
  strategyContent?: string;
  strategyType?: string;
  usedCount: number;
  successCount: number;
  successRate: number; // 0-1
  isRecommended: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 效果反馈
// ==========================================
export interface FeedbackRequest {
  conversationId: string;
  effect: 'success' | 'failure';
  whatWorked?: string;
  whatToAvoid?: string;
  userNotes?: string;
}

// ==========================================
// 统计数据
// ==========================================
export interface RelationshipStats {
  totalConversations: number;
  successfulConversations: number;
  successRate: number;
  mostUsedStrategies: Array<{
    name: string;
    count: number;
    successRate: number;
  }>;
  learningProgress: number;
  lastUpdated: string;
}

// ==========================================
// API 响应
// ==========================================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// ==========================================
// 前端状态
// ==========================================
export interface AppState {
  user: {
    id: string;
    email: string;
    name?: string;
    subscriptionTier: SubscriptionTier;
  } | null;
  currentRelationship: Relationship | null;
  relationships: Relationship[];
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
}

// ==========================================
// 组件 Props
// ==========================================
export interface ScreenshotUploadProps {
  onAnalysisComplete: (analysis: ScreenshotAnalysisResponse) => void;
  onError: (error: string) => void;
}

export interface RelationshipFormProps {
  initialData?: Partial<CreateRelationshipRequest>;
  screenshotAnalysis?: ScreenshotAnalysisResponse;
  onSubmit: (data: CreateRelationshipRequest) => Promise<void>;
  onCancel?: () => void;
}

export interface ReplyCardProps {
  reply: Reply;
  isRecommended: boolean;
  onCopy: (content: string) => void;
  onUse: (replyId: string) => void;
}

export interface ConversationHistoryProps {
  relationshipId: string;
  conversations: Conversation[];
  onFeedback: (conversationId: string, effect: Effect) => void;
}

// ==========================================
// Utility Types
// ==========================================
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
