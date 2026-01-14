import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

// 缓存的 admin 客户端实例
let _supabaseAdminInstance: SupabaseClient | null = null;

// 服务端客户端（API routes 使用）- 导出 getter 函数
export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdminInstance) {
    return _supabaseAdminInstance;
  }
  
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }
  
  _supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  return _supabaseAdminInstance;
}

// 为了向后兼容，导出一个同名的 getter
// 使用时: const admin = supabaseAdmin();
export const supabaseAdmin = getSupabaseAdmin;

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
