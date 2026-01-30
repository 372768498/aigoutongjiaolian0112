import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, requireSupabase } from "@/lib/supabase";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/conversations/[id]/feedback
 * 更新对话反馈
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const unavailable = requireSupabase();
    if (unavailable) return unavailable;

    const { id } = await context.params;
    const body = await request.json();

    const { usedReplyId, effectiveness, feedbackNote } = body;

    const { data, error } = await supabaseAdmin()!
      .from("conversations")
      .update({
        used_reply_id: usedReplyId,
        effectiveness,
        feedback_note: feedbackNote,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ conversation: data });
  } catch (error: any) {
    console.error("[更新反馈错误]:", error);
    return NextResponse.json(
      { error: "更新失败", details: error.message },
      { status: 500 }
    );
  }
}
