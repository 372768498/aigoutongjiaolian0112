/**
 * 智能 Prompt 生成器
 * 基于用户档案生成高度个性化的 AI 提示词
 */

export interface UserProfile {
  name?: string;
  relationshipGoal?: string;
  desiredPersona?: string[];
  communicationStyle?: {
    vocabulary?: string[];      // 常用词汇
    sentenceLength?: "short" | "medium" | "long";
    emojiUsage?: "frequent" | "occasional" | "rare";
    tone?: string;              // 语气：温柔、直接、幽默等
  };
}

export interface SuccessPattern {
  strategy: string;
  successRate: number;
  example: string;
}

export interface FailedPattern {
  strategy: string;
  reason: string;
}

export interface ConversationContext {
  theirMessage: string;
  background?: string;
  userProfile?: UserProfile;
  successfulPatterns?: SuccessPattern[];
  failedPatterns?: FailedPattern[];
}

/**
 * 生成智能 Prompt
 * 根据用户档案和历史经验生成个性化提示词
 */
export function generateSmartPrompt(context: ConversationContext): string {
  const hasProfile = context.userProfile && Object.keys(context.userProfile).length > 0;
  const hasHistory = (context.successfulPatterns && context.successfulPatterns.length > 0) ||
                     (context.failedPatterns && context.failedPatterns.length > 0);

  // 如果没有档案，使用通用 Prompt
  if (!hasProfile && !hasHistory) {
    return generateBasicPrompt(context);
  }

  // 有档案，生成智能 Prompt
  return generateAdvancedPrompt(context);
}

/**
 * 通用 Prompt（无档案时使用）
 */
function generateBasicPrompt(context: ConversationContext): string {
  return `
你是一个专业的 AI 沟通助手。你的任务是帮助用户生成得体、高情商的回复。

# 当前对话情境

对方说：“${context.theirMessage}”
${context.background ? `背景：${context.background}` : ''}

# 你的任务

请按以下步骤思考：

1. **分析对方意图**
   - 对方的情绪是什么？
   - 对方真正想表达什么？
   - 对方期待什么样的回应？

2. **生成3个不同策略的回复**
   - 策略1：保守型（低风险，稳妥）
   - 策略2：中性型（平衡，合适）
   - 策略3：积极型（主动，推进关系）

3. **每个回复必须包含**
   - 具体的回复内容（自然、真诚、不生硬）
   - 为什么这样说（简洁解释）
   - 风险等级（low/medium/high）
   - 风险原因
   - 对方可能的3种反应（概率从高到低）

# 输出格式

请以JSON格式返回，结构如下：

\`\`\`json
{
  "analysis": {
    "emotion": "对方情绪",
    "intention": "对方意图",
    "context": "情境分析"
  },
  "suggestedStrategy": {
    "name": "推荐策略名称",
    "type": "conservative/balanced/proactive",
    "reason": "为什么推荐这个"
  },
  "replies": [
    {
      "id": "reply_1",
      "content": "具体的回复内容",
      "strategy": "策略名称",
      "strategyType": "conservative",
      "whyThis": "为什么这样说",
      "riskLevel": "low",
      "riskReason": "风险说明",
      "prediction": {
        "scenario1": { "probability": 70, "response": "最可能的反应" },
        "scenario2": { "probability": 20, "response": "次可能的反应" },
        "scenario3": { "probability": 10, "response": "低概率反应" }
      }
    }
  ],
  "recommendedReplyId": "reply_2"
}
\`\`\`

# 重要提示

1. 回复内容必须自然、真诚，不要太正式或机械
2. 考虑中国人的沟通习惯和文化背景
3. 三个策略要有明显区别，给用户真正的选择
4. 预测要具体、合理，不要泛泛而谈

现在请开始生成！
`.trim();
}

/**
 * 高级 Prompt（有档案时使用）
 */
