// 任务优先级
export type Priority = 'P1' | 'P2' | 'P3';

// 类别接口
export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

// 任务接口
export interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  dueDate?: string; // 截止日期（可选）
  categoryId?: string; // 类别ID（可选）
  subtasks?: Task[]; // 子任务列表
}

// 奖励类型
export type RewardType = 'small' | 'super' | 'normal';

// 奖励接口
export interface Reward {
  id: string;
  text: string;
  type: 'small' | 'super';
  weight: number; // 权重值，用于概率计算
}

// 奖励结果
export interface RewardResult {
  type: RewardType;
  reward?: Reward;
}

