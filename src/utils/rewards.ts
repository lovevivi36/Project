import type { RewardResult, Reward } from '@/types/task';
import { getRewards } from './localStorage';

// 基于权重触发奖励
export const triggerReward = (): RewardResult => {
  const rewards = getRewards();
  
  // 计算总权重
  const totalWeight = rewards.reduce((sum, r) => sum + r.weight, 0);
  
  // 如果没有奖励或总权重为0，返回正常完成
  if (rewards.length === 0 || totalWeight === 0) {
    return { type: 'normal' };
  }
  
  // 生成随机数
  const random = Math.random() * totalWeight;
  
  // 根据权重选择奖励
  let currentWeight = 0;
  for (const reward of rewards) {
    currentWeight += reward.weight;
    if (random <= currentWeight) {
      return {
        type: reward.type,
        reward,
      };
    }
  }
  
  // 默认返回正常完成
  return { type: 'normal' };
};