function generateAdvancedPrompt(context: ConversationContext): string {
  const profile = context.userProfile || {};
  const successful = context.successfulPatterns || [];
  const failed = context.failedPatterns || [];

  return `
你是一个高级 AI 沟通助手。你的核心使命是：**生成用户真正想说的话**。

# 🎯 理解用户是谁

${generateProfileSection(profile)}

# 📚 历史经验告诉我们

${generateHistorySection(successful, failed)}

# 💬 当前对话情境

对方说：“${context.theirMessage}”
${context.background ? `背景：${context.background}` : ''}

# 🧠请按以下步骤思考

1. **深入理解对方**
   - 对方的真实意图是什么？（不只是字面意思）
   - 对方的情绪状态如何？
   - 对方期待什么样的回应？

2. **明确用户目标**
   - 短期目标：化解当前情境
   ${profile.relationshipGoal ? `- 长期目标：${profile.relationshipGoal}` : ''}

3. **模仿用户风格**
   ${generateStyleGuidance(profile.communicationStyle)}

4. **选择最佳策略**
   - 结合历史成功经验
   - 避免已知的失败模式
   - 确保符合用户人设

# 📝 生成要求

请生成3个回复选项，每个都要：

1. **听起来就像用户自己说的**
   ${profile.communicationStyle?.vocabulary && profile.communicationStyle.vocabulary.length > 0 
     ? `- 使用这些词汇：${profile.communicationStyle.vocabulary.join('、')}`
     : '- 使用自然、口语化的表达'}
   ${profile.communicationStyle?.sentenceLength 
     ? `- 句子长度：${profile.communicationStyle.sentenceLength === 'short' ? '短句为主' : profile.communicationStyle.sentenceLength === 'long' ? '长句为主' : '中等长度'}`
     : ''}
   ${profile.communicationStyle?.emojiUsage 
     ? `- Emoji使用：${profile.communicationStyle.emojiUsage === 'frequent' ? '频繁使用' : profile.communicationStyle.emojiUsage === 'rare' ? '很少使用' : '偶尔使用'}`
     : ''}
   ${profile.communicationStyle?.tone 
     ? `- 语气：${profile.communicationStyle.tone}`
     : ''}

2. **符合用户的人设目标**
   ${profile.desiredPersona && profile.desiredPersona.length > 0
     ? `- 要展现“${profile.desiredPersona.join('、')}”的特质`
     : '- 要展现积极、成熟的一面'}
   ${profile.relationshipGoal 
     ? `- 要推进“${profile.relationshipGoal}”这个目标`
     : ''}

3. **提供不同的策略选择**
   - 保守型：低风险，稳妥化解
   - 中性型：平衡，既推进又不冒进
   - 积极型：主动推进，但有一定风险

4. **预测对方反应**
   - 70%概率的最可能反应
   - 20%概率的次可能反应
   - 10%概率的低概率反应

# 🎨 输出格式

请以JSON格式返回，结构如下：

\`\`\`json
{
  "analysis": {
    "emotion": "对方情绪",
    "intention": "对方意图",
    "context": "情境分析"
  },
  "suggestedStrategy": {
    "name": "推荐策略名称",
    "type": "conservative/balanced/proactive",
    "reason": "为什么推荐这个"
  },
  "replies": [
    {
      "id": "reply_1",
      "content": "具体的回复内容（必须符合用户风格！）",
      "strategy": "策略名称",
      "strategyType": "conservative",
      "whyThis": "为什么这样说（解释给用户听）",
      "riskLevel": "low",
      "riskReason": "风险说明",
      "prediction": {
        "scenario1": { "probability": 70, "response": "最可能的具体反应" },
        "scenario2": { "probability": 20, "response": "次可能的具体反应" },
        "scenario3": { "probability": 10, "response": "低概率具体反应" }
      }
    }
  ],
  "recommendedReplyId": "reply_2"
}
\`\`\`

# ⚠️ 重要提示

1. **回复内容必须像用户自己说的** - 这是最核心的要求！
2. 不要生成太正式、太官方的表达
3. 要结合历史成功经验，但不要复制原话
4. 三个策略要有明显区别，给用户真正的选择
5. 预测要具体、可信，基于实际人际交往逻辑

现在请开始生成！
`.trim();
}

/**
 * 生成用户档案部分
 */
