import { SceneType } from "@/components/SceneSelector";

export interface Topic {
  id: string;
  category: "daily" | "emotion" | "memory" | "future" | "interest" | "deep" | "fun";
  content: string;
  scene_type: SceneType;
  tags: string[];
}

export const TOPIC_CATEGORIES = {
  daily: { name: "日常生活", emoji: "☀️", color: "from-yellow-500 to-orange-500" },
  emotion: { name: "情感交流", emoji: "💭", color: "from-pink-500 to-rose-500" },
  memory: { name: "回忆过去", emoji: "📝", color: "from-purple-500 to-indigo-500" },
  future: { name: "未来规划", emoji: "🌟", color: "from-blue-500 to-cyan-500" },
  interest: { name: "兴趣爱好", emoji: "🎮", color: "from-green-500 to-emerald-500" },
  deep: { name: "深度话题", emoji: "💡", color: "from-indigo-500 to-purple-500" },
  fun: { name: "趣味互动", emoji: "🎪", color: "from-red-500 to-pink-500" }
};

// 异地恋话题库
const LONG_DISTANCE_TOPICS: Topic[] = [
  // 日常生活
  { id: "ld_daily_1", category: "daily", scene_type: "long_distance", tags: ["美食"], content: "今天午饭吃了什么？我来猜猜看～" },
  { id: "ld_daily_2", category: "daily", scene_type: "long_distance", tags: ["天气"], content: "你那边天气怎么样？我这边..." },
  { id: "ld_daily_3", category: "daily", scene_type: "long_distance", tags: ["工作"], content: "今天工作怎么样？有什么有趣的事吗？" },
  { id: "ld_daily_4", category: "daily", scene_type: "long_distance", tags: ["心情"], content: "今天有什么让你开心的事吗？" },
  { id: "ld_daily_5", category: "daily", scene_type: "long_distance", tags: ["日常"], content: "刚才路过一家店，想到你会喜欢" },
  
  // 情感交流
  { id: "ld_emotion_1", category: "emotion", scene_type: "long_distance", tags: ["想念"], content: "想我了吗？我可是超级想你的～" },
  { id: "ld_emotion_2", category: "emotion", scene_type: "long_distance", tags: ["爱意"], content: "你知道我最喜欢你哪一点吗？" },
  { id: "ld_emotion_3", category: "emotion", scene_type: "long_distance", tags: ["陪伴"], content: "如果现在我在你身边，你想让我做什么？" },
  { id: "ld_emotion_4", category: "emotion", scene_type: "long_distance", tags: ["安慰"], content: "虽然不能抱抱你，但我的心一直陪着你" },
  { id: "ld_emotion_5", category: "emotion", scene_type: "long_distance", tags: ["甜蜜"], content: "你要记得有个人天南海北地爱着你啊" },
  
  // 回忆过去
  { id: "ld_memory_1", category: "memory", scene_type: "long_distance", tags: ["初识"], content: "你还记得我们第一次见面的场景吗？" },
  { id: "ld_memory_2", category: "memory", scene_type: "long_distance", tags: ["美好"], content: "我们一起做过的最开心的事是什么？" },
  { id: "ld_memory_3", category: "memory", scene_type: "long_distance", tags: ["特别"], content: "哪一刻让你觉得'就是ta了'？" },
  { id: "ld_memory_4", category: "memory", scene_type: "long_distance", tags: ["旅行"], content: "我们一起去过哪里最难忘？" },
  
  // 未来规划
  { id: "ld_future_1", category: "future", scene_type: "long_distance", tags: ["见面"], content: "我们下次见面想去哪里玩？" },
  { id: "ld_future_2", category: "future", scene_type: "long_distance", tags: ["结束异地"], content: "等我们不异地了，第一件事要做什么？" },
  { id: "ld_future_3", category: "future", scene_type: "long_distance", tags: ["生活"], content: "如果可以，你想和我一起去哪个城市生活？" },
  { id: "ld_future_4", category: "future", scene_type: "long_distance", tags: ["梦想"], content: "说说我们的未来吧，你有什么期待？" },
  { id: "ld_future_5", category: "future", scene_type: "long_distance", tags: ["计划"], content: "下个假期我们做什么？我有个想法..." },
  
  // 兴趣爱好
  { id: "ld_interest_1", category: "interest", scene_type: "long_distance", tags: ["电影"], content: "最近有什么想看的电影吗？我们一起看！" },
  { id: "ld_interest_2", category: "interest", scene_type: "long_distance", tags: ["音乐"], content: "分享一首最近单曲循环的歌" },
  { id: "ld_interest_3", category: "interest", scene_type: "long_distance", tags: ["阅读"], content: "最近在看什么书？讲讲呗～" },
  { id: "ld_interest_4", category: "interest", scene_type: "long_distance", tags: ["游戏"], content: "一起玩个小游戏吧？" },
  
  // 深度话题
  { id: "ld_deep_1", category: "deep", scene_type: "long_distance", tags: ["关系"], content: "你觉得我们之间最大的默契是什么？" },
  { id: "ld_deep_2", category: "deep", scene_type: "long_distance", tags: ["成长"], content: "异地这段时间，你觉得我们的关系有什么变化吗？" },
  { id: "ld_deep_3", category: "deep", scene_type: "long_distance", tags: ["改变"], content: "你希望我做出什么改变吗？" },
  { id: "ld_deep_4", category: "deep", scene_type: "long_distance", tags: ["理解"], content: "你觉得我足够理解你吗？" },
  
  // 趣味互动
  { id: "ld_fun_1", category: "fun", scene_type: "long_distance", tags: ["游戏"], content: "来玩个'你画我猜'，第一个词是..." },
  { id: "ld_fun_2", category: "fun", scene_type: "long_distance", tags: ["挑战"], content: "给你一个任务：今天对我说三句甜言蜜语～" },
  { id: "ld_fun_3", category: "fun", scene_type: "long_distance", tags: ["想象"], content: "如果我们现在在同一个城市会怎样？" },
  { id: "ld_fun_4", category: "fun", scene_type: "long_distance", tags: ["表情包"], content: "用一个表情包形容今天的心情" }
];

