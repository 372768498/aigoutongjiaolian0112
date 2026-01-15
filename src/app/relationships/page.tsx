"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Relationship {
  id: string;
  person_name: string;
  relationship_type: string;
  emoji: string;
  goal?: string;
  learning_progress: number;
  conversation_count: number;
  updated_at: string;
}

export default function RelationshipsPage() {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRelationships();
  }, []);

  const loadRelationships = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/relationships", {
        headers: {
          "X-User-Id": "test-user-001"
        }
      });

      if (!response.ok) throw new Error("获取失败");

      const data = await response.json();
      setRelationships(data.relationships || []);
      setError(null);
    } catch (err) {
      console.error("[加载关系列表错误]:", err);
      setError("加载失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const getRelationshipTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      romantic: "恋爱关系",
      dating: "相亲/约会",
      workplace_boss: "职场上级",
      workplace_colleague: "职场同事",
      friend: "朋友",
      family: "家人"
    };
    return labels[type] || type;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "from-green-500 to-emerald-500";
    if (progress >= 60) return "from-blue-500 to-cyan-500";
    if (progress >= 40) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
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
              <h1 className="text-lg md:text-xl font-bold text-white">📚 关系管理</h1>
            </div>
            <Link href="/relationships/new">
              <Button className="bg-purple-600 hover:bg-purple-500 h-9 md:h-10">
                <span className="text-base md:text-lg">+</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* 加载状态 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400">加载中...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && !isLoading && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={loadRelationships} className="bg-red-600 hover:bg-red-500">
              重试
            </Button>
          </div>
        )}

        {/* 空状态 */}
        {!isLoading && !error && relationships.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-white mb-2">还没有关系档案</h2>
            <p className="text-slate-400 mb-6">创建你的第一个关系，让 AI 开始学习吧！</p>
            <Link href="/relationships/new">
              <Button className="bg-purple-600 hover:bg-purple-500">
                🎉 创建第一个关系
              </Button>
            </Link>
          </div>
        )}

        {/* 关系列表 */}
        {!isLoading && !error && relationships.length > 0 && (
          <div className="space-y-3">
            {relationships.map((rel) => (
              <Link key={rel.id} href={`/relationships/${rel.id}`}>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:bg-slate-800/50 transition-all">
                  <div className="flex items-start gap-3">
                    {/* Emoji */}
                    <div className="flex-shrink-0 text-3xl md:text-4xl">
                      {rel.emoji}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-base md:text-lg font-semibold text-white">
                            {rel.person_name}
                          </h3>
                          <p className="text-xs md:text-sm text-slate-400">
                            {getRelationshipTypeLabel(rel.relationship_type)}
                          </p>
                        </div>
                        <span className="text-xs text-slate-500 flex-shrink-0">
                          {formatDate(rel.updated_at)}
                        </span>
                      </div>

                      {/* 目标 */}
                      {rel.goal && (
                        <p className="text-sm text-slate-300 mb-3 line-clamp-1">
                          🎯 {rel.goal}
                        </p>
                      )}

                      {/* 学习进度 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">学习进度</span>
                          <span className="text-white font-semibold">
                            {rel.learning_progress}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getProgressColor(rel.learning_progress)} transition-all`}
                            style={{ width: `${rel.learning_progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500">
                          已对话 {rel.conversation_count} 次
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 快捷操作 */}
        {!isLoading && relationships.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link href="/relationships/new">
              <Button
                variant="outline"
                className="w-full h-12 border-slate-600 text-slate-300"
              >
                + 新建关系
              </Button>
            </Link>
            <Link href="/screenshot">
              <Button
                variant="outline"
                className="w-full h-12 border-slate-600 text-slate-300"
              >
                📸 截图分析
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}