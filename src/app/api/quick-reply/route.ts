import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase';
import { generateSmartPrompt, ConversationContext, SuccessPattern, FailedPattern } from '@/lib/smart-prompt';
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

    // 构建上下文
    const conversationContext: ConversationContext = {
      theirMessage,
      background: context,
    };

    // 如果有 relationshipId 且 Supabase 已配置，加载用户档案
    const db = supabaseAdmin();
    if (relationshipId && db) {
      try {
        // 加载关系档案
        const { data: relationship, error: relError } = await db
          .from('relationships')
          .select('*')
          .eq('id', relationshipId)
          .single();

        if (!relError && relationship) {
          // 构建用户档案
          conversationContext.userProfile = {
            name: relationship.person_name,
            relationshipGoal: relationship.goal,
            desiredPersona: relationship.desired_persona || [],
            communicationStyle: relationship.communication_style || {}
          };

          // 加载成功模式（从历史对话中提取）
          const { data: conversations } = await db
            .from('conversations')
            .select('used_reply_id, replies, effectiveness')
            .eq('relationship_id', relationshipId)
            .eq('effectiveness', 'success')
            .order('created_at', { ascending: false })
            .limit(5);

          if (conversations && conversations.length > 0) {
            const patterns: SuccessPattern[] = [];
            
            for (const c of conversations) {
              if (c.used_reply_id && c.replies) {
                const usedReply = c.replies.find((r: any) => r.id === c.used_reply_id);
                if (usedReply) {
                  patterns.push({
                    strategy: usedReply.strategy || '未知策略',
                    successRate: 100,
                    example: usedReply.content
                  });
                }
              }
              if (patterns.length >= 3) break;
            }
            
            if (patterns.length > 0) {
              conversationContext.successfulPatterns = patterns;
            }
          }

          // 加载失败模式
          const { data: failedConvs } = await db
            .from('conversations')
            .select('used_reply_id, replies')
            .eq('relationship_id', relationshipId)
            .eq('effectiveness', 'failed')
            .order('created_at', { ascending: false })
            .limit(3);

          if (failedConvs && failedConvs.length > 0) {
            const failedPatterns: FailedPattern[] = [];
            
            for (const c of failedConvs) {
              if (c.used_reply_id && c.replies) {
                const usedReply = c.replies.find((r: any) => r.id === c.used_reply_id);
                if (usedReply) {
                  failedPatterns.push({
                    strategy: usedReply.strategy || '未知策略',
                    reason: '未达到预期效果'
                  });
                }
              }
              if (failedPatterns.length >= 2) break;
            }
            
            if (failedPatterns.length > 0) {
              conversationContext.failedPatterns = failedPatterns;
            }
          }
        }
      } catch (error) {
        console.error('[加载档案错误]:', error);
        // 继续使用通用模式
      }
    }

    // 生成智能 Prompt
    const smartPrompt = generateSmartPrompt(conversationContext);

    console.log('[智能 Prompt] 生成成功:', {
      hasProfile: !!conversationContext.userProfile,
      hasSuccessPatterns: !!(conversationContext.successfulPatterns?.length),
      hasFailedPatterns: !!(conversationContext.failedPatterns?.length),
      promptLength: smartPrompt.length
    });

    // 调用 OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: smartPrompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 2500,
    });

    const result = completion.choices[0].message.content;
    if (!result) {
      throw new Error('AI 返回为空');
    }

    const response: QuickReplyResponse = JSON.parse(result);
    
    console.log('[智能回复] 生成成功:', {
      repliesCount: response.replies?.length,
      recommendedId: response.recommendedReplyId
    });

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('快速回复 API 错误:', error);
    return NextResponse.json(
      { error: '生成建议失败，请重试', details: error.message },
      { status: 500 }
    );
  }
}