// 相亲/约会话题库
const DATING_TOPICS: Topic[] = [
  // 日常生活
  { id: "dt_daily_1", category: "daily", scene_type: "dating", tags: ["工作"], content: "你的工作平时都做些什么呀？" },
  { id: "dt_daily_2", category: "daily", scene_type: "dating", tags: ["休闲"], content: "周末一般都怎么度过？" },
  { id: "dt_daily_3", category: "daily", scene_type: "dating", tags: ["城市"], content: "在这个城市住了多久啦？" },
  { id: "dt_daily_4", category: "daily", scene_type: "dating", tags: ["美食"], content: "有什么特别喜欢吃的吗？" },
  
  // 兴趣爱好
  { id: "dt_interest_1", category: "interest", scene_type: "dating", tags: ["电影"], content: "平时喜欢看什么类型的电影？" },
  { id: "dt_interest_2", category: "interest", scene_type: "dating", tags: ["音乐"], content: "喜欢听什么风格的音乐？" },
  { id: "dt_interest_3", category: "interest", scene_type: "dating", tags: ["运动"], content: "有什么运动爱好吗？" },
  { id: "dt_interest_4", category: "interest", scene_type: "dating", tags: ["旅行"], content: "去过哪里旅行印象最深刻？" },
  { id: "dt_interest_5", category: "interest", scene_type: "dating", tags: ["爱好"], content: "有什么特别的爱好吗？" },
  
  // 回忆过去
  { id: "dt_memory_1", category: "memory", scene_type: "dating", tags: ["童年"], content: "小时候的梦想是什么？" },
  { id: "dt_memory_2", category: "memory", scene_type: "dating", tags: ["学生时代"], content: "学生时代做过最疯狂的事是什么？" },
  { id: "dt_memory_3", category: "memory", scene_type: "dating", tags: ["家乡"], content: "你老家是哪里的？有什么特色？" },
  
  // 未来规划
  { id: "dt_future_1", category: "future", scene_type: "dating", tags: ["职业"], content: "对未来的职业发展有什么规划？" },
  { id: "dt_future_2", category: "future", scene_type: "dating", tags: ["生活"], content: "理想的生活状态是什么样的？" },
  { id: "dt_future_3", category: "future", scene_type: "dating", tags: ["旅行"], content: "最想去哪个地方旅行？" },
  
  // 深度话题
  { id: "dt_deep_1", category: "deep", scene_type: "dating", tags: ["价值观"], content: "你觉得生活中最重要的是什么？" },
  { id: "dt_deep_2", category: "deep", scene_type: "dating", tags: ["家庭"], content: "你和家人关系怎么样？" },
  { id: "dt_deep_3", category: "deep", scene_type: "dating", tags: ["爱情观"], content: "你觉得什么样的关系是好的关系？" },
  
  // 趣味互动
  { id: "dt_fun_1", category: "fun", scene_type: "dating", tags: ["假设"], content: "如果中了彩票，你会做什么？" },
  { id: "dt_fun_2", category: "fun", scene_type: "dating", tags: ["选择"], content: "早起 vs 晚睡，你是哪一派？" },
  { id: "dt_fun_3", category: "fun", scene_type: "dating", tags: ["美食"], content: "甜党还是咸党？" }
];

