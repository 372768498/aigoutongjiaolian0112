'use client';

import { Message, AGENTS } from '@/types/chat';
import Image from 'next/image';

interface UserMessageProps {
  message: Message;
}

export default function UserMessage({ message }: UserMessageProps) {
  const mentionedAgent = message.mentionedAgent ? AGENTS[message.mentionedAgent] : null;

  return (
    <div className="flex gap-3 mb-4 justify-end">
      {/* 内容 */}
      <div className="max-w-[600px]">
        <div className="bg-[#95ec69] rounded-2xl rounded-tr-sm p-4">
          {/* @提及 */}
          {mentionedAgent && (
            <div className="mb-2 text-sm text-green-800/70">
              @{mentionedAgent.emoji} {mentionedAgent.name}
            </div>
          )}
          
          {/* 图片 */}
          {message.images && message.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {message.images.map((img, index) => (
                <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden">
                  <Image
                    src={img}
                    alt={`截图 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* 文字内容 */}
          {message.content && (
            <p className="text-gray-900 whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
      </div>
      
      {/* 头像 */}
      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-lg flex-shrink-0">
        👤
      </div>
    </div>
  );
}
