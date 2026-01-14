import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase';
import type { ScreenshotAnalysisRequest, ScreenshotAnalysisResponse } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body: ScreenshotAnalysisRequest = await request.json();
    const { imageBase64, userId } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: '缺少截图' },
        { status: 400 }
      );
    }

    // 使用 GPT-4 Vision 分析截图
    const analysisPrompt = `
你是一个专业的沟通分析助手。请分析这张聊天截图。

任务：
1. 提取对话内容（最近 3-5 条消息）
2. 推测这是什么关系类型
3. 分析对方的沟通风格

请以 JSON 格式输出：
{
  "extractedConversation": {
    "messages": [
      {"speaker": "user", "content": "用户说的话"},
      {"speaker": "other", "content": "对方说的话"}
    ],
    "context": "对话的背景或主题"
  },
  "relationshipGuess": "romantic|workplace_boss|workplace_colleague|family|friend|unknown",
  "personStyle": {
    "communicationStyle": "concise|detailed|emotional|casual|formal",
    "characteristics": ["特征1", "特征2"],
    "notes": "补充说明"
  },
  "confidence": 0.0-1.0,
  "reasoning": "为什么这样判断"
}

注意：
- 准确识别 OCR 文字
- 区分谁是用户、谁是对方
- 注意语气、用词、表情符号
- 推测时要有依据
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: analysisPrompt },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64,
                detail: 'high',
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1500,
      temperature: 0.3,
    });

    const result = completion.choices[0].message.content;
    if (!result) {
      throw new Error('AI 分析返回为空');
    }

    const analysis = JSON.parse(result);

    // 保存到数据库
    let savedAnalysisId: string | null = null;

    if (userId) {
      const { data: savedAnalysis, error: saveError } = await supabaseAdmin
        .from('screenshot_analysis')
        .insert({
          user_id: userId,
          image_url: null,
          extracted_conversation: analysis.extractedConversation,
          relationship_guess: analysis.relationshipGuess,
          person_style: analysis.personStyle,
          user_confirmed: false,
        })
        .select()
        .single();

      if (saveError) {
        console.error('保存截图分析失败:', saveError);
      } else {
        savedAnalysisId = savedAnalysis.id;
      }
    }

    const response: ScreenshotAnalysisResponse = {
      id: savedAnalysisId || `temp-${Date.now()}`,
      extractedConversation: analysis.extractedConversation,
      relationshipGuess: analysis.relationshipGuess || 'unknown',
      personStyle: analysis.personStyle || {},
      confidence: analysis.confidence || 0.7,
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('截图分析 API 错误:', error);
    return NextResponse.json(
      { error: '分析失败，请重试', details: error.message },
      { status: 500 }
    );
  }
}
