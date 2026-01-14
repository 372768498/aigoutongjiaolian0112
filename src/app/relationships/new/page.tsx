"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const RELATIONSHIP_TYPES = [
  { value: "romantic", label: "💑 恋爱关系", emoji: "💑" },
  { value: "dating", label: "💕 相亲/约会", emoji: "💕" },
  { value: "workplace_boss", label: "💼 职场上级", emoji: "💼" },
  { value: "workplace_colleague", label: "🤝 职场同事", emoji: "🤝" },
  { value: "friend", label: "👫 朋友", emoji: "👫" },
  { value: "family", label: "👨‍👩‍👧 家人", emoji: "👨‍👩‍👧" },
];

const PERSONA_OPTIONS = [
  "独立",
  "温柔",
  "直接",
  "幽默",
  "成熟",
  "专业",
  "亲和",
  "坚定",
  "体贴",
  "理性",
];

const VOCABULARY_PRESETS = {
  romantic: ["宝贝", "呀", "哈哈", "唔唔", "亲爱的"],
  workplace: ["好的", "明白", "收到", "谢谢"],
  casual: ["哈哈", "呵呵", "好呀", "行"],
};

export default function NewRelationshipPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form data
  const [personName, setPersonName] = useState("");
  const [relationshipType, setRelationshipType] = useState("");
  const [goal, setGoal] = useState("");
  const [desiredPersona, setDesiredPersona] = useState<string[]>([]);
  const [vocabulary, setVocabulary] = useState<string[]>([]);
  const [customVocab, setCustomVocab] = useState("");
  const [sentenceLength, setSentenceLength] = useState<"short" | "medium" | "long">("medium");
  const [emojiUsage, setEmojiUsage] = useState<"frequent" | "occasional" | "rare">("occasional");
  const [tone, setTone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePersona = (persona: string) => {
    setDesiredPersona(prev =>
      prev.includes(persona)
        ? prev.filter(p => p !== persona)
        : [...prev, persona]
    );
  };

  const addCustomVocab = () => {
    if (customVocab.trim() && !vocabulary.includes(customVocab.trim())) {
      setVocabulary([...vocabulary, customVocab.trim()]);
      setCustomVocab("");
    }
  };

  const removeVocab = (word: string) => {
    setVocabulary(vocabulary.filter(w => w !== word));
  };

  const loadPreset = (preset: keyof typeof VOCABULARY_PRESETS) => {
    setVocabulary(VOCABULARY_PRESETS[preset]);
  };

  const handleSubmit = async () => {
    if (!personName || !relationshipType) {
      alert("请填写必填信息");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: 调用 API 创建关系
      // const response = await fetch("/api/relationships", {...});
      
      // 模拟成功
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 跳转到关系详情页
      router.push("/relationships/new-relationship-id");
    } catch (error) {
      alert("创建失败，请重试");
    } finally {
      setIsSubmitting(false);
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
              <div>
                <h1 className="text-lg md:text-xl font-bold text-white">新建关系</h1>
                <p className="text-xs text-slate-400">步骤 {step}/3</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* 进度条 */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    s <= step
                      ? "bg-purple-600 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      s < step ? "bg-purple-600" : "bg-slate-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>基本信息</span>
            <span>目标人设</span>
            <span>沟通风格</span>
          </div>
        </div>

        {/* 步骤1: 基本信息 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 md:p-6">
              <h2 className="text-lg font-semibold text-white mb-4">👤 基本信息</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    称呼 *
                  </label>
                  <input
                    type="text"
                    placeholder="例如：男友、张总、小美"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    关系类型 *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                    {RELATIONSHIP_TYPES.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setRelationshipType(type.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          relationshipType === type.value
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                        }`}
                      >
                        <div className="text-2xl mb-1">{type.emoji}</div>
                        <div className="text-sm text-slate-200">
                          {type.label.split(" ")[1]}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!personName || !relationshipType}
              className="w-full h-12 bg-purple-600 hover:bg-purple-500 disabled:opacity-50"
            >
              下一步
            </Button>
          </div>
        )}

        {/* 步骤2: 目标和人设 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 md:p-6">
              <h2 className="text-lg font-semibold text-white mb-4">🎯 目标人设</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    我的目标（可选）
                  </label>
                  <Textarea
                    placeholder="例如：推进到同居阶段、获得项目支持、保持友谊"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 min-h-[80px]"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    告诉 AI 你希望达成什么目标，帮你更好地沟通
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    期望展现的人设（选 2-4 个）
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PERSONA_OPTIONS.map((persona) => (
                      <button
                        key={persona}
                        onClick={() => togglePersona(persona)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          desiredPersona.includes(persona)
                            ? "bg-purple-600 text-white"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {persona}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    AI 会帮你生成符合这些特质的回复
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 h-12 border-slate-600 text-slate-300"
              >
                上一步
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 h-12 bg-purple-600 hover:bg-purple-500"
              >
                下一步
              </Button>
            </div>
          </div>
        )}

        {/* 步骤3: 沟通风格 */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-semibold text-blue-400 mb-1">为什么要设置风格？</h3>
                  <p className="text-sm text-slate-300">
                    告诉 AI 你平时怎么说话，生成的建议会<span className="text-blue-400 font-semibold">更像你自己说的</span>！
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 md:p-6 space-y-5">
              <h2 className="text-lg font-semibold text-white">💬 沟通风格</h2>
              
              {/* 常用词汇 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  常用词汇
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => loadPreset("romantic")}
                    className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                  >
                    恋爱预设
                  </button>
                  <button
                    onClick={() => loadPreset("workplace")}
                    className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                  >
                    职场预设
                  </button>
                  <button
                    onClick={() => loadPreset("casual")}
                    className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                  >
                    随意风
                  </button>
                </div>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="添加你的常用词..."
                    value={customVocab}
                    onChange={(e) => setCustomVocab(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomVocab()}
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                  />
                  <Button onClick={addCustomVocab} size="sm">添加</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vocabulary.map((word) => (
                    <span
                      key={word}
                      className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm flex items-center gap-1"
                    >
                      {word}
                      <button
                        onClick={() => removeVocab(word)}
                        className="hover:text-purple-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 句子长度 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  句子长度
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "short", label: "短句", desc: "5-10字" },
                    { value: "medium", label: "中等", desc: "10-20字" },
                    { value: "long", label: "长句", desc: "20+字" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSentenceLength(option.value as any)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        sentenceLength === option.value
                          ? "border-purple-500 bg-purple-500/20"
                          : "border-slate-700 bg-slate-800/30"
                      }`}
                    >
                      <div className="text-sm text-slate-200 font-medium">{option.label}</div>
                      <div className="text-xs text-slate-400 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Emoji 使用 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Emoji 使用频率
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "rare", label: "很少", desc: "正式风" },
                    { value: "occasional", label: "偶尔", desc: "自然风" },
                    { value: "frequent", label: "频繁", desc: "活泼风" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setEmojiUsage(option.value as any)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        emojiUsage === option.value
                          ? "border-purple-500 bg-purple-500/20"
                          : "border-slate-700 bg-slate-800/30"
                      }`}
                    >
                      <div className="text-sm text-slate-200 font-medium">{option.label}</div>
                      <div className="text-xs text-slate-400 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 语气 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  整体语气
                </label>
                <input
                  type="text"
                  placeholder="例如：温柔、直接、幽默、成熟..."
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1 h-12 border-slate-600 text-slate-300"
              >
                上一步
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 h-12 bg-purple-600 hover:bg-purple-500"
              >
                {isSubmitting ? "创建中..." : "🎉 完成创建"}
              </Button>
            </div>
          </div>
        )}

        {/* 跳过提示 */}
        {step < 3 && (
          <div className="text-center">
            <button
              onClick={() => setStep(3)}
              className="text-sm text-slate-500 hover:text-slate-400"
            >
              跳过，稍后补充 →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}