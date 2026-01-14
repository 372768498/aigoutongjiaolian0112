"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Reply {
  id: string;
  content: string;
  strategy: string;
  whyThis: string;
  riskLevel: string;
}

interface Conversation {
  id: string;
  theirMessage: string;
  replies: Reply[];
  usedReplyId?: string;
  effectiveness?: "success" | "failed" | "neutral";
  createdAt: string;
}

interface Relationship {
  id: string;
  personName: string;
  relationshipType: string;
  goal?: string;
  desiredPersona?: string[];
  learningProgress: number;
  conversationCount: number;
  emoji: string;
}

export default function RelationshipDetailPage() {
  const params = useParams();
  const relationshipId = params?.id as string;

  // 示例数据（后续从 API 加载）
  const [relationship] = useState<Relationship>({
    id: relationshipId,
    personName: "男友",
    relationshipType: "romantic",
    goal: "推进到同居阶段",
    desiredPersona: ["独立", "温柔", "不作"],
    learningProgress: 75,
    conversationCount: 12,
    emoji: "💑"
  });

  // 示例对话历史
  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      theirMessage: "随便你",
      replies: [
        {
          id: "r1",
          content: "宝贝你是对哪部分有疑问呀？",
          strategy: "主动澄清",
          whyThis: "符合你的温柔人设",
          riskLevel: "low"
        }
      ],
      usedReplyId: "r1",
      effectiveness: "success",
      createdAt: "2小时前"
    },
    {
      id: "2",
      theirMessage: "今天好累",
      replies: [
        {
          id: "r2",
          content: "宝贝辛苦了！要不要我给你按按肩呀？😊",
          strategy: "撒娇式关心",
          whyThis: "用撒娇表达关心",
          riskLevel: "low"
        }
      ],
      usedReplyId: "r2",
      effectiveness: "success",
      createdAt: "昨天"
    }
  ]);

  const [showProfile, setShowProfile] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentReplies, setCurrentReplies] = useState<Reply[] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "from-green-500 to-emerald-500";
    if (progress >= 60) return "from-blue-500 to-cyan-500";
    if (progress >= 40) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const handleGetAdvice = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/quick-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theirMessage: newMessage,
          relationshipId: relationshipId
        }),
      });

      if (!response.ok) throw new Error("获取建议失败");

      const data = await response.json();
      setCurrentReplies(data.replies || []);
    } catch (error) {
      alert("获取建议失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (reply: Reply) => {
    try {
      await navigator.clipboard.writeText(reply.content);
      setCopiedId(reply.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      alert("复制失败");
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "high": return "text-red-400";
      default: return "text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
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
                <span className="text-2xl md:text-3xl">{relationship.emoji}</span>
                <h1 className="text-lg md:text-xl font-bold text-white">{relationship.personName}</h1>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8 pb-32">
        {/* 档案信息 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl mb-4 md:mb-6 overflow-hidden">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">📋</span>
              <span className="font-semibold text-white text-sm md:text-base">档案信息</span>
            </div>
            <svg
              className={`w-5 h-5 text-slate-400 transition-transform ${
                showProfile ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showProfile && (
            <div className="p-4 pt-0 space-y-3 text-sm">
              <div>
                <p className="text-slate-400 mb-1">关系类型</p>
                <p className="text-white">
                  {relationship.relationshipType === 'romantic' && '恋爱关系'}
                  {relationship.relationshipType === 'workplace_boss' && '职场上级'}
                  {relationship.relationshipType === 'friend' && '朋友'}
                </p>
              </div>

              {relationship.goal && (
                <div>
                  <p className="text-slate-400 mb-1">我的目标</p>
                  <p className="text-white">{relationship.goal}</p>
                </div>
              )}

              {relationship.desiredPersona && relationship.desiredPersona.length > 0 && (
                <div>
                  <p className="text-slate-400 mb-1">期望人设</p>
                  <div className="flex flex-wrap gap-2">
                    {relationship.desiredPersona.map((persona, i) => (
                      <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                        {persona}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400">学习进度</p>
                  <p className="text-white font-semibold">{relationship.learningProgress}%</p>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressColor(relationship.learningProgress)} transition-all`}
                    style={{ width: `${relationship.learningProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  已对话 {relationship.conversationCount} 次，AI 越来越懂你
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <p className="text-slate-400 mb-2 text-xs">AI 学到的：</p>
                <ul className="space-y-1 text-xs text-slate-300">
                  <li>• 对方喜欢直接表达</li>
                  <li>• 撒娇策略有效（80%成功率）</li>
                  <li>• 避免被动语气</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 对话历史 */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-400 mb-3 px-1">💬 对话历史</h2>
          <div className="space-y-4">
            {conversations.map((conv) => (
              <div key={conv.id} className="space-y-2">
                <p className="text-xs text-slate-500 text-center">{conv.createdAt}</p>
                
                {/* 对方消息 */}
                <div className="flex justify-start">
                  <div className="bg-slate-800/50 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%]">
                    <p className="text-slate-200 text-sm">{conv.theirMessage}</p>
                  </div>
                </div>

                {/* AI 建议 */}
                {conv.usedReplyId && (
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                      <div className="flex items-start gap-2 mb-1">
                        <span className="text-xs">💡</span>
                        <p className="text-xs text-purple-400">
                          AI建议：{conv.replies.find(r => r.id === conv.usedReplyId)?.strategy}
                        </p>
                      </div>
                      <p className="text-slate-200 text-sm">
                        {conv.replies.find(r => r.id === conv.usedReplyId)?.content}
                      </p>
                      {conv.effectiveness && (
                        <div className="mt-2 pt-2 border-t border-purple-500/20">
                          <span className={`text-xs ${
                            conv.effectiveness === 'success' ? 'text-green-400' :
                            conv.effectiveness === 'failed' ? 'text-red-400' :
                            'text-slate-400'
                          }`}>
                            {conv.effectiveness === 'success' && '✅ 效果好'}
                            {conv.effectiveness === 'failed' && '❌ 效果不好'}
                            {conv.effectiveness === 'neutral' && '⏸️ 一般'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 当前建议 */}
        {currentReplies && currentReplies.length > 0 && (
          <div className="mb-4 space-y-3">
            <h3 className="text-sm font-semibold text-white px-1">💡 AI 建议</h3>
            {currentReplies.map((reply, index) => (
              <div
                key={reply.id}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-semibold text-white">建议 {index + 1}</span>
                  <button
                    onClick={() => copyToClipboard(reply)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs"
                  >
                    {copiedId === reply.id ? "✓ 已复制" : "📋 复制"}
                  </button>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 mb-2">
                  <p className="text-slate-200">{reply.content}</p>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-slate-400">🎯 {reply.whyThis}</p>
                  <p className={getRiskColor(reply.riskLevel)}>
                    ⚠️ 风险：{reply.riskLevel === 'low' ? '低' : reply.riskLevel === 'medium' ? '中' : '高'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 底部输入框 */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="💬 他/她现在说了什么？"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 min-h-[44px] max-h-[120px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGetAdvice();
                }
              }}
            />
            <Button
              onClick={handleGetAdvice}
              disabled={isLoading || !newMessage.trim()}
              className="bg-purple-600 hover:bg-purple-500 h-[44px] px-4 flex-shrink-0"
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <span>💎</span>
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            基于你的档案，生成高质量建议
          </p>
        </div>
      </div>
    </div>
  );
}