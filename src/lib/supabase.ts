import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isConfigured = !!(supabaseUrl && supabaseAnonKey);

// 客户端使用的 Supabase 客户端（带 RLS）
export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// 服务端使用的 Supabase 客户端（绕过 RLS）
export const supabaseAdmin = (): SupabaseClient | null => {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// 辅助函数：检查 Supabase 是否可用，不可用则返回 503 响应
export function requireSupabase() {
  if (!isConfigured) {
    return new Response(
      JSON.stringify({ error: 'Supabase 未配置，数据库功能暂不可用' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return null;
}