// 恋爱关系话题库
const RELATIONSHIP_TOPICS: Topic[] = [
  { id: "rel_emotion_1", category: "emotion", scene_type: "relationship", tags: ["爱意"], content: "我今天特别想告诉你，我有多喜欢你" },
  { id: "rel_emotion_2", category: "emotion", scene_type: "relationship", tags: ["欣赏"], content: "你身上最吸引我的是..." },
  { id: "rel_memory_1", category: "memory", scene_type: "relationship", tags: ["初恋"], content: "还记得我们第一次牵手吗？" },
  { id: "rel_future_1", category: "future", scene_type: "relationship", tags: ["计划"], content: "我们下个月做点什么特别的事？" },
  { id: "rel_deep_1", category: "deep", scene_type: "relationship", tags: ["成长"], content: "你觉得我们在一起后，彼此有什么改变？" }
];

// 朋友话题库
const FRIENDSHIP_TOPICS: Topic[] = [
  { id: "fr_daily_1", category: "daily", scene_type: "friendship", tags: ["工作"], content: "最近工作还顺利吗？" },
  { id: "fr_interest_1", category: "interest", scene_type: "friendship", tags: ["新发现"], content: "最近有什么新发现的好玩的吗？" },
  { id: "fr_memory_1", category: "memory", scene_type: "friendship", tags: ["回忆"], content: "还记得我们第一次见面吗？" },
  { id: "fr_deep_1", category: "deep", scene_type: "friendship", tags: ["人生"], content: "最近对生活有什么新的想法？" }
];

// 职场话题库
const WORKPLACE_TOPICS: Topic[] = [
  { id: "wp_daily_1", category: "daily", scene_type: "workplace", tags: ["项目"], content: "这个项目的进展如何？有什么需要协调的吗？" },
  { id: "wp_interest_1", category: "interest", scene_type: "workplace", tags: ["学习"], content: "最近在学什么新技能吗？" },
  { id: "wp_future_1", category: "future", scene_type: "workplace", tags: ["发展"], content: "对团队未来发展有什么建议？" }
];

// 家庭话题库
const FAMILY_TOPICS: Topic[] = [
  { id: "fm_daily_1", category: "daily", scene_type: "family", tags: ["健康"], content: "最近身体怎么样？" },
  { id: "fm_emotion_1", category: "emotion", scene_type: "family", tags: ["关心"], content: "有什么需要我帮忙的吗？" },
  { id: "fm_memory_1", category: "memory", scene_type: "family", tags: ["回忆"], content: "还记得小时候那件事吗？" }
];

// 汇总所有话题
export const ALL_TOPICS: Record<SceneType, Topic[]> = {
  long_distance: LONG_DISTANCE_TOPICS,
  dating: DATING_TOPICS,
  relationship: RELATIONSHIP_TOPICS,
  friendship: FRIENDSHIP_TOPICS,
  workplace: WORKPLACE_TOPICS,
  family: FAMILY_TOPICS
};

// 获取指定场景和分类的话题
export function getTopics(sceneType: SceneType, category?: string): Topic[] {
  const topics = ALL_TOPICS[sceneType] || [];
  if (!category) return topics;
  return topics.filter(t => t.category === category);
}

// 随机推荐话题
export function getRandomTopics(sceneType: SceneType, count: number = 5): Topic[] {
  const topics = ALL_TOPICS[sceneType] || [];
  const shuffled = [...topics].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
