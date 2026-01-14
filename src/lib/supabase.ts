import { createClient } from '@supabase/supabase-js';

// ==========================================
// Supabase 客户端配置
// ==========================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// 客户端（浏览器端使用）
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// 服务端客户端（API routes 使用）- 使用函数确保运行时检查
export function getSupabaseAdmin() {
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// 为了兼容旧代码，导出一个懒初始化的实例
let _supabaseAdminInstance: ReturnType<typeof createClient> | null = null;

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_supabaseAdminInstance) {
      _supabaseAdminInstance = getSupabaseAdmin();
    }
    return (_supabaseAdminInstance as any)[prop];
  }
});

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
