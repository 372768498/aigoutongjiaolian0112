"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const RELATIONSHIP_TYPES = [
  { value: "romantic", label: "💑 恋爱关系" },
  { value: "dating", label: "💕 相亲/约会" },
  { value: "workplace_boss", label: "💼 职场上级" },
  { value: "friend", label: "👫 朋友" },
];

export default function ScreenshotPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Step 1: Upload
  const [images, setImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  // Step 2: Recognition
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedConversation, setRecognizedConversation] = useState("");
  const [recognizedType, setRecognizedType] = useState("");
  const [recognizedStyle, setRecognizedStyle] = useState("");
  
  // Step 3: Confirm
  const [personName, setPersonName] = useState("");
  const [relationshipType, setRelationshipType] = useState("");
  const [goal, setGoal] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPreviews: string[] = [];
    const newImages: string[] = [];

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        newPreviews.push(base64);
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
    maxFiles: 3,
  });

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRecognize = async () => {
    if (images.length === 0) return;
    
    setIsRecognizing(true);
    try {
      // TODO: 调用 AI 识别 API
      // const response = await fetch("/api/recognize-screenshot", {...});
      
      // 模拟 AI 识别
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setRecognizedConversation(`对方：随便你
我：那我们吃什么呀？
对方：你决定吧
我：好的~`);
      setRecognizedType("恋爱关系");
      setRecognizedStyle("温柔、短句、喜欢用 emoji");
      setRelationshipType("romantic");
      
      setStep(2);
    } catch (error) {
      alert("识别失败，请重试");
    } finally {
      setIsRecognizing(false);
    }
  };

  const handleCreate = async () => {
    if (!personName || !relationshipType) {
      alert("请填写必填信息");
      return;
    }
    
    setIsCreating(true);
    try {
      // TODO: 调用 API 创建关系
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push("/relationships/new-relationship-id");
    } catch (error) {
      alert("创建失败，请重试");
    } finally {
      setIsCreating(false);
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
                <span className="text-2xl">📸</span>
                <h1 className="text-lg md:text-xl font-bold text-white">从截图开始</h1>
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
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      s < step ? "bg-emerald-600" : "bg-slate-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>上传截图</span>
            <span>AI 识别</span>
            <span>确认创建</span>
          </div>
        </div>

        {/* Step 1: 上传截图 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-semibold text-emerald-400 mb-1">智能识别</h3>
                  <p className="text-sm text-slate-300">
                    上传聊天截图，AI 自动识别对话内容和关系类型，帮你快速创建档案！
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/50"
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-5xl mb-4">📸</div>
                <p className="text-slate-300 mb-2 text-base md:text-lg">
                  {isDragActive ? "松开即可上传" : "拖拽截图到这里，或点击选择"}
                </p>
                <p className="text-sm text-slate-500">
                  支持 PNG、JPG、WEBP，最多3张
                </p>
              </div>

              {previews.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`截图 ${index + 1}`}
                        className="w-full aspect-[3/4] object-cover rounded-lg border border-slate-700"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleRecognize}
              disabled={isRecognizing || images.length === 0}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
            >
              {isRecognizing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> AI 识别中...
                </span>
              ) : (
                "🤖 开始识别"
              )}
            </Button>
          </div>
        )}

        {/* Step 2: 识别结果 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">🤖 AI 识别结果</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">对话内容</label>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-slate-400 hover:text-slate-300"
                    >
                      ← 重新上传
                    </button>
                  </div>
                  <Textarea
                    value={recognizedConversation}
                    onChange={(e) => setRecognizedConversation(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-slate-200 min-h-[120px]"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    可以修改 AI 识别的内容
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    关系类型
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-slate-200">AI 推测：{recognizedType}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    说话风格
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-slate-200">{recognizedStyle}</span>
                  </div>
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
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500"
              >
                下一步
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: 确认创建 */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">🎯 完善档案</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    称呼 *
                  </label>
                  <input
                    type="text"
                    placeholder="例如：男友、小美、张总"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    关系类型 *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {RELATIONSHIP_TYPES.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setRelationshipType(type.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          relationshipType === type.value
                            ? "border-emerald-500 bg-emerald-500/20"
                            : "border-slate-700 bg-slate-800/30"
                        }`}
                      >
                        <div className="text-sm text-slate-200">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    我的目标（可选）
                  </label>
                  <Textarea
                    placeholder="例如：推进到同居阶段"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 min-h-[80px]"
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-xs text-slate-300">
                    💡 AI 已根据截图识别你的说话风格，后续可在档案中调整
                  </p>
                </div>
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
                onClick={handleCreate}
                disabled={isCreating || !personName || !relationshipType}
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
              >
                {isCreating ? "创建中..." : "🎉 完成创建"}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}