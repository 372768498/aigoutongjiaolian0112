import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/relationships
 * 获取用户的所有关系
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: 从 session 获取 user_id
    // 目前使用测试 user_id
    const userId = request.headers.get("x-user-id") || "test-user-001";

    const { data, error } = await supabaseAdmin()
      .from("relationships")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ relationships: data });
  } catch (error: any) {
    console.error("[获取关系列表错误]:", error);
    return NextResponse.json(
      { error: "获取失败", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/relationships
 * 创建新关系
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") || "test-user-001";
    const body = await request.json();

    const {
      personName,
      relationshipType,
      emoji,
      goal,
      desiredPersona,
      communicationStyle,
    } = body;

    if (!personName || !relationshipType) {
      return NextResponse.json(
        { error: "缺少必填字段" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin()
      .from("relationships")
      .insert({
        user_id: userId,
        person_name: personName,
        relationship_type: relationshipType,
        emoji: emoji || "💬",
        goal,
        desired_persona: desiredPersona || [],
        communication_style: communicationStyle || {},
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ relationship: data });
  } catch (error: any) {
    console.error("[创建关系错误]:", error);
    return NextResponse.json(
      { error: "创建失败", details: error.message },
      { status: 500 }
    );
  }
}