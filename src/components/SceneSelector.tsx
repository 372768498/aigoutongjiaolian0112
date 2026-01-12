"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export type SceneType = 
  | "long_distance" 
  | "dating" 
  | "relationship" 
  | "friendship" 
  | "workplace" 
  | "family";

interface SceneSelectorProps {
  onSelect: (scene: SceneType) => void;
  selected?: SceneType;
}

const SCENES = [
  {
    type: "long_distance" as SceneType,
    emoji: "💑",
    name: "异地恋",
    description: "长距离恋爱，需要维系感情",
    color: "from-pink-500 to-rose-500"
  },
  {
    type: "dating" as SceneType,
    emoji: "💝",
    name: "相亲/约会",
    description: "初次见面，建立好感",
    color: "from-purple-500 to-pink-500"
  },
  {
    type: "relationship" as SceneType,
    emoji: "❤️",
    name: "恋爱关系",
    description: "日常情侣沟通",
    color: "from-red-500 to-pink-500"
  },
  {
    type: "friendship" as SceneType,
    emoji: "👫",
    name: "朋友",
    description: "朋友之间的交流",
    color: "from-blue-500 to-cyan-500"
  },
  {
    type: "workplace" as SceneType,
    emoji: "💼",
    name: "职场",
    description: "工作相关沟通",
    color: "from-indigo-500 to-blue-500"
  },
  {
    type: "family" as SceneType,
    emoji: "👨‍👩‍👧",
    name: "家庭",
    description: "与家人的沟通",
    color: "from-amber-500 to-orange-500"
  }
];

export default function SceneSelector({ onSelect, selected }: SceneSelectorProps) {
  const [hoveredScene, setHoveredScene] = useState<SceneType | null>(null);

  return (
    <div className="w-full space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-200">
          这次聊天是什么场景？
        </h3>
        <p className="text-sm text-gray-400">
          💡 选择场景后，AI 会提供更精准的建议
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {SCENES.map((scene) => {
          const isSelected = selected === scene.type;
          const isHovered = hoveredScene === scene.type;

          return (
            <Card
              key={scene.type}
              className={`
                cursor-pointer transition-all duration-200 overflow-hidden
                ${isSelected 
                  ? "ring-2 ring-blue-500 bg-gradient-to-br " + scene.color
                  : "bg-gray-800/50 hover:bg-gray-800/70"
                }
                ${isHovered && !isSelected ? "scale-105" : ""}
              `}
              onClick={() => onSelect(scene.type)}
              onMouseEnter={() => setHoveredScene(scene.type)}
              onMouseLeave={() => setHoveredScene(null)}
            >
              <CardContent className="p-4 text-center space-y-2">
                <div className="text-4xl">{scene.emoji}</div>
                <div>
                  <div className={`font-semibold ${isSelected ? "text-white" : "text-gray-200"}`}>
                    {scene.name}
                  </div>
                  <div className={`text-xs ${isSelected ? "text-gray-100" : "text-gray-400"}`}>
                    {scene.description}
                  </div>
                </div>
                {isSelected && (
                  <div className="text-white text-xs flex items-center justify-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    已选择
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selected && (
        <div className="text-center">
          <button
            onClick={() => onSelect(selected)}
            className="text-sm text-blue-400 hover:text-blue-300 underline"
          >
            更改场景
          </button>
        </div>
      )}
    </div>
  );
}
