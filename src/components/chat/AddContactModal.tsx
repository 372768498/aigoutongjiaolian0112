'use client';

import { useState } from 'react';
import { Contact, RELATIONSHIP_TYPES } from '@/types/chat';

type RelationType = keyof typeof RELATIONSHIP_TYPES;

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'messageCount'>) => void;
}

// 头像选项
const AVATAR_OPTIONS = ['👨', '👩', '👴', '👵', '👦', '👧', '🧑', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '💕', '👔', '👪', '👫', '🤝'];

export default function AddContactModal({ isOpen, onClose, onAdd }: AddContactModalProps) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('👨');
  const [relationshipType, setRelationshipType] = useState<RelationType>('romance');
  const [relationshipStage, setRelationshipStage] = useState('');
  const [traits, setTraits] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // 重置表单
  const resetForm = () => {
    setName('');
    setAvatar('👨');
    setRelationshipType('romance');
    setRelationshipStage('');
    setTraits('');
  };

  // 提交
  const handleSubmit = () => {
    if (!name.trim()) return;
    
    const stages = RELATIONSHIP_TYPES[relationshipType].stages;
    const finalStage = relationshipStage || stages[0];
    
    onAdd({
      name: name.trim(),
      avatar,
      relationshipType,
      relationshipStage: finalStage,
      traits: traits.trim() || undefined,
      lastMessage: undefined,
    });
    
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const currentRelation = RELATIONSHIP_TYPES[relationshipType];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e1e1e] rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl">
        {/* 头部 */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">添加沟通对象</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 表单 */}
        <div className="p-4 space-y-4">
          {/* 头像和名称 */}
          <div className="flex items-start gap-4">
            {/* 头像选择 */}
            <div className="relative">
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="w-16 h-16 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-3xl transition-colors border-2 border-gray-700 hover:border-violet-500"
              >
                {avatar}
              </button>
              
              {/* 头像选择器 */}
              {showAvatarPicker && (
                <div className="absolute top-full left-0 mt-2 p-2 bg-gray-800 rounded-xl border border-gray-700 grid grid-cols-4 gap-1 z-10">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setAvatar(emoji);
                        setShowAvatarPicker(false);
                      }}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl hover:bg-gray-700 transition-colors ${
                        avatar === emoji ? 'bg-violet-600' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 名称输入 */}
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">称呼 *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="如：男神、张总、妈妈"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          {/* 关系类型 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">关系类型</label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.entries(RELATIONSHIP_TYPES) as [RelationType, typeof RELATIONSHIP_TYPES[RelationType]][]).map(
                ([type, info]) => (
                  <button
                    key={type}
                    onClick={() => {
                      setRelationshipType(type);
                      setRelationshipStage('');
                    }}
                    className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                      relationshipType === type
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-xl">{info.emoji}</span>
                    <span className="text-xs">{info.label}</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* 关系阶段 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">关系阶段</label>
            <div className="flex flex-wrap gap-2">
              {currentRelation.stages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setRelationshipStage(stage)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    (relationshipStage || currentRelation.stages[0]) === stage
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* TA的特点（可选） */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">TA的特点（可选）</label>
            <textarea
              value={traits}
              onChange={(e) => setTraits(e.target.value)}
              placeholder="如：性格内向、工作忙、喜欢撒娇..."
              rows={2}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-4 border-t border-gray-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors"
          >
            确认添加
          </button>
        </div>
      </div>
    </div>
  );
}
