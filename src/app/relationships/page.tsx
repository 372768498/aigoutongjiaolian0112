"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RelationshipsPage() {
  // 示例数据（后续从 API 加载）
  const [relationships] = useState([
    {
      id: "1",
      personName: "男友",
      relationshipType: "romantic",
      goal: "推进到同居阶段",
      learningProgress: 75,
      conversationCount: 12,
      lastConversationAt: "2小时前",
      emoji: "💑"
    },
    {
      id: "2",
      personName: "张总",
      relationshipType: "workplace_boss",
      goal: "获得项目支持",
      learningProgress: 60,
      conversationCount: 8,
      lastConversationAt: "昨天",
      emoji: "💼"
    },
    {
      id: "3",
      personName: "闺蜜小美",
      relationshipType: "friend",
      goal: "保持友谊",
      learningProgress: 45,
      conversationCount: 5,
      lastConversationAt: "3天前",
      emoji: "👫"
    }
  ]);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "from-green-500 to-emerald-500";
    if (progress >= 60) return "from-blue-500 to-cyan-500";
    if (progress >= 40) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
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
                <span className="text-xl md:text-2xl">💎</span>
                <h1 className="text-lg md:text-xl font-bold text-white">我的关系</h1>
              </div>
            </div>
            <Link href="/relationships/new">
              <Button className="bg-purple-600 hover:bg-purple-500 h-9 md:h-10 px-3 md:px-4 text-sm md:text-base">
                + 新建
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* 搜索框 */}
        <div className="mb-4 md:mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 搜索关系..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 md:py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-700 text-sm md:text-base"
            />
          </div>
        </div>

        {/* 关系列表 */}
        {relationships.length === 0 ? (
          /* 空状态 */
          <div className="text-center py-12 md:py-16">
            <div className="text-5xl md:text-6xl mb-4">💔</div>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">还没有关系档案</h3>
            <p className="text-sm md:text-base text-slate-400 mb-6 px-4">创建你的第一个关系，让 AI 开始学习和成长！</p>
            <Link href="/relationships/new">
              <Button className="bg-purple-600 hover:bg-purple-500 h-12 px-6">
                🎉 创建第一个关系
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {relationships.map((rel) => (
              <Link key={rel.id} href={`/relationships/${rel.id}`}>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 md:p-6 hover:border-slate-700 hover:bg-slate-900/70 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-3xl md:text-4xl flex-shrink-0">{rel.emoji}</span>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">{rel.personName}</h3>
                        <p className="text-xs md:text-sm text-slate-400">
                          {rel.relationshipType === 'romantic' && '恋爱关系'}
                          {rel.relationshipType === 'workplace_boss' && '职场上级'}
                          {rel.relationshipType === 'friend' && '朋友'}
                          {" · "}
                          目标：{rel.goal}
                        </p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {/* 学习进度 */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs md:text-sm mb-2">
                      <span className="text-slate-400">学习进度</span>
                      <span className="text-white font-semibold">{rel.learningProgress}%</span>
                    </div>
                    <div className="w-full h-2 md:h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getProgressColor(rel.learningProgress)} transition-all`}
                        style={{ width: `${rel.learningProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* 统计信息 */}
                  <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-slate-400">
                    <span>💬 {rel.conversationCount}次对话</span>
                    <span>🕒 最后对话: {rel.lastConversationAt}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 底部提示 */}
        {relationships.length > 0 && (
          <div className="mt-6 md:mt-8 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 md:p-6">
            <div className="flex items-start gap-3 md:gap-4">
              <span className="text-2xl md:text-3xl flex-shrink-0">💡</span>
              <div>
                <h3 className="font-semibold text-purple-400 mb-2 text-sm md:text-base">如何让 AI 更懂你？</h3>
                <ul className="text-xs md:text-sm text-slate-300 space-y-1">
                  <li>• 每次对话后标注效果（成功/失败）</li>
                  <li>• 定期更新你的目标和期望人设</li>
                  <li>• 使用越多，建议越精准！</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}