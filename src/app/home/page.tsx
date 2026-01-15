"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <span className="text-xl">💬</span>
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-white">AI 沟通教练</h1>
                <p className="text-xs text-slate-400">让每一句话都说到心坎里</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
            像朋友一样<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">理解你</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 px-4">
            快速获得沟通建议 · 或创建专属档案让 AI 越来越懂你
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* 🆕 多 Agent 聊天界面 */}
          <Link href="/chat">
            <div className="group relative bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-2xl p-6 md:p-8 hover:from-violet-600/30 hover:to-fuchsia-600/30 transition-all cursor-pointer overflow-hidden min-h-[200px] md:min-h-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all"></div>
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-4xl md:text-5xl">🤝</span>
                  <span className="px-2 py-0.5 bg-violet-500/30 text-violet-300 text-xs rounded-full">v2.0 NEW</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">多 Agent 顾问团</h3>
                <p className="text-slate-300 mb-3 md:mb-4">
                  5位顾问协作，给你不同视角的建议
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <span>🎯</span>
                    <span>场景分析师 - 识别关系动态</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🤗😄😎💪</span>
                    <span>4种风格顾问 - 多角度建议</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    记住每段关系，越用越懂你
                  </li>
                </ul>
                
                <div className="mt-4 md:mt-6 flex items-center text-violet-400 font-medium group-hover:translate-x-2 transition-transform">
                  立即体验
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* 快速回复 */}
          <Link href="/quick-reply">
            <div className="group relative bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6 md:p-8 hover:from-blue-600/30 hover:to-cyan-600/30 transition-all cursor-pointer overflow-hidden min-h-[200px] md:min-h-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
              
              <div className="relative">
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">🚀</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">快速回复</h3>
                <p className="text-slate-300 mb-3 md:mb-4">
                  紧急情况，3秒给建议
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    无需登录，立即使用
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    3秒响应，3个建议
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    60-70分质量
                  </li>
                </ul>
                
                <div className="mt-4 md:mt-6 flex items-center text-blue-400 font-medium group-hover:translate-x-2 transition-transform">
                  立即开始
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* 我的关系 */}
        <Link href="/relationships">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 md:p-6 hover:border-slate-700 transition-all cursor-pointer mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💎</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-base md:text-lg">我的关系</h4>
                  <p className="text-sm text-slate-400">管理多个关系档案，AI 学习对话历史</p>
                </div>
              </div>
              <svg className="w-5 h-5 md:w-6 md:h-6 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Screenshot Upload CTA */}
        <Link href="/screenshot">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 md:p-6 hover:border-slate-700 transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📸</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-base md:text-lg">从截图开始</h4>
                  <p className="text-sm text-slate-400">快速创建新的关系档案</p>
                </div>
              </div>
              <svg className="w-5 h-5 md:w-6 md:h-6 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Features */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 md:p-6">
            <div className="text-4xl mb-2 md:mb-3">⚡</div>
            <h4 className="font-semibold text-white mb-2 text-base md:text-lg">快速响应</h4>
            <p className="text-sm text-slate-400">3秒内获得建议，不错过任何对话时机</p>
          </div>
          <div className="text-center p-4 md:p-6">
            <div className="text-4xl mb-2 md:mb-3">🎯</div>
            <h4 className="font-semibold text-white mb-2 text-base md:text-lg">精准建议</h4>
            <p className="text-sm text-slate-400">基于关系档案，提供个性化沟通策略</p>
          </div>
          <div className="text-center p-4 md:p-6">
            <div className="text-4xl mb-2 md:mb-3">📈</div>
            <h4 className="font-semibold text-white mb-2 text-base md:text-lg">持续学习</h4>
            <p className="text-sm text-slate-400">越用越懂你，建议质量不断提升</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs md:text-sm text-slate-500">
          <p>AI 沟通教练 · 让每一句话都说到心坎里</p>
          <p className="mt-1">建议仅供参考 · 真诚沟通最重要</p>
        </div>
      </footer>
    </div>
  );
}
