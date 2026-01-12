import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface QuickReply {
  id: string;
  type: "caring" | "companionship" | "topic_change" | "apology" | "humor" | "question";
  content: string;
  explanation: string;
  suitable_for: string;
  risk_level: "safe" | "medium" | "risky";
}

export interface QuickReplyResponse {
  replies: QuickReply[];
  recommended: string;
  context_analysis: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { latest_message, scene_type, context } = body;

    if (!latest_message) {
      return NextResponse.json(
        { error: "缺少对方最新消息" },
        { status: 400 }
      );
    }

    // 根据场景定制 Prompt
    const sceneContext = getSceneContext(scene_type);

    // 构建 Prompt
    const prompt = `你是专业的沟通教练，用户收到了对方的消息，不知道怎么回复。

${sceneContext}

${context ? `背景信息：${context}` : ""}

对方最新消息："${latest_message}"

请提供 3-5 个可以直接回复的选项，每个选项要包含：
1. 回复类型（caring/companionship/topic_change/apology/humor/question）
2. 具体回复内容（可以直接复制使用，20-50字）
3. 为什么这样回复（简短说明，15字以内）
4. 适用场景（10字以内）
5. 风险等级（safe/medium/risky）

请以 JSON 格式返回，格式如下：
{
  "replies": [
    {
      "id": "1",
      "type": "caring",
      "content": "具体的回复内容",
      "explanation": "为什么这样回复",
      "suitable_for": "适用于什么情况",
      "risk_level": "safe"
    }
  ],
  "recommended": "推荐的 reply id",
  "context_analysis": "对当前情况的分析（一句话，20字以内）"
}

要求：
- 回复内容要自然、真实、可直接使用
- 不同选项要有明显差异（风格、策略不同）
- 标注清楚风险等级
- 推荐最稳妥、最合适的选项
- 回复内容不要太长，20-50字为宜`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "你是专业的沟通教练，帮助用户找到合适的回复方式。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = completion.choices[0].message.content;
    if (!result) {
      throw new Error("AI 返回结果为空");
    }

    const quickReplyResponse: QuickReplyResponse = JSON.parse(result);

    return NextResponse.json(quickReplyResponse);
  } catch (error) {
    console.error("Quick Reply API Error:", error);
    return NextResponse.json(
      { error: "生成回复建议失败，请重试" },
      { status: 500 }
    );
  }
}

// 根据场景获取上下文
function getSceneContext(sceneType?: string): string {
  const contexts: Record<string, string> = {
    long_distance: `场景：异地恋
特点：需要通过文字营造陪伴感，表达思念但不能过于粘人，注意时差和沟通频率。`,
    
    dating: `场景：相亲/约会
特点：关系初期，需要展示真诚和兴趣，避免过度热情或冷淡，适度推进关系。`,
    
    relationship: `场景：恋爱关系
特点：稳定关系，注重真诚表达，维护新鲜感，处理日常小矛盾。`,
    
    friendship: `场景：朋友关系
特点：保持边界，真诚坦率，提供支持但不过度介入。`,
    
    workplace: `场景：职场沟通
特点：专业、清晰、简洁，注意层级关系，就事论事。`,
    
    family: `场景：家庭沟通
特点：表达关心而不控制，理解代际差异，温和而坚定。`,
  };

  return contexts[sceneType || ""] || "场景：通用沟通";
}
