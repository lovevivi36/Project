// 日期处理工具函数

// 检查日期是否逾期
export const isOverdue = (dueDate: string): boolean => {
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < now;
};

// 检查日期是否即将到期（3天内）
export const isDueSoon = (dueDate: string): boolean => {
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 3;
};

// 格式化日期显示
export const formatDueDate = (dueDate: string): string => {
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `逾期 ${Math.abs(diffDays)} 天`;
  } else if (diffDays === 0) {
    return '今天到期';
  } else if (diffDays === 1) {
    return '明天到期';
  } else if (diffDays <= 3) {
    return `${diffDays} 天后到期`;
  } else {
    return due.toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
    });
  }
};

// 获取今天的日期字符串（YYYY-MM-DD）
export const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};
