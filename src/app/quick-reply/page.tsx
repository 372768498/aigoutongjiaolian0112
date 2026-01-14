"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Reply {
  id: string;
  content: string;
  strategy: string;
  strategyType: string;
  explanation: string;
  whyThis: string;
  riskLevel: string;
  riskReason: string;
  prediction: {
    scenario1: { probability: number; response: string };
    scenario2: { probability: number; response: string };
    scenario3: { probability: number; response: string };
  };
}

interface QuickReplyResponse {
  analysis: {
    emotion: string;
    intention: string;
    context: string;
  };
  suggestedStrategy: {
    name: string;
    type: string;
    reason: string;
  };
  replies: Reply[];
  recommendedReplyId: string;
}

export default function QuickReplyPage() {
  const [theirMessage, setTheirMessage] = useState("");
  const [context, setContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QuickReplyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!theirMessage.trim()) {
      setError("请输入对方说的话");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/quick-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theirMessage, context }),
      });

      if (!response.ok) {
        throw new Error("生成建议失败");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败，请重试");
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
      alert("复制失败，请手动复制");
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
              <Link href="/home" className="text-slate-400 hover:text-slate-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl">🚀</span>
                <h1 className="text-lg md:text-xl font-bold text-white">快速回复</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {!result ? (
          /* 输入区域 */
          <div className="space-y-4 md:space-y-6">
            {/* 提示信息 */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl md:text-2xl flex-shrink-0">💡</span>
                <div>
                  <h3 className="font-semibold text-blue-400 mb-1 text-sm md:text-base">快速模式</h3>
                  <p className="text-xs md:text-sm text-slate-300">
                    3秒内给出3个建议，无需登录，立即使用。适合紧急情况！
                  </p>
                </div>
              </div>
            </div>

            {/* 对方消息 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 md:p-6">
              <label className="block text-base md:text-lg font-semibold text-white mb-3">
                💬 对方说了什么？
              </label>
              <Textarea
                placeholder="例如：随便你"
                value={theirMessage}
                onChange={(e) => setTheirMessage(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 min-h-[100px] md:min-h-[120px] text-base md:text-lg"
              />
            </div>

            {/* 背景信息 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 md:p-6">
              <label className="block text-base md:text-lg font-semibold text-white mb-3">
                📝 补充背景（可选）
              </label>
              <Textarea
                placeholder="例如：正在讨论晚饭吃什么"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 min-h-[80px] text-sm md:text-base"
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm md:text-base">
                {error}
              </div>
            )}

            {/* 提交按钮 */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-12 md:h-14 text-base md:text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> 正在生成...
                </span>
              ) : (
                "⚡ 生成建议"
              )}
            </Button>

            {/* 升级提示 */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 md:p-6">
              <div className="flex items-start gap-3 md:gap-4">
                <span className="text-2xl md:text-3xl flex-shrink-0">💎</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-400 mb-2 text-sm md:text-base">想要更精准的建议？</h3>
                  <p className="text-xs md:text-sm text-slate-300 mb-3">
                    创建关系档案，AI 会越来越懂你，建议质量从 60-70分提升到 85-95分！
                  </p>
                  <Link href="/relationships">
                    <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 h-10 text-sm md:text-base">
                      创建我的关系档案
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 结果区域 */
          <div className="space-y-4 md:space-y-6">
            {/* 分析结果 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-white mb-4">🎯 综合分析</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-sm">
                <div>
                  <p className="text-slate-400 mb-1">对方情绪</p>
                  <p className="text-white font-medium">{result.analysis.emotion}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">对方意图</p>
                  <p className="text-white font-medium">{result.analysis.intention}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">推荐策略</p>
                  <p className="text-white font-medium">{result.suggestedStrategy.name}</p>
                </div>
              </div>
            </div>

            {/* 回复建议 */}
            <div className="space-y-3 md:space-y-4">
              {result.replies.map((reply, index) => (
                <div
                  key={reply.id}
                  className={`bg-slate-900/50 border rounded-xl p-4 md:p-6 ${
                    reply.id === result.recommendedReplyId
                      ? "border-blue-500/50 bg-blue-500/5"
                      : "border-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl md:text-2xl">💡</span>
                      <h3 className="font-semibold text-white text-sm md:text-base">
                        建议 {index + 1}
                        {reply.id === result.recommendedReplyId && (
                          <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                            推荐
                          </span>
                        )}
                      </h3>
                    </div>
                    <button
                      onClick={() => copyToClipboard(reply)}
                      className="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1 md:gap-2 text-sm flex-shrink-0"
                    >
                      {copiedId === reply.id ? (
                        <>✓ 已复制</>
                      ) : (
                        <>📋 复制</>
                      )}
                    </button>
                  </div>

                  {/* 回复内容 */}
                  <div className="bg-slate-800/50 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                    <p className="text-slate-200 text-base md:text-lg leading-relaxed">"{reply.content}"</p>
                  </div>

                  {/* 详细信息 */}
                  <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                    <div>
                      <p className="text-slate-400 mb-1">🎯 为什么这样说？</p>
                      <p className="text-slate-300">{reply.whyThis}</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className={`${getRiskColor(reply.riskLevel)} flex-shrink-0`}>⚠️</span>
                      <div>
                        <p className="text-slate-400">风险等级：<span className={getRiskColor(reply.riskLevel)}>{reply.riskLevel === 'low' ? '低' : reply.riskLevel === 'medium' ? '中' : '高'}</span></p>
                        <p className="text-slate-400 mt-1">{reply.riskReason}</p>
                      </div>
                    </div>

                    {/* 预测 */}
                    <div>
                      <p className="text-slate-400 mb-2">🔮 对方可能的反应：</p>
                      <div className="space-y-1">
                        <p className="text-slate-400">• {reply.prediction.scenario1.probability}%：{reply.prediction.scenario1.response}</p>
                        <p className="text-slate-400">• {reply.prediction.scenario2.probability}%：{reply.prediction.scenario2.response}</p>
                        <p className="text-slate-400">• {reply.prediction.scenario3.probability}%：{reply.prediction.scenario3.response}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <Button
                onClick={() => {
                  setResult(null);
                  setTheirMessage("");
                  setContext("");
                }}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 h-12"
              >
                重新开始
              </Button>
              <Link href="/relationships" className="flex-1">
                <Button className="w-full bg-purple-600 hover:bg-purple-500 h-12">
                  为这个关系创建档案
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}