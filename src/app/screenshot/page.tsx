"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

interface AnalysisResult {
  personName?: string;
  relationshipType?: string;
  communicationStyle?: {
    vocabulary: string[];
    sentenceLength: "short" | "medium" | "long";
    emojiUsage: "frequent" | "occasional" | "rare";
    tone: string;
  };
  suggestedGoal?: string;
  suggestedPersona?: string[];
}

export default function ScreenshotPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [step, setStep] = useState<"upload" | "analyze" | "confirm">("upload");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > 5) {
      alert("最多只能上传 5 张截图");
      return;
    }

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [images.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxSize: 10 * 1024 * 1024,
  });

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (images.length === 0) return;

    setIsAnalyzing(true);
    setStep("analyze");

    try {
      // TODO: 调用 AI 分析接口
      // const response = await fetch("/api/analyze-screenshot", {...});
      
      // 模拟分析结果
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setAnalysisResult({
        personName: "男友",
        relationshipType: "romantic",
        communicationStyle: {
          vocabulary: ["宝贝", "呀", "哈哈"],
          sentenceLength: "short",
          emojiUsage: "frequent",
          tone: "温柔"
        },
        suggestedGoal: "推进关系发展",
        suggestedPersona: ["独立", "温柔", "体贴"]
      });
      
      setStep("confirm");
    } catch (error) {
      alert("分析失败，请重试");
      setStep("upload");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateRelationship = async () => {
    // TODO: 创建关系
    router.push("/relationships");
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
              <div>
                <h1 className="text-lg md:text-xl font-bold text-white">📸 截图分析</h1>
                <p className="text-xs text-slate-400">智能识别，快速建档</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* 步骤1: 上传截图 */}
        {step === "upload" && (
          <div className="space-y-6">
            {/* 介绍卡片 */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-4 md:p-6">
              <div className="flex items-start gap-3">
                <span className="text-3xl">✨</span>
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">智能分析聊天截图</h2>
                  <p className="text-sm text-slate-300 mb-3">
                    AI 会自动识别：
                  </p>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li>• 👤 对方的称呼和关系类型</li>
                    <li>• 💬 你们的沟通风格和常用词</li>
                    <li>• 🎯 建议的目标和人设</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 上传区域 */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-all cursor-pointer ${
                isDragActive
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg text-white font-semibold mb-1">
                    {isDragActive ? "释放上传" : "点击或拖拽截图"}
                  </p>
                  <p className="text-sm text-slate-400">
                    支持 PNG/JPG，最多 5 张，单张不超过 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* 预览区域 */}
            {images.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-3">
                  已上传 {images.length}/5
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative group aspect-[3/4] rounded-lg overflow-hidden bg-slate-800">
                      <img
                        src={img}
                        alt={`截图 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 分析按钮 */}
            <Button
              onClick={handleAnalyze}
              disabled={images.length === 0 || isAnalyzing}
              className="w-full h-12 bg-purple-600 hover:bg-purple-500 disabled:opacity-50"
            >
              {isAnalyzing ? "分析中..." : "🔍 开始分析"}
            </Button>
          </div>
        )}

        {/* 步骤2: 分析中 */}
        {step === "analyze" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">🧠 AI 正在分析...</h2>
            <p className="text-slate-400 text-center">
              识别聊天内容、分析沟通风格<br/>
              预计需要 10-15 秒
            </p>
          </div>
        )}

        {/* 步骤3: 确认结果 */}
        {step === "confirm" && analysisResult && (
          <div className="space-y-6">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="font-semibold text-green-400">分析完成！</h3>
                  <p className="text-sm text-slate-300">请检查并确认以下信息</p>
                </div>
              </div>
            </div>

            {/* 分析结果 */}
            <div className="space-y-4">
              {/* 基本信息 */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-3">👤 基本信息</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">称呼：</span>
                    <span className="text-white">{analysisResult.personName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">关系：</span>
                    <span className="text-white">
                      {analysisResult.relationshipType === "romantic" && "恋爱关系"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 沟通风格 */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-3">💬 沟通风格</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">常用词汇</p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.communicationStyle?.vocabulary.map((word, i) => (
                        <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">句子长度</p>
                      <p className="text-white">
                        {analysisResult.communicationStyle?.sentenceLength === "short" && "短句"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Emoji</p>
                      <p className="text-white">
                        {analysisResult.communicationStyle?.emojiUsage === "frequent" && "频繁使用"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">语气</p>
                    <p className="text-white text-sm">{analysisResult.communicationStyle?.tone}</p>
                  </div>
                </div>
              </div>

              {/* AI 建议 */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-3">🎯 AI 建议</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-slate-400 mb-1">建议目标：</p>
                    <p className="text-white">{analysisResult.suggestedGoal}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">建议人设：</p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.suggestedPersona?.map((persona, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                          {persona}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setStep("upload");
                  setAnalysisResult(null);
                }}
                variant="outline"
                className="flex-1 h-12 border-slate-600 text-slate-300"
              >
                重新分析
              </Button>
              <Button
                onClick={handleCreateRelationship}
                className="flex-1 h-12 bg-purple-600 hover:bg-purple-500"
              >
                🎉 创建档案
              </Button>
            </div>

            <p className="text-xs text-slate-500 text-center">
              创建后可以随时调整这些信息
            </p>
          </div>
        )}
      </main>
    </div>
  );
}