// 对象/联系人类型
export interface Contact {
  id: string;
  name: string;
  avatar: string;  // emoji 或图片URL
  relationshipType: 'romance' | 'work' | 'family' | 'friend' | 'other';
  relationshipStage: string;  // 如：暧昧期、热恋期、冷战期 等
  traits?: string;  // TA的特点
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: string;
  messageCount: number;
}

// Agent类型
export type AgentType = 'analyzer' | 'warm' | 'humor' | 'cool' | 'direct';

export interface Agent {
  id: AgentType;
  name: string;        // 职位名称
  nickname: string;    // 性格昵称
  emoji: string;
  description: string;
  color: string;       // 主题色
}

// 消息类型
export interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  
  // 用户消息特有
  images?: string[];   // base64图片
  mentionedAgent?: AgentType;  // @的Agent
  
  // Agent消息特有
  agentId?: AgentType;
  scripts?: Script[];  // 话术建议
  analysis?: SceneAnalysis;  // 场景分析（仅analyzer）
  successRate?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  isRecommended?: boolean;
  reasoning?: string;  // 为什么这样建议
}

// 话术脚本
export interface Script {
  content: string;
  explanation?: string;
}

// 场景分析
export interface SceneAnalysis {
  category: string;
  subCategory: string;
  otherEmotion: {
    primary: string;
    intensity: number;
  };
  deepNeed: string;
  urgency: number;
  taboos: string[];
  advice: string;
}

// 对话
export interface Conversation {
  id: string;
  contactId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// 用户偏好
export interface UserPreference {
  contactId: string;
  styleChoices: {
    style: AgentType;
    timestamp: Date;
    feedback?: 'effective' | 'ineffective' | 'unknown';
  }[];
  preferredStyle?: AgentType;
}

// API请求/响应类型
export interface ChatRequest {
  contactId: string;
  message: string;
  images?: string[];
  mentionedAgent?: AgentType;
  context?: {
    contact: Contact;
    recentMessages: Message[];
  };
}

export interface ChatResponse {
  messages: Message[];
}

// 关系类型选项
export const RELATIONSHIP_TYPES = {
  romance: {
    label: '恋爱',
    emoji: '💕',
    stages: ['暧昧期', '热恋期', '稳定期', '冷战期', '分手边缘']
  },
  work: {
    label: '职场',
    emoji: '💼',
    stages: ['上级', '同级', '下属', '客户', '合作伙伴']
  },
  family: {
    label: '家庭',
    emoji: '👨‍👩‍👧',
    stages: ['父母', '子女', '配偶', '兄弟姐妹', '其他亲戚']
  },
  friend: {
    label: '朋友',
    emoji: '👫',
    stages: ['闺蜜/死党', '普通朋友', '新朋友', '前任朋友']
  },
  other: {
    label: '其他',
    emoji: '👤',
    stages: ['陌生人', '网友', '其他']
  }
} as const;

// Agent定义
export const AGENTS: Record<AgentType, Agent> = {
  analyzer: {
    id: 'analyzer',
    name: '场景分析师',
    nickname: '侦探',
    emoji: '🎯',
    description: '分析场景、识别风险、设定边界',
    color: '#6366f1'  // indigo
  },
  warm: {
    id: 'warm',
    name: '温柔派顾问',
    nickname: '温柔姐姐',
    emoji: '🤗',
    description: '共情理解、情绪安抚',
    color: '#ec4899'  // pink
  },
  humor: {
    id: 'humor',
    name: '幽默派顾问',
    nickname: '段子手',
    emoji: '😄',
    description: '轻松化解、破冰打趣',
    color: '#f59e0b'  // amber
  },
  cool: {
    id: 'cool',
    name: '高冷派顾问',
    nickname: '冷静分析师',
    emoji: '😎',
    description: '保持距离、欲擒故纵',
    color: '#06b6d4'  // cyan
  },
  direct: {
    id: 'direct',
    name: '直球派顾问',
    nickname: '真诚战士',
    emoji: '💪',
    description: '坦诚直接、真诚表达',
    color: '#22c55e'  // green
  }
};
