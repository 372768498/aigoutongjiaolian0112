'use client';

import { useRef, useEffect } from 'react';
import { Contact, Message } from '@/types/chat';
import AgentMessage from './AgentMessage';
import UserMessage from './UserMessage';

interface ChatAreaProps {
  contact: Contact;
  messages: Message[];
  isLoading: boolean;
}

export default function ChatArea({
  contact,
  messages,
  isLoading,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 格式化日期分隔
  const formatDateDivider = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return '今天';
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return weekdays[d.getDay()];
    } else {
      return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-[#111]">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <div className="text-5xl mb-4">{contact.avatar}</div>
          <p className="text-lg mb-2">开始和「{contact.name}」的沟通</p>
          <p className="text-sm text-center max-w-xs">
            上传聊天截图，AI顾问团会帮你分析情况并给出不同风格的回复建议
          </p>
        </div>
      ) : (
        <>
          {/* 日期分隔 */}
          {messages.length > 0 && (
            <div className="text-center text-gray-500 text-sm mb-4">
              {formatDateDivider(messages[0].timestamp)}
            </div>
          )}

          {/* 消息列表 */}
          {messages.map((message) => {
            if (message.type === 'user') {
              return <UserMessage key={message.id} message={message} />;
            } else if (message.type === 'agent') {
              return <AgentMessage key={message.id} message={message} />;
            }
            return null;
          })}

          {/* 加载中状态 */}
          {isLoading && (
            <div className="flex gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg flex-shrink-0">
                🤔
              </div>
              <div className="bg-[#262626] rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>顾问团正在分析...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
