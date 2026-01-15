"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { QuickReplyResponse } from "@/types";

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

export default function RelationshipDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [context, setContext] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState<QuickReplyResponse | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
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
    setShowResults(false);
    setAiResponse(null);
    
    try {
      const response = await fetch("/api/quick-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theirMessage: message,
          context: context || undefined,
          relationshipId: id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "生成失败");
      }

      const data: QuickReplyResponse = await response.json();
      setAiResponse(data);
      setShowResults(true);
      
    } catch (error: any) {
      console.error("分析失败:", error);
      alert(error.message || "生成建议失败，请重试");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("已复制到剪贴板！");
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'low') return 'text-green-400 bg-green-500/20';
    if (risk === 'medium') return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getRiskLabel = (risk: string) => {
    if (risk === 'low') return '低风险';
    if (risk === 'medium') return '中风险';
    return '高风险';
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

      {/* 档案信息 */}
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

      {/* AI 建议结果 */}
      {showResults && aiResponse && (
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
          {/* 分析 */}
          {aiResponse.analysis && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-blue-400 mb-2">🧠 场景分析</h3>
              <div className="space-y-2 text-sm">
                {aiResponse.analysis.subtext && (
                  <p className="text-slate-300"><span className="text-slate-400">潜台词：</span>{aiResponse.analysis.subtext}</p>
                )}
                {aiResponse.analysis.emotion && (
                  <p className="text-slate-300"><span className="text-slate-400">情绪：</span>{aiResponse.analysis.emotion}</p>
                )}
                {aiResponse.analysis.risk && (
                  <p className="text-slate-300"><span className="text-slate-400">风险：</span>{aiResponse.analysis.risk}</p>
                )}
              </div>
            </div>
          )}

          {/* 回复选项 */}
          <div className="space-y-3">
            {aiResponse.replies?.map((reply, index) => (
              <div
                key={reply.id}
                className={`border rounded-xl p-4 ${
                  reply.id === aiResponse.recommendedReplyId
                    ? 'bg-purple-500/10 border-purple-500/50'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-white">策略 {index + 1}</span>
                    {reply.id === aiResponse.recommendedReplyId && (
                      <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded">推荐</span>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded ${getRiskColor(reply.riskLevel)}`}>
                    {getRiskLabel(reply.riskLevel)}
                  </span>
                </div>

                <p className="text-base text-white mb-3 leading-relaxed">{reply.content}</p>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    <span className="font-semibold">{reply.strategy}</span> · {reply.whyThis}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(reply.content)}
                    className="bg-slate-700 hover:bg-slate-600 text-white h-8"
                  >
                    复制
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* 额外提示 */}
          {aiResponse.tips && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <p className="text-sm text-slate-300">💡 {aiResponse.tips}</p>
            </div>
          )}
        </div>
      )}

      {/* 对话历史 */}
      {!showResults && (
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
      )}

      {/* 底部输入框 */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {!showResults ? (
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
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>AI 思考中...</span>
                  </div>
                ) : (
                  "💡 获取精准建议"
                )}
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => {
                setShowResults(false);
                setAiResponse(null);
                setMessage("");
                setContext("");
              }}
              variant="outline"
              className="w-full h-12 border-slate-600 text-slate-300"
            >
              ← 返回输入
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}