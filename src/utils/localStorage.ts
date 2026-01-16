import type { Task, Reward, Category } from '@/types/task';

const TASKS_KEY = 'dopalist_tasks';
const REWARDS_KEY = 'dopalist_rewards';
const DELETED_TASKS_KEY = 'dopalist_deleted_tasks';
const CATEGORIES_KEY = 'dopalist_categories';

// 默认奖励库（带权重）
const DEFAULT_REWARDS: Reward[] = [
  // 小奖励（权重较高）
  { id: '1', text: '休息 5 分钟 ☕', type: 'small', weight: 10 },
  { id: '2', text: '喝杯水 💧', type: 'small', weight: 10 },
  { id: '3', text: '站起来走走 🚶', type: 'small', weight: 8 },
  { id: '4', text: '听首喜欢的歌 🎵', type: 'small', weight: 8 },
  { id: '5', text: '吃点小零食 🍪', type: 'small', weight: 7 },
  { id: '6', text: '看看窗外风景 🌤️', type: 'small', weight: 7 },
  { id: '7', text: '伸个懒腰 🙆', type: 'small', weight: 6 },
  { id: '8', text: '刷刷社交媒体 📱', type: 'small', weight: 6 },
  // 超级大奖（权重较低）
  { id: '9', text: '看一集剧！🎬', type: 'super', weight: 3 },
  { id: '10', text: '今晚不加班！🎉', type: 'super', weight: 3 },
  { id: '11', text: '出去吃顿好的！🍜', type: 'super', weight: 2 },
  { id: '12', text: '买个心仪已久的东西！🎁', type: 'super', weight: 2 },
  { id: '13', text: '睡个懒觉！😴', type: 'super', weight: 2 },
  { id: '14', text: '约朋友出去玩！🎮', type: 'super', weight: 2 },
];

// 获取任务列表
export const getTasks = (): Task[] => {
  try {
    const tasks = localStorage.getItem(TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('获取任务失败:', error);
    return [];
  }
};

// 保存任务列表
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('保存任务失败:', error);
  }
};

// 获取已删除任务列表（回收站）
export const getDeletedTasks = (): Task[] => {
  try {
    const tasks = localStorage.getItem(DELETED_TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('获取回收站任务失败:', error);
    return [];
  }
};

// 保存已删除任务列表
export const saveDeletedTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(DELETED_TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('保存回收站任务失败:', error);
  }
};

// 获取奖励库
export const getRewards = (): Reward[] => {
  try {
    const rewards = localStorage.getItem(REWARDS_KEY);
    if (!rewards) {
      // 首次使用，初始化默认奖励库
      saveRewards(DEFAULT_REWARDS);
      return DEFAULT_REWARDS;
    }
    const parsed = JSON.parse(rewards);
    // 兼容旧数据：如果没有 weight 字段，添加默认权重
    return parsed.map((r: Reward) => ({
      ...r,
      weight: r.weight ?? (r.type === 'small' ? 10 : 3),
    }));
  } catch (error) {
    console.error('获取奖励库失败:', error);
    return DEFAULT_REWARDS;
  }
};

// 保存奖励库
export const saveRewards = (rewards: Reward[]): void => {
  try {
    localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
  } catch (error) {
    console.error('保存奖励库失败:', error);
  }
};

// 获取类别列表
export const getCategories = (): Category[] => {
  try {
    const categories = localStorage.getItem(CATEGORIES_KEY);
    return categories ? JSON.parse(categories) : [];
  } catch (error) {
    console.error('获取类别失败:', error);
    return [];
  }
};

// 保存类别列表
export const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('保存类别失败:', error);
  }
};

