"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Relationship {
  id: string;
  person_name: string;
  relationship_type: string;
  emoji: string;
  goal?: string;
  desired_persona?: string[];
  communication_style?: {
    vocabulary?: string[];
    sentenceLength?: string;
    emojiUsage?: string;
    tone?: string;
  };
  learning_progress: number;
  conversation_count: number;
}

interface Conversation {
  id: string;
  their_message: string;
  context?: string;
  replies: any[];
  used_reply_id?: string;
  effectiveness?: string;
  created_at: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RelationshipDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [context, setContext] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // 加载关系详情
      const relResponse = await fetch(`/api/relationships/${id}`, {
        headers: { "X-User-Id": "test-user-001" }
      });
      if (relResponse.ok) {
        const relData = await relResponse.json();
        setRelationship(relData.relationship);
      }

      // 加载对话历史
      const convResponse = await fetch(`/api/relationships/${id}/conversations?limit=20`, {
        headers: { "X-User-Id": "test-user-001" }
      });
      if (convResponse.ok) {
        const convData = await convResponse.json();
        setConversations(convData.conversations || []);
      }
    } catch (error) {
      console.error("加载失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAdvice = async () => {
    if (!message.trim()) {
      alert("请输入对方说的话");
      return;
    }

    setIsAnalyzing(true);
    try {
      // TODO: 调用快速回复 API
      alert("功能开发中...");
    } catch (error) {
      console.error("分析失败:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (!relationship) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">关系不存在</p>
          <Link href="/relationships">
            <Button>返回列表</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-24">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/relationships" className="text-slate-400 hover:text-slate-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{relationship.emoji}</span>
                <div>
                  <h1 className="text-lg font-bold text-white">{relationship.person_name}</h1>
                  <p className="text-xs text-slate-400">{relationship.conversation_count} 次对话</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="text-slate-400 hover:text-slate-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 档案信息（可折叠） */}
      {showProfile && (
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-4">
            {relationship.goal && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 mb-1">目标</h3>
                <p className="text-sm text-white">{relationship.goal}</p>
              </div>
            )}
            {relationship.desired_persona && relationship.desired_persona.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 mb-2">期望人设</h3>
                <div className="flex flex-wrap gap-1.5">
                  {relationship.desired_persona.map((persona, i) => (
                    <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                      {persona}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {relationship.communication_style?.vocabulary && relationship.communication_style.vocabulary.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 mb-2">常用词汇</h3>
                <div className="flex flex-wrap gap-1.5">
                  {relationship.communication_style.vocabulary.map((word, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 mb-2">学习进度</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{ width: `${relationship.learning_progress}%` }}
                  />
                </div>
                <span className="text-sm text-white font-semibold">
                  {relationship.learning_progress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 对话历史 */}
      <main className="max-w-4xl mx-auto px-4 py-4">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-slate-400 mb-2">还没有对话历史</p>
            <p className="text-sm text-slate-500">在下方输入对方说的话，获取沟通建议</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => (
              <div key={conv.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <div className="mb-3">
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-slate-400 text-xs">Ta说：</span>
                    {conv.effectiveness && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        conv.effectiveness === 'success' ? 'bg-green-500/20 text-green-400' :
                        conv.effectiveness === 'failed' ? 'bg-red-500/20 text-red-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {conv.effectiveness === 'success' ? '✓ 有效' :
                         conv.effectiveness === 'failed' ? '✗ 无效' : '中性'}
                      </span>
                    )}
                  </div>
                  <p className="text-white">{conv.their_message}</p>
                  {conv.context && (
                    <p className="text-sm text-slate-400 mt-1">背景：{conv.context}</p>
                  )}
                </div>
                {conv.used_reply_id && conv.replies.length > 0 && (
                  <div className="pl-4 border-l-2 border-purple-500/30">
                    {conv.replies
                      .filter((r: any) => r.id === conv.used_reply_id)
                      .map((reply: any) => (
                        <div key={reply.id}>
                          <p className="text-sm text-slate-400 mb-1">我说：</p>
                          <p className="text-white">{reply.content}</p>
                        </div>
                      ))}
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-3">
                  {new Date(conv.created_at).toLocaleString('zh-CN')}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 底部输入框 */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="space-y-3">
            <Textarea
              placeholder="对方说的话..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-slate-200 min-h-[60px] resize-none"
            />
            <input
              type="text"
              placeholder="背景信息（可选）"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
            />
            <Button
              onClick={handleGetAdvice}
              disabled={!message.trim() || isAnalyzing}
              className="w-full h-12 bg-purple-600 hover:bg-purple-500"
            >
              {isAnalyzing ? "分析中..." : "💡 获取精准建议"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}