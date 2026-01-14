import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { generateSmartPrompt, ConversationContext } from "@/lib/smart-prompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { theirMessage, context: background, userProfile, successfulPatterns, failedPatterns } = body;

    if (!theirMessage) {
      return NextResponse.json(
        { error: "请提供对方的消息" },
        { status: 400 }
      );
    }

    // 构建上下文
    const conversationContext: ConversationContext = {
      theirMessage,
      background,
      userProfile,
      successfulPatterns,
      failedPatterns
    };

    // 生成智能 Prompt
    const smartPrompt = generateSmartPrompt(conversationContext);

    console.log('[Smart Prompt] Generated:', smartPrompt.substring(0, 200) + '...');

    // 调用 OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: smartPrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("未获得有效响应");
    }

    // 解析 JSON 响应
    const result = JSON.parse(responseContent);

    console.log('[Smart Reply] Generated:', {
      hasProfile: !!userProfile,
      hasHistory: !!(successfulPatterns?.length || failedPatterns?.length),
      repliesCount: result.replies?.length
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Quick Reply Smart Error]:", error);
    return NextResponse.json(
      { 
        error: "生成建议失败",
        details: error instanceof Error ? error.message : "未知错误"
      },
      { status: 500 }
    );
  }
}