import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/relationships/[id]
 * 获取单个关系详情
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const userId = request.headers.get("x-user-id") || "test-user-001";

    const { data, error } = await supabaseAdmin()
      .from("relationships")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "关系不存在" },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ relationship: data });
  } catch (error: any) {
    console.error("[获取关系详情错误]:", error);
    return NextResponse.json(
      { error: "获取失败", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/relationships/[id]
 * 更新关系
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const userId = request.headers.get("x-user-id") || "test-user-001";
    const body = await request.json();

    const { data, error } = await supabaseAdmin()
      .from("relationships")
      .update(body)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ relationship: data });
  } catch (error: any) {
    console.error("[更新关系错误]:", error);
    return NextResponse.json(
      { error: "更新失败", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/relationships/[id]
 * 删除关系
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const userId = request.headers.get("x-user-id") || "test-user-001";

    const { error } = await supabaseAdmin()
      .from("relationships")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[删除关系错误]:", error);
    return NextResponse.json(
      { error: "删除失败", details: error.message },
      { status: 500 }
    );
  }
}