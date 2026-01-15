'use client';

import { useState, useRef, useEffect } from 'react';
import { AgentType, AGENTS } from '@/types/chat';
import Image from 'next/image';

interface ChatInputProps {
  onSend: (message: string, images: string[], mentionedAgent?: AgentType) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const [mentionedAgent, setMentionedAgent] = useState<AgentType | null>(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 监听@输入
  useEffect(() => {
    if (message.endsWith('@')) {
      setShowAgentPicker(true);
    } else if (!message.includes('@')) {
      setShowAgentPicker(false);
      setMentionedAgent(null);
    }
  }, [message]);

  // 选择Agent
  const handleSelectAgent = (agentId: AgentType) => {
    const agent = AGENTS[agentId];
    // 替换最后的@为@AgentName
    setMessage(prev => prev.slice(0, -1) + `@${agent.name} `);
    setMentionedAgent(agentId);
    setShowAgentPicker(false);
    inputRef.current?.focus();
  };

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
    
    // 清空input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowMoreOptions(false);
  };

  // 删除图片
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // 发送消息
  const handleSend = () => {
    if ((!message.trim() && images.length === 0) || isLoading) return;
    
    onSend(message.trim(), images, mentionedAgent || undefined);
    setMessage('');
    setImages([]);
    setMentionedAgent(null);
  };

  // 回车发送
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const styleAgents = Object.values(AGENTS).filter(a => a.id !== 'analyzer');

  return (
    <div className="border-t border-gray-800 bg-[#1a1a1a]">
      {/* Agent选择器弹出层 */}
      {showAgentPicker && (
        <div className="p-3 border-b border-gray-800 bg-[#262626]">
          <div className="text-sm text-gray-400 mb-2">选择顾问：</div>
          <div className="flex flex-wrap gap-2">
            {Object.values(AGENTS).map((agent) => (
              <button
                key={agent.id}
                onClick={() => handleSelectAgent(agent.id)}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-full text-sm text-white flex items-center gap-1 transition-colors"
              >
                <span>{agent.emoji}</span>
                <span>{agent.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 图片预览 */}
      {images.length > 0 && (
        <div className="p-3 border-b border-gray-800 flex flex-wrap gap-2">
          {images.map((img, index) => (
            <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden group">
              <Image src={img} alt="" fill className="object-cover" />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 w-5 h-5 bg-black/60 rounded-bl-lg flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 顾问提示栏 */}
      <div className="px-4 py-2 border-b border-gray-800 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          💡 有 <span className="text-violet-400">{styleAgents.length}位顾问</span> 可以帮你，输入 @ 选择
        </div>
        <div className="flex gap-1">
          {styleAgents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => {
                setMessage(prev => prev + `@${agent.name} `);
                setMentionedAgent(agent.id);
                inputRef.current?.focus();
              }}
              className="w-6 h-6 rounded-full flex items-center justify-center text-sm hover:bg-gray-700 transition-colors"
              title={agent.name}
            >
              {agent.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* 输入区域 */}
      <div className="p-3 flex items-end gap-3">
        {/* 语音按钮 */}
        <button className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 flex-shrink-0 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        {/* 输入框 */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息，@可选择顾问..."
            className="w-full bg-gray-800 text-white rounded-2xl px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-violet-500/50 min-h-[48px] max-h-[120px]"
            rows={1}
            disabled={isLoading}
          />
        </div>

        {/* 表情按钮 */}
        <button className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 flex-shrink-0 transition-colors">
          <span className="text-xl">😊</span>
        </button>

        {/* 更多选项 */}
        <div className="relative">
          <button 
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 flex-shrink-0 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* 更多选项弹出层 */}
          {showMoreOptions && (
            <div className="absolute bottom-12 right-0 bg-[#262626] rounded-xl shadow-xl border border-gray-700 p-2 min-w-[120px]">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <span>📷</span>
                <span>上传截图</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <span>🖼️</span>
                <span>从相册</span>
              </button>
            </div>
          )}
        </div>

        {/* 发送按钮 */}
        {(message.trim() || images.length > 0) && (
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="w-10 h-10 rounded-full bg-violet-600 hover:bg-violet-500 disabled:bg-gray-600 flex items-center justify-center text-white flex-shrink-0 transition-colors"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}
