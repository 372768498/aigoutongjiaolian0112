'use client';

import { useState, useEffect, useRef } from 'react';
import { Contact, Message, AgentType, AGENTS, RELATIONSHIP_TYPES } from '@/types/chat';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatArea from '@/components/chat/ChatArea';
import ChatInput from '@/components/chat/ChatInput';
import AddContactModal from '@/components/chat/AddContactModal';

// localStorage keys
const STORAGE_KEYS = {
  CONTACTS: 'ai-coach-contacts',
  MESSAGES: 'ai-coach-messages',
};

// 生成唯一ID
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default function ChatPage() {
  // 状态
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初始化：从localStorage加载数据
  useEffect(() => {
    const savedContacts = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    
    if (savedContacts) {
      try {
        const parsed = JSON.parse(savedContacts);
        // 转换日期字符串为Date对象
        const contactsWithDates = parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
        }));
        setContacts(contactsWithDates);
      } catch (e) {
        console.error('Failed to parse contacts:', e);
      }
    }
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // 转换日期字符串为Date对象
        const messagesWithDates: Record<string, Message[]> = {};
        for (const [key, msgs] of Object.entries(parsed)) {
          messagesWithDates[key] = (msgs as any[]).map(m => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }));
        }
        setMessages(messagesWithDates);
      } catch (e) {
        console.error('Failed to parse messages:', e);
      }
    }
  }, []);

  // 保存contacts到localStorage
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    }
  }, [contacts]);

  // 保存messages到localStorage
  useEffect(() => {
    if (Object.keys(messages).length > 0) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    }
  }, [messages]);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedContactId]);

  // 获取当前联系人
  const currentContact = contacts.find(c => c.id === selectedContactId);
  const currentMessages = selectedContactId ? messages[selectedContactId] || [] : [];

  // 添加联系人
  const handleAddContact = (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'messageCount'>) => {
    const newContact: Contact = {
      ...contactData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      messageCount: 0,
    };
    
    setContacts(prev => [newContact, ...prev]);
    setSelectedContactId(newContact.id);
    setShowAddModal(false);
  };

  // 选择联系人
  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
    setIsMobileMenuOpen(false);
  };

  // 发送消息
  const handleSendMessage = async (
    text: string,
    images: string[],
    mentionedAgent?: AgentType
  ) => {
    if (!selectedContactId || (!text.trim() && images.length === 0)) return;

    // 创建用户消息
    const userMessage: Message = {
      id: generateId(),
      type: 'user',
      content: text,
      timestamp: new Date(),
      images: images.length > 0 ? images : undefined,
      mentionedAgent,
    };

    // 添加用户消息
    setMessages(prev => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), userMessage],
    }));

    // 更新联系人
    setContacts(prev => prev.map(c => 
      c.id === selectedContactId 
        ? { 
            ...c, 
            updatedAt: new Date(), 
            lastMessage: text || '发送了图片',
            messageCount: c.messageCount + 1,
          } 
        : c
    ));

    // 调用API
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          images,
          mentionedAgent,
          context: {
            contact: currentContact,
            recentMessages: currentMessages.slice(-10),
          },
        }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      
      // 添加AI回复消息
      if (data.messages && data.messages.length > 0) {
        setMessages(prev => ({
          ...prev,
          [selectedContactId]: [
            ...(prev[selectedContactId] || []),
            ...data.messages.map((m: Message) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            })),
          ],
        }));

        // 更新消息计数
        setContacts(prev => prev.map(c => 
          c.id === selectedContactId 
            ? { ...c, messageCount: c.messageCount + data.messages.length } 
            : c
        ));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // 添加错误消息
      const errorMessage: Message = {
        id: generateId(),
        type: 'system',
        content: '抱歉，分析失败，请稍后重试',
        timestamp: new Date(),
      };
      setMessages(prev => ({
        ...prev,
        [selectedContactId]: [...(prev[selectedContactId] || []), errorMessage],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#111] flex overflow-hidden">
      {/* 移动端菜单按钮 */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* 左侧边栏 */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-40
        transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        transition-transform duration-300 ease-in-out
      `}>
        <ChatSidebar
          contacts={contacts}
          selectedContactId={selectedContactId}
          onSelectContact={handleSelectContact}
          onAddContact={() => setShowAddModal(true)}
        />
      </div>

      {/* 移动端遮罩 */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 右侧聊天区域 */}
      <div className="flex-1 flex flex-col h-full">
        {selectedContactId && currentContact ? (
          <>
            {/* 头部 */}
            <div className="h-16 bg-[#1a1a1a] border-b border-gray-800 flex items-center px-4 md:px-6">
              <div className="md:hidden w-10" /> {/* 移动端占位 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl">
                  {currentContact.avatar}
                </div>
                <div>
                  <h2 className="font-semibold text-white">{currentContact.name}</h2>
                  <p className="text-xs text-gray-400">
                    {RELATIONSHIP_TYPES[currentContact.relationshipType].label} · {currentContact.relationshipStage}
                  </p>
                </div>
              </div>
            </div>

            {/* 消息区域 */}
            <ChatArea
              messages={currentMessages}
              isLoading={isLoading}
              contact={currentContact}
            />
            <div ref={messagesEndRef} />

            {/* 输入区域 */}
            <ChatInput
              onSend={handleSendMessage}
              isLoading={isLoading}
              agents={Object.values(AGENTS)}
            />
          </>
        ) : (
          /* 未选择联系人的欢迎页 */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-white mb-2">AI 沟通教练</h2>
            <p className="text-gray-400 mb-6 max-w-md">
              你的 24小时私人沟通教练<br />
              记住每段关系的历史，给出最适合你的建议
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              添加第一个沟通对象
            </button>
          </div>
        )}
      </div>

      {/* 添加联系人弹窗 */}
      <AddContactModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddContact}
      />
    </div>
  );
}
