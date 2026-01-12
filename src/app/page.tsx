"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface EmotionData {
  primary: string;
  secondary?: string;
  intensity: number;
}

interface Problem {
  type: string;
  description: string;
  severity: "high" | "medium" | "low";
}

interface Script {
  step: number;
  content: string;
  explanation: string;
}

interface Strategy {
  name: string;
  description: string;
  scenario: string;
  rating: number;
  risks: string;
  scripts: Script[];
}

interface AnalysisResult {
  emotions: {
    user: EmotionData;
    other: EmotionData;
  };
  problems: Problem[];
  strategies: Strategy[];
  summary: string;
}

export default function ChatAnalysisApp() {
  const [images, setImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [context, setContext] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPreviews: string[] = [];
    const newImages: string[] = [];

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        newPreviews.push(base64);
        // 移除 data:image/xxx;base64, 前缀
        newImages.push(base64.split(",")[1]);
        
        if (newPreviews.length === acceptedFiles.length) {
          setPreviews((prev) => [...prev, ...newPreviews]);
          setImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 5,
  });

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const analyze = async () => {
    if (images.length === 0) {
      setError("请先上传聊天截图");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setProgress(0);
    setResult(null);
    setSelectedStrategy(null);

    // 模拟进度
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 500);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images, context }),
      });

      if (!response.ok) {
        throw new Error("分析请求失败");
      }

      const data = await response.json();
      setResult(data);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "分析失败，请重试");
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImages([]);
    setPreviews([]);
    setContext("");
    setResult(null);
    setSelectedStrategy(null);
    setError(null);
    setProgress(0);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <span className="text-xl">💬</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI 沟通教练</h1>
                <p className="text-xs text-slate-400">看懂对方 · 学会表达</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!result ? (
          /* 上传区域 */
          <div className="space-y-6">
            {/* 上传卡片 */}
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                📸 上传聊天截图
              </h2>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/50"
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-4xl mb-3">📤</div>
                <p className="text-slate-300 mb-1">
                  {isDragActive ? "松开即可上传" : "拖拽截图到这里，或点击选择"}
                </p>
                <p className="text-sm text-slate-500">
                  支持 PNG、JPG、WEBP，最多5张
                </p>
              </div>

              {/* 预览区域 */}
              {previews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`截图 ${index + 1}`}
                        className="w-full aspect-[3/4] object-cover rounded-lg border border-slate-700"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* 背景信息 */}
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                📝 补充背景（可选）
              </h2>
              <Textarea
                placeholder="简单描述一下情况，比如：我们是情侣，因为异地吵架了...&#10;这会帮助 AI 更准确地分析"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 min-h-[100px]"
              />
            </Card>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
                {error}
              </div>
            )}

            {/* 分析按钮 */}
            <Button
              onClick={analyze}
              disabled={isAnalyzing || images.length === 0}
              className="w-full h-14 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> 正在分析...
                </span>
              ) : (
                "🔍 开始分析"
              )}
            </Button>

            {/* 进度条 */}
            {isAnalyzing && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-slate-400 text-center">
                  AI 正在分析你们的对话...
                </p>
              </div>
            )}
          </div>
        ) : (
          /* 分析结果 */
          <div className="space-y-6">
            {/* 情绪诊断 */}
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                🎭 情绪诊断
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-2">你的情绪</p>
                  <p className="text-xl font-semibold text-violet-400">
                    {result.emotions?.user?.primary || "未检测到"}
                  </p>
                  {result.emotions?.user?.secondary && (
                    <p className="text-sm text-slate-400 mt-1">
                      次要：{result.emotions.user.secondary}
                    </p>
                  )}
                  {result.emotions?.user?.intensity && (
                    <div className="mt-2">
                      <Progress 
                        value={result.emotions.user.intensity * 10} 
                        className="h-1.5" 
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        强度：{result.emotions.user.intensity}/10
                      </p>
                    </div>
                  )}
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-2">对方情绪</p>
                  <p className="text-xl font-semibold text-fuchsia-400">
                    {result.emotions?.other?.primary || "未检测到"}
                  </p>
                  {result.emotions?.other?.secondary && (
                    <p className="text-sm text-slate-400 mt-1">
                      次要：{result.emotions.other.secondary}
                    </p>
                  )}
                  {result.emotions?.other?.intensity && (
                    <div className="mt-2">
                      <Progress 
                        value={result.emotions.other.intensity * 10} 
                        className="h-1.5" 
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        强度：{result.emotions.other.intensity}/10
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* 问题识别 */}
            {result.problems && result.problems.length > 0 && (
              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  ⚠️ 沟通问题
                </h2>
                <div className="space-y-3">
                  {result.problems.map((problem, index) => (
                    <div
                      key={index}
                      className="bg-slate-800/50 rounded-lg p-4 flex items-start gap-3"
                    >
                      <Badge
                        variant="outline"
                        className={getSeverityColor(problem.severity)}
                      >
                        {problem.severity === "high"
                          ? "严重"
                          : problem.severity === "medium"
                          ? "中等"
                          : "轻微"}
                      </Badge>
                      <div>
                        <p className="font-medium text-slate-200">
                          {problem.type}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                          {problem.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 策略推荐 */}
            {result.strategies && result.strategies.length > 0 && (
              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  💡 策略推荐
                </h2>
                <div className="space-y-3">
                  {result.strategies.map((strategy, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        setSelectedStrategy(
                          selectedStrategy === index ? null : index
                        )
                      }
                      className={`bg-slate-800/50 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedStrategy === index
                          ? "ring-2 ring-violet-500"
                          : "hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-200">
                            {strategy.name}
                          </p>
                          <p className="text-sm text-slate-400 mt-1">
                            {strategy.description}
                          </p>
                        </div>
                        <div className="flex text-yellow-500 text-xs">
                          {"★".repeat(strategy.rating)}
                        </div>
                      </div>

                      {selectedStrategy === index && (
                        <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
                          <div>
                            <p className="text-sm font-medium text-slate-300">
                              📌 适用场景
                            </p>
                            <p className="text-sm text-slate-400 mt-1">
                              {strategy.scenario}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-300">
                              ⚠️ 风险提示
                            </p>
                            <p className="text-sm text-slate-400 mt-1">
                              {strategy.risks}
                            </p>
                          </div>
                          {strategy.scripts && strategy.scripts.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-slate-300 mb-2">
                                💬 话术指导
                              </p>
                              <div className="space-y-3">
                                {strategy.scripts.map((script) => (
                                  <div
                                    key={script.step}
                                    className="bg-slate-900/50 rounded-lg p-3"
                                  >
                                    <p className="text-sm text-violet-400 mb-1">
                                      第 {script.step} 步
                                    </p>
                                    <p className="text-slate-200">
                                      "{script.content}"
                                    </p>
                                    <p className="text-sm text-slate-500 mt-2">
                                      💡 {script.explanation}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 总结 */}
            {result.summary && (
              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  📋 总结建议
                </h2>
                <p className="text-slate-300 leading-relaxed">{result.summary}</p>
              </Card>
            )}

            {/* 重新分析按钮 */}
            <Button
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
              onClick={reset}
            >
              分析下一张
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>AI 沟通教练 · 让沟通更简单</p>
          <p className="mt-1">分析结果仅供参考，不构成专业心理咨询建议</p>
        </div>
      </footer>
    </div>
  );
}
