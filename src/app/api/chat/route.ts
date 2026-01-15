import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { AgentType, Message, AGENTS } from "@/types/chat";
import { buildSystemPrompt, STYLE_AGENT_OUTPUT_FORMAT } from "@/lib/agents";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 生成唯一ID
function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 调用单个Agent
async function callAgent(
  agentType: AgentType,
  userMessage: string,
  images: string[],
  context: {
    contact?: { name: string; relationshipType: string; relationshipStage: string; traits?: string };
    analysisResult?: string;
  }
): Promise<Message> {
  const agent = AGENTS[agentType];
  let systemPrompt = buildSystemPrompt(agentType, context.contact as any);
  
  // 风格Agent需要场景分析结果作为上下文
  if (agentType !== 'analyzer' && context.analysisResult) {
    systemPrompt += `

## 场景分析结果（由场景分析师提供，请在此基础上给出你的风格建议）
${context.analysisResult}`;
    systemPrompt += STYLE_AGENT_OUTPUT_FORMAT;
  }

  // 构建消息内容
  const contentParts: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];
  
  if (userMessage) {
    contentParts.push({
      type: "text",
      text: userMessage,
    });
  }

  // 添加图片
  for (const image of images) {
    contentParts.push({
      type: "image_url",
      image_url: {
        url: image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`,
      },
    });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: contentParts },
      ],
      max_tokens: 2000,
    });

    const text = response.choices[0]?.message?.content || "";
    
    // 解析JSON响应
    let parsedResponse;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // 如果解析失败，使用原始文本
    }

    // 构建消息
    const message: Message = {
      id: generateId(),
      type: 'agent',
      agentId: agentType,
      content: parsedResponse?.approach || parsedResponse?.strategicDirection || text,
      timestamp: new Date(),
    };

    // 根据Agent类型添加额外字段
    if (agentType === 'analyzer' && parsedResponse) {
      message.analysis = {
        category: parsedResponse.scene?.category || '',
        subCategory: parsedResponse.scene?.subCategory || '',
        otherEmotion: {
          primary: parsedResponse.otherPartyAnalysis?.currentEmotion?.primary || '',
          intensity: parsedResponse.otherPartyAnalysis?.currentEmotion?.intensity || 5,
        },
        deepNeed: parsedResponse.otherPartyAnalysis?.deepNeed || '',
        urgency: parsedResponse.urgency?.level || 5,
        taboos: parsedResponse.safetyBoundary?.absoluteTaboos || [],
        advice: parsedResponse.strategicDirection || '',
      };
    } else if (parsedResponse) {
      message.scripts = parsedResponse.scripts || [];
      message.successRate = parsedResponse.successRate;
      message.riskLevel = parsedResponse.riskLevel;
      message.reasoning = parsedResponse.reasoning;
    }

    return message;
  } catch (error) {
    console.error(`Agent ${agentType} error:`, error);
    return {
      id: generateId(),
      type: 'agent',
      agentId: agentType,
      content: '抱歉，我暂时无法分析，请稍后重试。',
      timestamp: new Date(),
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, images = [], mentionedAgent, context } = await request.json();

    const messages: Message[] = [];

    // 如果@了特定Agent，只调用那个Agent
    if (mentionedAgent && mentionedAgent !== 'analyzer') {
      const agentMessage = await callAgent(
        mentionedAgent,
        message,
        images,
        { contact: context?.contact }
      );
      messages.push(agentMessage);
      return NextResponse.json({ messages });
    }

    // 完整分析流程
    // Step 1: 场景分析师
    const analysisMessage = await callAgent(
      'analyzer',
      message || '请分析这段对话',
      images,
      { contact: context?.contact }
    );
    messages.push(analysisMessage);

    // 将分析结果转为字符串供其他Agent使用
    const analysisResultStr = JSON.stringify(analysisMessage.analysis || {});

    // Step 2: 并行调用4个风格Agent
    const styleAgents: AgentType[] = ['warm', 'humor', 'cool', 'direct'];
    const stylePromises = styleAgents.map(agentType => 
      callAgent(
        agentType,
        message || '请根据场景分析，给出你的沟通建议',
        [], // 风格Agent不需要重复看图片
        { 
          contact: context?.contact,
          analysisResult: analysisResultStr
        }
      )
    );

    const styleMessages = await Promise.all(stylePromises);
    
    // 添加推荐标记（根据成功率排序）
    const sortedMessages = styleMessages
      .map((msg, index) => ({ msg, originalIndex: index }))
      .sort((a, b) => (b.msg.successRate || 0) - (a.msg.successRate || 0));
    
    if (sortedMessages.length > 0) {
      sortedMessages[0].msg.isRecommended = true;
    }

    // 按原始顺序添加消息
    for (const { msg } of sortedMessages.sort((a, b) => a.originalIndex - b.originalIndex)) {
      messages.push(msg);
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "分析失败，请稍后重试" },
      { status: 500 }
    );
  }
}
