import { createClient } from '@supabase/supabase-js';

// ==========================================
// Supabase 客户端配置
// ==========================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// 客户端（浏览器端使用）
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 服务端客户端（API routes 使用）
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

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
      };
    };
  };
};
