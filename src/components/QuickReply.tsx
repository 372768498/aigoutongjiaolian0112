"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SceneType } from "@/components/SceneSelector";

interface QuickReply {
  id: string;
  type: "caring" | "companionship" | "topic_change" | "apology" | "humor" | "question";
  content: string;
  explanation: string;
  suitable_for: string;
  risk_level: "safe" | "medium" | "risky";
}

interface QuickReplyResponse {
  replies: QuickReply[];
  recommended: string;
  context_analysis: string;
}

interface QuickReplyPanelProps {
  sceneType?: SceneType;
  context?: string;
}

const TYPE_LABELS = {
  caring: "关心型",
  companionship: "陪伴型",
  topic_change: "话题转换型",
  apology: "道歉型",
  humor: "幽默型",
  question: "提问型"
};

const RISK_COLORS = {
  safe: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  risky: "bg-red-500/20 text-red-400 border-red-500/30"
};

const RISK_LABELS = {
  safe: "安全",
  medium: "中等",
  risky: "需谨慎"
};

export default function QuickReplyPanel({ sceneType, context }: QuickReplyPanelProps) {
  const [latestMessage, setLatestMessage] = useState("");
  const [result, setResult] = useState<QuickReplyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGetReplies = async () => {
    if (!latestMessage.trim()) {
      setError("请输入对方的最新消息");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/quick-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latest_message: latestMessage,
          scene_type: sceneType,
          context: context
        }),
      });

      if (!response.ok) {
        throw new Error("获取回复建议失败");
      }

      const data: QuickReplyResponse = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error:", err);
      setError("获取回复建议失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("复制失败:", error);
    }
  };

  const handleRefresh = () => {
    if (latestMessage.trim()) {
      handleGetReplies();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              💬 快速回复建议
            </h3>
            <p className="text-sm text-slate-400">
              对方发了消息，不知道怎么回？让 AI 给你 3-5 个选项
            </p>
          </div>

          <Textarea
            placeholder="粘贴对方的最新消息...&#10;例如：我今天心情不太好"
            value={latestMessage}
            onChange={(e) => setLatestMessage(e.target.value)}
            className="min-h-[100px] bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
          />

          <Button
            onClick={handleGetReplies}
            disabled={!latestMessage.trim() || loading}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                AI 正在思考...
              </>
            ) : (
              <>
                <span className="mr-2">✨</span>
                获取回复建议
              </>
            )}
          </Button>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {/* 情况分析 */}
          {result.context_analysis && (
            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 text-lg">💡</span>
                  <div>
                    <p className="text-sm font-medium text-blue-300 mb-1">情况分析</p>
                    <p className="text-sm text-slate-300">{result.context_analysis}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 回复选项 */}
          <div className="space-y-3">
            {result.replies.map((reply, index) => {
              const isRecommended = reply.id === result.recommended;

              return (
                <Card 
                  key={reply.id}
                  className={`bg-slate-900/50 border-slate-800 ${
                    isRecommended ? "ring-2 ring-violet-500" : ""
                  }`}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* 标题栏 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-white">
                          {index + 1}
                        </span>
                        <Badge variant="outline" className="bg-violet-500/20 text-violet-300 border-violet-500/30">
                          {TYPE_LABELS[reply.type]}
                        </Badge>
                        <Badge variant="outline" className={RISK_COLORS[reply.risk_level]}>
                          {RISK_LABELS[reply.risk_level]}
                        </Badge>
                        {isRecommended && (
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                            ⭐ 推荐
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* 回复内容 */}
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="text-slate-200 text-base leading-relaxed">
                        {reply.content}
                      </p>
                    </div>

                    {/* 详细信息 */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 shrink-0">💡 为什么:</span>
                        <span className="text-slate-300">{reply.explanation}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 shrink-0">✅ 适用:</span>
                        <span className="text-slate-300">{reply.suitable_for}</span>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCopy(reply.content, reply.id)}
                        className="flex-1 bg-violet-600 hover:bg-violet-700"
                      >
                        {copiedId === reply.id ? (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            已复制
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            复制回复
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* 换一批按钮 */}
          <div className="text-center">
            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <svg className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              换一批建议
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
