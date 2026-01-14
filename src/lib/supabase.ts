import { createClient } from '@supabase/supabase-js';

// ==========================================
// Supabase 客户端配置
// ==========================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 构建时允许为空，运行时在 API 中检查
function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// 导出懒加载的客户端
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// 导出函数而不是直接创建客户端（运行时检查）
export const supabaseAdmin = supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// 确保在使用前环境变量存在
export function ensureSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
}

// ==========================================
// 类型定义
// ==========================================
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
          updated_at: string;
          subscription_tier: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
          subscription_tier?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
          subscription_tier?: string;
        };
      };
      screenshot_analysis: {
        Row: {
          id: string;
          user_id: string;
          image_url: string | null;
          extracted_conversation: any;
          relationship_guess: string | null;
          person_style: any;
          user_confirmed: boolean;
          user_corrections: any;
          converted_to_relationship: boolean;
          relationship_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url?: string | null;
          extracted_conversation?: any;
          relationship_guess?: string | null;
          person_style?: any;
          user_confirmed?: boolean;
          user_corrections?: any;
          converted_to_relationship?: boolean;
          relationship_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_url?: string | null;
          extracted_conversation?: any;
          relationship_guess?: string | null;
          person_style?: any;
          user_confirmed?: boolean;
          user_corrections?: any;
          converted_to_relationship?: boolean;
          relationship_id?: string | null;
          created_at?: string;
        };
      };
      relationships: {
        Row: {
          id: string;
          user_id: string;
          person_name: string;
          relationship_type: string;
          goal: string | null;
          persona: any;
          duration: string | null;
          current_stage: string | null;
          special_notes: string | null;
          auto_insights: any;
          learning_progress: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          person_name: string;
          relationship_type: string;
          goal?: string | null;
          persona?: any;
          duration?: string | null;
          current_stage?: string | null;
          special_notes?: string | null;
          auto_insights?: any;
          learning_progress?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          person_name?: string;
          relationship_type?: string;
          goal?: string | null;
          persona?: any;
          duration?: string | null;
          current_stage?: string | null;
          special_notes?: string | null;
          auto_insights?: any;
          learning_progress?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          relationship_id: string;
          their_message: string;
          our_reply: string | null;
          context: string | null;
          ai_suggestions: any;
          used_suggestion_index: number | null;
          suggested_strategy: string | null;
          user_confirmed_strategy: boolean | null;
          effect: string | null;
          their_response: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          relationship_id: string;
          their_message: string;
          our_reply?: string | null;
          context?: string | null;
          ai_suggestions?: any;
          used_suggestion_index?: number | null;
          suggested_strategy?: string | null;
          user_confirmed_strategy?: boolean | null;
          effect?: string | null;
          their_response?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          relationship_id?: string;
          their_message?: string;
          our_reply?: string | null;
          context?: string | null;
          ai_suggestions?: any;
          used_suggestion_index?: number | null;
          suggested_strategy?: string | null;
          user_confirmed_strategy?: boolean | null;
          effect?: string | null;
          their_response?: string | null;
          created_at?: string;
        };
      };
      strategies: {
        Row: {
          id: string;
          relationship_id: string;
          situation: string;
          strategy_name: string;
          strategy_content: string | null;
          strategy_type: string | null;
          used_count: number;
          success_count: number;
          success_rate: number;
          is_recommended: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          relationship_id: string;
          situation: string;
          strategy_name: string;
          strategy_content?: string | null;
          strategy_type?: string | null;
          used_count?: number;
          success_count?: number;
          success_rate?: number;
          is_recommended?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          relationship_id?: string;
          situation?: string;
          strategy_name?: string;
          strategy_content?: string | null;
          strategy_type?: string | null;
          used_count?: number;
          success_count?: number;
          success_rate?: number;
          is_recommended?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      feedback: {
        Row: {
          id: string;
          conversation_id: string;
          effect: string;
          what_worked: string | null;
          what_to_avoid: string | null;
          user_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          effect: string;
          what_worked?: string | null;
          what_to_avoid?: string | null;
          user_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          effect?: string;
          what_worked?: string | null;
          what_to_avoid?: string | null;
          user_notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
