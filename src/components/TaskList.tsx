import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';
import TaskItem from './TaskItem';
import type { Task, Priority } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
  onAddSubtask: (parentId: string, title: string, priority: Priority, dueDate?: string) => void;
  onToggleSubtask: (parentId: string, subtaskId: string) => void;
  onDeleteSubtask: (parentId: string, subtaskId: string) => void;
  onCategoriesUpdate?: number;
}

// 优先级排序权重
const priorityWeight: Record<Priority, number> = {
  P1: 3,
  P2: 2,
  P3: 1,
};

// 任务排序函数：优先级 > 截止日期 > 创建时间
const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // 第一优先级：按优先级排序（P1 > P2 > P3）
    const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // 第二优先级：按截止日期排序
    // 有截止日期的排在前面，无截止日期的排在后面
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }

    // 第三优先级：按创建时间排序（新的在前）
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onCategoriesUpdate,
}: TaskListProps) {
  // 分组：待办和已完成
  const activeTasks = sortTasks(tasks.filter((t) => !t.completed));
  const completedTasks = sortTasks(tasks.filter((t) => t.completed));

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">暂无任务，开始添加吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 待办事项组 */}
      {activeTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <h3 className="text-sm font-semibold text-foreground">
              待办事项 ({activeTasks.length})
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {activeTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onAddSubtask={onAddSubtask}
                  onToggleSubtask={onToggleSubtask}
                  onDeleteSubtask={onDeleteSubtask}
                  onCategoriesUpdate={onCategoriesUpdate}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 已完成事项组 */}
      {completedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 px-1">
            <h3 className="text-sm font-semibold text-muted-foreground">
              已完成 ({completedTasks.length})
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent" />
          </div>
          <div className="space-y-2 opacity-60">
            <AnimatePresence>
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onAddSubtask={onAddSubtask}
                  onToggleSubtask={onToggleSubtask}
                  onDeleteSubtask={onDeleteSubtask}
                  onCategoriesUpdate={onCategoriesUpdate}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}

