import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase';
import type { QuickReplyRequest, QuickReplyResponse } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body: QuickReplyRequest = await request.json();
    const { theirMessage, context, relationshipId } = body;

    if (!theirMessage) {
      return NextResponse.json(
        { error: '缺少对方的消息' },
        { status: 400 }
      );
    }

    // 快速模式：通用建议
    const prompt = `
你是一个专业的沟通教练，帮助用户快速回复消息。

对方说：“${theirMessage}”
${context ? `背景：${context}` : ''}

请提供 3 个回复建议。

任务：
1. 分析对方的情绪和意图
2. 给出 3 个不同风格的回复选项
3. 每个选项要实用、自然、可直接复制使用

输出 JSON 格式：
{
  "analysis": {
    "emotion": "对方当前情绪",
    "intention": "对方的意图",
    "context": "对这次沟通的理解"
  },
  "suggestedStrategy": {
    "name": "推荐策略名称",
    "type": "active|passive|neutral",
    "reason": "为什么用这个策略",
    "fitsRelationship": false
  },
  "replies": [
    {
      "id": "1",
      "content": "具体回复内容（20-50字）",
      "strategy": "这个回复用的策略",
      "strategyType": "active|passive|neutral",
      "explanation": "这个回复的作用",
      "whyThis": "为什么这样说",
      "riskLevel": "low|medium|high",
      "riskReason": "可能的风险",
      "prediction": {
        "scenario1": {"probability": 70, "response": "对方可能说..."},
        "scenario2": {"probability": 20, "response": "对方可能说..."},
        "scenario3": {"probability": 10, "response": "对方可能说..."}
      },
      "fitsGoal": false,
      "fitsPersona": false
    }
  ],
  "recommendedReplyId": "1"
}

要求：
- 回复要实用、自然
- 3 个选项要有明显差异（积极/中立/委婉）
- 标注清楚风险
- 预测要具体
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: '你是专业的沟通教练，擅长快速给出实用的回复建议。',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = completion.choices[0].message.content;
    if (!result) {
      throw new Error('AI 返回为空');
    }

    const response: QuickReplyResponse = JSON.parse(result);
    return NextResponse.json(response);

  } catch (error: any) {
    console.error('快速回复 API 错误:', error);
    return NextResponse.json(
      { error: '生成建议失败，请重试', details: error.message },
      { status: 500 }
    );
  }
}
