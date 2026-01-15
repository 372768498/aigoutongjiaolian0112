'use client';

import { useState } from 'react';
import { Message, AGENTS } from '@/types/chat';

interface AgentMessageProps {
  message: Message;
}

export default function AgentMessage({ message }: AgentMessageProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const agent = message.agentId ? AGENTS[message.agentId] : null;
  
  if (!agent) return null;

  // 复制话术
  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 风险等级颜色
  const getRiskColor = (level?: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskText = (level?: string) => {
    switch (level) {
      case 'low': return '低';
      case 'medium': return '中';
      case 'high': return '高';
      default: return '-';
    }
  };

  // 场景分析师的消息
  if (message.agentId === 'analyzer' && message.analysis) {
    const analysis = message.analysis;
    return (
      <div className="flex gap-3 mb-4">
        {/* 头像 */}
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: `${agent.color}20` }}
        >
          {agent.emoji}
        </div>
        
        {/* 内容 */}
        <div className="flex-1 max-w-[600px]">
          <div className="text-sm text-gray-400 mb-1">{agent.name}</div>
          <div className="bg-[#262626] rounded-2xl rounded-tl-sm p-4">
            <p className="text-white mb-4">{message.content}</p>
            
            {/* 分析卡片 */}
            <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span>📊</span>
                <span className="text-gray-300">场景：</span>
                <span className="text-white">{analysis.category} → {analysis.subCategory}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span>😢</span>
                <span className="text-gray-300">对方情绪：</span>
                <span className="text-white">{analysis.otherEmotion.primary}</span>
                <span className="text-gray-400">({analysis.otherEmotion.intensity}/10)</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span>💔</span>
                <span className="text-gray-300">深层需求：</span>
                <span className="text-white">{analysis.deepNeed}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span>⏰</span>
                <span className="text-gray-300">紧急程度：</span>
                <span className="text-white">{analysis.urgency}/10</span>
              </div>
              
              {analysis.taboos.length > 0 && (
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-red-400">⚠️</span>
                    <div>
                      <span className="text-gray-300">避免：</span>
                      <span className="text-red-300">{analysis.taboos.join('、')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-gray-400 text-sm mt-4">
              我邀请顾问团来帮你想想怎么回复...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 风格顾问的消息
  return (
    <div className="flex gap-3 mb-4">
      {/* 头像 */}
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: `${agent.color}20` }}
      >
        {agent.emoji}
      </div>
      
      {/* 内容 */}
      <div className="flex-1 max-w-[600px]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm text-gray-400">{agent.name}</span>
          {message.isRecommended && (
            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
              推荐🏆
            </span>
          )}
          {message.riskLevel === 'high' && (
            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
              慎用⚠️
            </span>
          )}
        </div>
        
        <div className="bg-[#262626] rounded-2xl rounded-tl-sm p-4">
          {/* 整体建议 */}
          <p className="text-white mb-4">{message.content}</p>
          
          {/* 话术列表 */}
          {message.scripts && message.scripts.length > 0 && (
            <div className="space-y-3">
              {message.scripts.map((script, index) => (
                <div key={index} className="bg-[#1a1a1a] rounded-xl p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-white flex-1">{script.content}</p>
                    <button
                      onClick={() => handleCopy(script.content, index)}
                      className="flex-shrink-0 px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                    >
                      {copiedIndex === index ? '已复制 ✓' : '复制'}
                    </button>
                  </div>
                  {script.explanation && (
                    <p className="text-gray-400 text-sm mt-2">💡 {script.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* 成功率和风险 */}
          <div className="flex items-center gap-4 mt-4 text-sm">
            {message.successRate !== undefined && (
              <span className="text-gray-400">
                📈 成功率：<span className="text-white">{message.successRate}%</span>
              </span>
            )}
            {message.riskLevel && (
              <span className="text-gray-400">
                ⚠️ 风险：<span className={getRiskColor(message.riskLevel)}>{getRiskText(message.riskLevel)}</span>
              </span>
            )}
          </div>
          
          {/* 展开详细分析 */}
          {message.reasoning && (
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="mt-3 text-sm text-gray-400 hover:text-gray-300 flex items-center gap-1"
            >
              <span>💭</span>
              <span>{showReasoning ? '收起分析' : '为什么这样建议'}</span>
              <svg 
                className={`w-4 h-4 transition-transform ${showReasoning ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
          
          {showReasoning && message.reasoning && (
            <div className="mt-3 p-3 bg-[#1a1a1a] rounded-xl text-sm text-gray-300">
              {message.reasoning}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