function generateProfileSection(profile: UserProfile): string {
  if (!profile || Object.keys(profile).length === 0) {
    return '（当前没有用户档案信息）';
  }

  const sections: string[] = [];

  if (profile.relationshipGoal) {
    sections.push(`**关系目标**：${profile.relationshipGoal}`);
  }

  if (profile.desiredPersona && profile.desiredPersona.length > 0) {
    sections.push(`**期望展现的人设**：${profile.desiredPersona.join('、')}`);
  }

  if (profile.communicationStyle) {
    const style = profile.communicationStyle;
    const styleDesc: string[] = [];

    if (style.vocabulary && style.vocabulary.length > 0) {
      styleDesc.push(`常用词汇：${style.vocabulary.join('、')}`);
    }
    if (style.sentenceLength) {
      const lengthMap = {
        short: '短句为主',
        medium: '中等长度',
        long: '长句为主'
      };
      styleDesc.push(`句子长度：${lengthMap[style.sentenceLength]}`);
    }
    if (style.emojiUsage) {
      const emojiMap = {
        frequent: '频繁使用',
        occasional: '偶尔使用',
        rare: '很少使用'
      };
      styleDesc.push(`Emoji使用：${emojiMap[style.emojiUsage]}`);
    }
    if (style.tone) {
      styleDesc.push(`语气：${style.tone}`);
    }

    if (styleDesc.length > 0) {
      sections.push(`**说话风格**：\n  - ${styleDesc.join('\n  - ')}`);
    }
  }

  return sections.length > 0 ? sections.join('\n') : '（当前没有用户档案信息）';
}

/**
 * 生成历史经验部分
 */
function generateHistorySection(successful: SuccessPattern[], failed: FailedPattern[]): string {
  const sections: string[] = [];

  if (successful && successful.length > 0) {
    sections.push('**在这个关系中最有效的策略**：');
    successful.forEach(pattern => {
      sections.push(`\u2705 ${pattern.strategy} (成功率 ${pattern.successRate}%)`);
      sections.push(`   案例：“${pattern.example}”`);
    });
    sections.push('');
  }

  if (failed && failed.length > 0) {
    sections.push('**要避免的策略**：');
    failed.forEach(pattern => {
      sections.push(`\u274c ${pattern.strategy}`);
      sections.push(`   原因：${pattern.reason}`);
    });
  }

  if (sections.length === 0) {
    return '（当前没有历史经验数据）';
  }

  return sections.join('\n');
}

/**
 * 生成风格指导
 */
function generateStyleGuidance(style?: UserProfile['communicationStyle']): string {
  if (!style) {
    return '- 使用自然、口语化的表达方式';
  }

  const guidance: string[] = [];

  if (style.vocabulary && style.vocabulary.length > 0) {
    guidance.push(`用户常用词汇：${style.vocabulary.join('、')}`);
  }
  if (style.sentenceLength) {
    guidance.push(`用户喜欢${style.sentenceLength === 'short' ? '短句' : style.sentenceLength === 'long' ? '长句' : '中等长度的句子'}`);
  }
  if (style.emojiUsage) {
    guidance.push(`用户${style.emojiUsage === 'frequent' ? '频繁使用' : style.emojiUsage === 'rare' ? '很少使用' : '偶尔使用'}Emoji`);
  }
  if (style.tone) {
    guidance.push(`用户的语气是${style.tone}`);
  }

  return guidance.length > 0 
    ? `- ${guidance.join('\n   - ')}`
    : '- 使用自然、口语化的表达方式';
}

/**
 * 示例用户档案（用于测试）
 */
export const exampleUserProfile: UserProfile = {
  name: '小美',
  relationshipGoal: '推进到同居阶段',
  desiredPersona: ['独立', '温柔', '不作不闹'],
  communicationStyle: {
    vocabulary: ['宝贝', '呀', '哈哈', '唔唔'],
    sentenceLength: 'short',
    emojiUsage: 'frequent',
    tone: '温柔'
  }
};

/**
 * 示例成功模式（用于测试）
 */
export const exampleSuccessPatterns: SuccessPattern[] = [
  {
    strategy: '撒娇式沟通',
    successRate: 80,
    example: '宝贝你是对哪部分有疑问呀？😊'
  },
  {
    strategy: '主动澄清',
    successRate: 75,
    example: '我刚才表达不清楚，让你为难了~'
  }
];

/**
 * 示例失败模式（用于测试）
 */
export const exampleFailedPatterns: FailedPattern[] = [
  {
    strategy: '被动等待',
    reason: '对方会觉得你没主见'
  },
  {
    strategy: '过度强势',
    reason: '容易引发冲突'
  }
];