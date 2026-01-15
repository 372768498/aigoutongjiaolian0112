'use client';

import { Contact, RELATIONSHIP_TYPES } from '@/types/chat';

interface ChatSidebarProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (contactId: string) => void;
  onAddContact: () => void;
}

export default function ChatSidebar({
  contacts,
  selectedContactId,
  onSelectContact,
  onAddContact,
}: ChatSidebarProps) {
  // 格式化时间
  const formatTime = (date: Date) => {
    const now = new Date();
    const d = new Date(date);
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return weekdays[d.getDay()];
    } else {
      return d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
    }
  };

  return (
    <div className="w-80 bg-[#1a1a1a] border-r border-gray-800 flex flex-col h-full">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <h1 className="text-lg font-semibold text-white">AI沟通教练</h1>
        </div>
        <button
          onClick={onAddContact}
          className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* 联系人列表 */}
      <div className="flex-1 overflow-y-auto">
        {contacts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">👋</div>
            <p className="text-gray-400 text-sm mb-4">还没有沟通对象</p>
            <button
              onClick={onAddContact}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors"
            >
              添加第一个对象
            </button>
          </div>
        ) : (
          contacts.map((contact) => {
            const relationInfo = RELATIONSHIP_TYPES[contact.relationshipType];
            const isSelected = selectedContactId === contact.id;
            
            return (
              <div
                key={contact.id}
                onClick={() => onSelectContact(contact.id)}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-gray-800'
                    : 'hover:bg-gray-800/50'
                }`}
              >
                {/* 头像 */}
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-2xl flex-shrink-0">
                  {contact.avatar}
                </div>
                
                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white truncate">{contact.name}</span>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatTime(contact.updatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-400 truncate">
                      {contact.lastMessage || `${relationInfo.label} · ${contact.relationshipStage}`}
                    </span>
                    {contact.messageCount > 0 && (
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {contact.messageCount}条
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 底部添加按钮 */}
      {contacts.length > 0 && (
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={onAddContact}
            className="w-full py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加沟通对象
          </button>
        </div>
      )}
    </div>
  );
}
