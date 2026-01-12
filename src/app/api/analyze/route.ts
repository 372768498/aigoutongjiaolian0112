import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `你是一位专业的人际沟通教练和心理分析师。用户会上传聊天截图，你需要：

1. **情绪诊断**：分析双方的情绪状态（如焦虑、愤怒、回避、冷漠、受伤、防御等）
2. **问题识别**：找出沟通中的核心问题（如指责性表达、冷暴力、需求未被看见、边界问题等）
3. **策略推荐**：提供3个差异化的沟通策略，每个包含：
   - 策略名称
   - 适用场景
   - 成功率评估（1-5星）
   - 风险提示
4. **话术指导**：为推荐的策略提供具体的话术模板

请用JSON格式返回分析结果，格式如下：
{
  "emotions": {
    "user": { "primary": "情绪", "secondary": "次要情绪", "intensity": 1-10 },
    "other": { "primary": "情绪", "secondary": "次要情绪", "intensity": 1-10 }
  },
  "problems": [
    { "type": "问题类型", "description": "具体描述", "severity": "high/medium/low" }
  ],
  "strategies": [
    {
      "name": "策略名称",
      "description": "策略描述",
      "scenario": "适用场景",
      "rating": 1-5,
      "risks": "风险提示",
      "scripts": [
        { "step": 1, "content": "第一句话", "explanation": "为什么这样说" },
        { "step": 2, "content": "第二句话", "explanation": "为什么这样说" }
      ]
    }
  ],
  "summary": "整体情况总结和建议"
}`;

export async function POST(request: NextRequest) {
  try {
    const { images, context } = await request.json();

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "请上传至少一张聊天截图" },
        { status: 400 }
      );
    }

    // 构建消息内容
    const contentParts: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];
    
    // 添加用户提供的背景信息
    if (context) {
      contentParts.push({
        type: "text",
        text: `背景信息：${context}`,
      });
    }

    contentParts.push({
      type: "text",
      text: "请分析以下聊天截图中的沟通问题：",
    });

    // 添加图片
    for (const image of images) {
      contentParts.push({
        type: "image_url",
        image_url: {
          url: `data:image/jpeg;base64,${image}`,
        },
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: contentParts,
        },
      ],
      max_tokens: 4000,
    });

    const text = response.choices[0]?.message?.content || "";

    // 解析 JSON 结果
    let result;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = { summary: text, strategies: [], problems: [], emotions: {} };
      }
    } catch {
      result = { summary: text, strategies: [], problems: [], emotions: {} };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "分析失败，请稍后重试" },
      { status: 500 }
    );
  }
}
