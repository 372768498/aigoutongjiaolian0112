import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase';
import type { 
  QuickReplyRequest, 
  QuickReplyResponse,
  PreciseReplyRequest,
  PreciseReplyResponse,
  Relationship,
  Strategy
} from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body: QuickReplyRequest | PreciseReplyRequest = await request.json();
    const { theirMessage, context, relationshipId } = body;

    if (!theirMessage) {
      return NextResponse.json(
        { error: '缺少对方的消息' },
        { status: 400 }
      );
    }

    // ==========================================
    // 判断是快速模式还是精准模式
    // ==========================================
    if (relationshipId) {
      // 精准模式：有关系档案
      return handlePreciseReply(body as PreciseReplyRequest);
    } else {
      // 快速模式：无关系档案
      return handleQuickReply(body as QuickReplyRequest);
    }

  } catch (error: any) {
    console.error('快速回复 API 错误:', error);
    
    return NextResponse.json(
      { error: '生成建议失败，请重试', details: error.message },
      { status: 500 }
    );
  }
}

// ==========================================
// 快速模式：通用建议（60-70分质量）
// ==========================================
async function handleQuickReply(request: QuickReplyRequest): Promise<Response> {
  const { theirMessage, context } = request;

  const prompt = `
你是一个专业的沟通教练，帮助用户快速回复消息。

对方说："${theirMessage}"
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
      {
        role: 'user',
        content: prompt,
      },
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
}

// ==========================================
// 精准模式：基于关系档案（85-95分质量）
// ==========================================
async function handlePreciseReply(request: PreciseReplyRequest): Promise<Response> {
  const { theirMessage, context, relationshipId } = request;

  // 1. 获取关系档案
  const { data: relationship, error: relError } = await supabaseAdmin
    .from('relationships')
    .select('*')
    .eq('id', relationshipId)
    .single();

  if (relError || !relationship) {
    throw new Error('关系档案不存在');
  }

  // 2. 获取最近的对话历史（最近5次）
  const { data: recentConversations } = await supabaseAdmin
    .from('conversations')
    .select('*')
    .eq('relationship_id', relationshipId)
    .order('created_at', { ascending: false })
    .limit(5);

  // 3. 获取有效的策略
  const { data: successfulStrategies } = await supabaseAdmin
    .from('strategies')
    .select('*')
    .eq('relationship_id', relationshipId)
    .eq('is_recommended', true)
    .gte('success_rate', 0.7)
    .order('success_rate', { ascending: false })
    .limit(5);

  // 4. 构建超详细的 Prompt
  const prompt = `
你是一个专业的沟通教练，正在指导你的学员。

【学员的关系档案】
- 对方：${relationship.person_name}
- 关系类型：${relationship.relationship_type}
- 目标：${relationship.goal || '未设定'}
- 期望人设：${relationship.persona?.join('、') || '未设定'}
- 认识时间：${relationship.duration || '未知'}
- 当前阶段：${relationship.current_stage || '未知'}
- 特殊说明：${relationship.special_notes || '无'}

【AI 学到的洞察】
${relationship.auto_insights ? JSON.stringify(relationship.auto_insights, null, 2) : '还在学习中...'}

【最近的对话历史】
${recentConversations?.map((c, i) => 
  \`\${i+1}. 对方说："\${c.their_message}" | 学员回："\${c.our_reply || '未回复'}" | 效果：\${c.effect || '未知'}\`
).join('\\n') || '暂无历史对话'}

【有效的策略】
${successfulStrategies?.map((s) => 
  \`- \${s.strategy_name}（成功率：\${(s.success_rate * 100).toFixed(0)}%）：\${s.strategy_content || ''}\`
).join('\\n') || '还在积累经验...'}

【当前情况】
对方刚说："${theirMessage}"
${context ? `背景：${context}` : ''}

【任务】
基于以上所有信息，给出 3 个精准的回复建议。

要求：
1. **必须符合**学员的目标（${relationship.goal}）
2. **必须符合**学员的人设（${relationship.persona?.join('、')}）
3. **必须考虑**历史经验（什么有效、什么无效）
4. **必须延续**成功的策略（如果有）
5. **必须评估**风险
6. **必须预测**对方反应

输出 JSON 格式：
{
  "analysis": {
    "emotion": "对方当前情绪",
    "intention": "对方的意图",
    "context": "结合历史，这次情况的特殊性"
  },
  "suggestedStrategy": {
    "name": "推荐策略名称（延续有效策略或新策略）",
    "type": "active|passive|neutral",
    "reason": "为什么用这个策略（结合目标和人设）",
    "fitsRelationship": true
  },
  "replies": [
    {
      "id": "1",
      "content": "具体回复内容",
      "strategy": "使用的策略名称",
      "strategyType": "active|passive|neutral",
      "explanation": "这个回复的作用",
      "whyThis": "为什么这样说（必须说明如何符合目标和人设）",
      "riskLevel": "low|medium|high",
      "riskReason": "可能的风险",
      "prediction": {
        "scenario1": {"probability": 70, "response": "基于历史，对方70%可能说..."},
        "scenario2": {"probability": 20, "response": "对方20%可能说..."},
        "scenario3": {"probability": 10, "response": "对方10%可能说..."}
      },
      "fitsGoal": true,
      "fitsPersona": true
    }
  ],
  "recommendedReplyId": "1",
  "relationshipContext": {
    "conversationCount": ${recentConversations?.length || 0},
    "lastConversationAt": "${recentConversations?.[0]?.created_at || ''}",
    "recentSuccessfulStrategies": ${JSON.stringify(successfulStrategies?.map(s => s.strategy_name) || [])},
    "learningProgress": ${relationship.learning_progress}
  },
  "continuityNote": "如'延续上次成功的XX策略'或'根据新情况调整为XX'"
}
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: '你是学员的私人沟通教练，非常了解他们的关系和目标。',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 2500,
  });

  const result = completion.choices[0].message.content;
  if (!result) {
    throw new Error('AI 返回为空');
  }

  const response: PreciseReplyResponse = JSON.parse(result);
  
  return NextResponse.json(response);
}
