"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SceneType } from "@/components/SceneSelector";
import { 
  getTopics, 
  getRandomTopics, 
  TOPIC_CATEGORIES, 
  type Topic 
} from "@/lib/topics";

interface TopicLibraryProps {
  sceneType: SceneType;
}

export default function TopicLibrary({ sceneType }: TopicLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("daily");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [randomTopics, setRandomTopics] = useState<Topic[]>(getRandomTopics(sceneType, 5));

  const handleCopyTopic = async (topic: Topic) => {
    try {
      await navigator.clipboard.writeText(topic.content);
      setCopiedId(topic.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("复制失败:", error);
    }
  };

  const handleRefreshRandom = () => {
    setRandomTopics(getRandomTopics(sceneType, 5));
  };

  const categoryTopics = getTopics(sceneType, selectedCategory);

  return (
    <div className="space-y-6">
      {/* 今日推荐 */}
      <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
              🎯 今日推荐话题
            </h3>
            <button
              onClick={handleRefreshRandom}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              换一批
            </button>
          </div>

          <div className="space-y-3">
            {randomTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-gray-200 mb-2">{topic.content}</div>
                    <div className="flex flex-wrap gap-2">
                      {topic.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-gray-700/50 text-gray-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyTopic(topic)}
                    className="shrink-0 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors opacity-0 group-hover:opacity-100"
                    title="复制话题"
                  >
                    {copiedId === topic.id ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 话题分类 */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            📚 话题库
          </h3>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-2 bg-gray-800/50 p-2">
              {Object.entries(TOPIC_CATEGORIES).map(([key, { name, emoji }]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <span className="mr-1">{emoji}</span>
                  <span className="hidden sm:inline">{name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.keys(TOPIC_CATEGORIES).map((category) => (
              <TabsContent key={category} value={category} className="mt-4">
                {categoryTopics.length > 0 ? (
                  <div className="grid gap-3">
                    {categoryTopics.map((topic) => (
                      <div
                        key={topic.id}
                        className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors group cursor-pointer"
                        onClick={() => handleCopyTopic(topic)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="text-gray-200 mb-2">{topic.content}</div>
                            <div className="flex flex-wrap gap-2">
                              {topic.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs bg-gray-700/50 text-gray-300"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="shrink-0 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            {copiedId === topic.id ? (
                              <div className="flex items-center gap-1 text-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                已复制
                              </div>
                            ) : (
                              <div className="text-sm">点击复制</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    暂无该分类的话题
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* 使用提示 */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-gray-300 space-y-1">
            <div className="font-semibold text-blue-400">💡 使用技巧</div>
            <ul className="space-y-1 list-disc list-inside text-gray-400">
              <li>点击话题可直接复制，粘贴后可以修改</li>
              <li>根据对方状态选择合适的话题</li>
              <li>不要机械地使用，加入自己的风格</li>
              <li>日常+深度话题搭配使用效果更好</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
