import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, requireSupabase } from "@/lib/supabase";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/relationships/[id]/conversations
 * 获取关系的对话历史
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const unavailable = requireSupabase();
    if (unavailable) return unavailable;

    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const { data, error, count } = await supabaseAdmin()!
      .from("conversations")
      .select("*", { count: "exact" })
      .eq("relationship_id", id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      conversations: data,
      total: count,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("[获取对话历史错误]:", error);
    return NextResponse.json(
      { error: "获取失败", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/relationships/[id]/conversations
 * 创建新对话
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const unavailable = requireSupabase();
    if (unavailable) return unavailable;

    const { id } = await context.params;
    const body = await request.json();

    const {
      theirMessage,
      context: conversationContext,
      replies,
      usedReplyId,
      effectiveness,
      feedbackNote,
    } = body;

    if (!theirMessage || !replies) {
      return NextResponse.json(
        { error: "缺少必填字段" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin()!
      .from("conversations")
      .insert({
        relationship_id: id,
        their_message: theirMessage,
        context: conversationContext,
        replies: replies,
        used_reply_id: usedReplyId,
        effectiveness: effectiveness,
        feedback_note: feedbackNote,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ conversation: data });
  } catch (error: any) {
    console.error("[创建对话错误]:", error);
    return NextResponse.json(
      { error: "创建失败", details: error.message },
      { status: 500 }
    );
  }
}
