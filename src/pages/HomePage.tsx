import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';
// 懒加载对话框组件，减少初始 bundle 大小
const RewardDialog = lazy(() => import('@/components/RewardDialog'));
const RewardEditor = lazy(() => import('@/components/RewardEditor'));
const RecycleBin = lazy(() => import('@/components/RecycleBin'));
const ExportDialog = lazy(() => import('@/components/ExportDialog'));
const CategoryManager = lazy(() => import('@/components/CategoryManager'));
import type { Task, Priority, RewardResult, Category } from '@/types/task';
import { getTasks, saveTasks, getDeletedTasks, saveDeletedTasks, getCategories } from '@/utils/localStorage';
import { triggerReward } from '@/utils/rewards';
import { audioManager } from '@/utils/audio';
import { toast } from 'sonner';
import { CheckCircle2, Circle, ListTodo, Sparkles, FolderKanban } from 'lucide-react';

// 容器动画配置
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [rewardResult, setRewardResult] = useState<RewardResult | null>(null);
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all'); // 'all' 表示显示所有类别
  const [categoriesUpdateKey, setCategoriesUpdateKey] = useState(0);

  // 使用 requestIdleCallback 延迟初始化，提升首屏渲染速度
  useEffect(() => {
    // 先渲染界面，然后在空闲时加载数据
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        setTasks(getTasks());
        setCategories(getCategories());
      }, { timeout: 100 });
    } else {
      // 降级方案：使用 setTimeout
      setTimeout(() => {
        setTasks(getTasks());
        setCategories(getCategories());
      }, 0);
    }
  }, []);

  const handleCategoriesChange = () => {
    setCategories(getCategories());
    setCategoriesUpdateKey((prev) => prev + 1);
  };

  const handleAddTask = (title: string, priority: Priority, dueDate?: string, categoryId?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate,
      categoryId,
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    toast.success('任务已添加');
  };

  const handleToggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    // 如果是完成任务，触发奖励机制
    if (!task.completed) {
      const result = triggerReward();
      setRewardResult(result);

      if (result.type === 'super') {
        audioManager.playSuperReward();
        setShowRewardDialog(true);
      } else if (result.type === 'small') {
        audioManager.playSmallReward();
        setShowRewardDialog(true);
      } else {
        audioManager.playSuccess();
        toast.success('任务已完成！');
      }
    }
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (taskToDelete) {
      // 移到回收站
      const deletedTasks = getDeletedTasks();
      saveDeletedTasks([...deletedTasks, taskToDelete]);
    }
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    toast.success('任务已移至回收站');
  };

  // 编辑任务（支持子任务编辑）
  const handleEditTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) => {
      // 编辑主任务
      if (task.id === id) {
        return { ...task, ...updates };
      }
      // 编辑子任务
      if (task.subtasks) {
        const updatedSubtasks = task.subtasks.map((subtask) =>
          subtask.id === id ? { ...subtask, ...updates } : subtask
        );
        // 检查是否有子任务被更新
        if (updatedSubtasks.some((st, idx) => st !== task.subtasks![idx])) {
          return { ...task, subtasks: updatedSubtasks };
        }
      }
      return task;
    });
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    toast.success('任务已更新');
  };

  // 从回收站恢复任务
  const handleRestoreTask = (task: Task) => {
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // 添加子任务
  const handleAddSubtask = (parentId: string, title: string, priority: Priority, dueDate?: string) => {
    const parentTask = tasks.find((t) => t.id === parentId);
    const updatedTasks = tasks.map((task) => {
      if (task.id === parentId) {
        const newSubtask: Task = {
          id: `${parentId}-${Date.now()}`,
          title,
          priority,
          completed: false,
          createdAt: new Date().toISOString(),
          dueDate,
          categoryId: parentTask?.categoryId, // 继承父任务的类别
        };
        return {
          ...task,
          subtasks: [...(task.subtasks || []), newSubtask],
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    toast.success('子任务已添加');
  };

  // 切换子任务状态
  const handleToggleSubtask = (parentId: string, subtaskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === parentId && task.subtasks) {
        const updatedSubtasks = task.subtasks.map((subtask) =>
          subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        );
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    });
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // 删除子任务
  const handleDeleteSubtask = (parentId: string, subtaskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === parentId && task.subtasks) {
        return {
          ...task,
          subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    toast.success('子任务已删除');
  };

  const filteredTasks = tasks.filter((task) => {
    // 先按状态筛选
    let statusFiltered = true;
    if (activeTab === 'active') statusFiltered = !task.completed;
    if (activeTab === 'completed') statusFiltered = task.completed;
    
    // 再按类别筛选
    if (selectedCategoryId === 'all') {
      return statusFiltered;
    }
    if (selectedCategoryId === 'uncategorized') {
      return statusFiltered && !task.categoryId;
    }
    return statusFiltered && task.categoryId === selectedCategoryId;
  });

  // 获取类别信息
  const getCategoryInfo = (categoryId: string) => {
    if (categoryId === 'uncategorized') {
      return { name: '未分类', color: 'hsl(var(--muted-foreground))' };
    }
    const category = categories.find((cat) => cat.id === categoryId);
    return category || { name: '未知类别', color: 'hsl(var(--muted-foreground))' };
  };

  // 获取每个类别的任务数量
  const getCategoryTaskCount = (categoryId: string) => {
    if (categoryId === 'all') {
      return tasks.length;
    }
    if (categoryId === 'uncategorized') {
      return tasks.filter((t) => !t.categoryId).length;
    }
    return tasks.filter((t) => t.categoryId === categoryId).length;
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    active: tasks.filter((t) => !t.completed).length,
  };

  return (
    <div className="min-h-screen gradient-bg">
      <motion.div
        className="max-w-5xl mx-auto p-4 xl:p-12 space-y-6 xl:space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 顶部标题区域 */}
        <motion.div variants={itemVariants} className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-4">
          <div className="space-y-1 xl:space-y-2">
            <h1 className="text-3xl xl:text-5xl font-bold tracking-tight gradient-text">DopaList</h1>
            <p className="text-sm xl:text-base text-muted-foreground/80 font-light flex items-center gap-2">
              <Sparkles className="h-3 w-3 xl:h-4 xl:w-4" />
              极简待办，意外惊喜
            </p>
          </div>
          <div className="flex items-center gap-2 xl:gap-3 w-full xl:w-auto">
            <Suspense fallback={null}>
              <CategoryManager onCategoriesChange={handleCategoriesChange} />
              <RecycleBin onRestore={handleRestoreTask} />
              <ExportDialog tasks={tasks} disabled={tasks.length === 0} />
              <RewardEditor />
            </Suspense>
          </div>
        </motion.div>

        {/* 统计仪表盘 */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-0 overflow-hidden">
            <CardContent className="p-4 xl:p-8">
              <div className="grid grid-cols-3 gap-3 xl:gap-8">
                {/* 总计 */}
                <motion.div
                  className="text-center space-y-1 xl:space-y-3 p-3 xl:p-6 rounded-xl xl:rounded-2xl bg-gradient-to-br from-background/50 to-background/30 hover-lift"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="inline-flex items-center justify-center w-8 h-8 xl:w-12 xl:h-12 rounded-full bg-primary/10 mb-1 xl:mb-2">
                    <ListTodo className="h-4 w-4 xl:h-6 xl:w-6 text-primary" />
                  </div>
                  <div className="stat-number text-2xl xl:text-4xl font-bold tracking-tight">
                    {stats.total}
                  </div>
                  <div className="text-xs xl:text-sm text-muted-foreground font-medium">总计任务</div>
                </motion.div>

                {/* 进行中 */}
                <motion.div
                  className="text-center space-y-1 xl:space-y-3 p-3 xl:p-6 rounded-xl xl:rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 hover-lift"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="inline-flex items-center justify-center w-8 h-8 xl:w-12 xl:h-12 rounded-full bg-primary/20 mb-1 xl:mb-2">
                    <Circle className="h-4 w-4 xl:h-6 xl:w-6 text-primary" />
                  </div>
                  <div className="stat-number text-2xl xl:text-4xl font-bold tracking-tight text-primary">
                    {stats.active}
                  </div>
                  <div className="text-xs xl:text-sm text-muted-foreground font-medium">进行中</div>
                </motion.div>

                {/* 已完成 */}
                <motion.div
                  className="text-center space-y-1 xl:space-y-3 p-3 xl:p-6 rounded-xl xl:rounded-2xl bg-gradient-to-br from-muted/30 to-muted/50 hover-lift"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="inline-flex items-center justify-center w-8 h-8 xl:w-12 xl:h-12 rounded-full bg-muted mb-1 xl:mb-2">
                    <CheckCircle2 className="h-4 w-4 xl:h-6 xl:w-6 text-muted-foreground" />
                  </div>
                  <div className="stat-number text-2xl xl:text-4xl font-bold tracking-tight text-muted-foreground">
                    {stats.completed}
                  </div>
                  <div className="text-xs xl:text-sm text-muted-foreground font-medium">已完成</div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 任务管理区域 */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-0 overflow-hidden">
            <CardHeader className="pb-4 xl:pb-6">
              <TaskInput onAdd={handleAddTask} onCategoriesUpdate={categoriesUpdateKey} />
            </CardHeader>
            <div className="soft-divider mx-4 xl:mx-6" />
            <CardContent className="pt-4 xl:pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 xl:space-y-6">
                <TabsList className="grid w-full grid-cols-3 bg-muted/30 p-1 rounded-lg xl:rounded-xl">
                  <TabsTrigger
                    value="all"
                    className="rounded-md xl:rounded-lg text-xs xl:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium transition-all"
                  >
                    全部
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="rounded-md xl:rounded-lg text-xs xl:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium transition-all"
                  >
                    进行中
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="rounded-md xl:rounded-lg text-xs xl:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium transition-all"
                  >
                    已完成
                  </TabsTrigger>
                </TabsList>

                {/* 类别按钮栏 */}
                {(categories.length > 0 || tasks.some((t) => !t.categoryId)) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant={selectedCategoryId === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategoryId('all')}
                      className="gap-2 rounded-full"
                    >
                      <span>全部</span>
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        {getCategoryTaskCount('all')}
                      </Badge>
                    </Button>
                    {categories.map((category) => {
                      const count = getCategoryTaskCount(category.id);
                      if (count === 0) return null;
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategoryId === category.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCategoryId(category.id)}
                          className="gap-2 rounded-full"
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                          <Badge variant="secondary" className="text-xs px-1.5 py-0">
                            {count}
                          </Badge>
                        </Button>
                      );
                    })}
                    {tasks.some((t) => !t.categoryId) && (
                      <Button
                        variant={selectedCategoryId === 'uncategorized' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategoryId('uncategorized')}
                        className="gap-2 rounded-full"
                      >
                        <span>未分类</span>
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {getCategoryTaskCount('uncategorized')}
                        </Badge>
                      </Button>
                    )}
                  </div>
                )}

                {/* 任务列表 */}
                <TabsContent value="all" className="mt-6">
                  <TaskList
                    tasks={filteredTasks}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                    onAddSubtask={handleAddSubtask}
                    onToggleSubtask={handleToggleSubtask}
                    onDeleteSubtask={handleDeleteSubtask}
                    onCategoriesUpdate={categoriesUpdateKey}
                  />
                </TabsContent>

                <TabsContent value="active" className="mt-6">
                  <TaskList
                    tasks={filteredTasks}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                    onAddSubtask={handleAddSubtask}
                    onToggleSubtask={handleToggleSubtask}
                    onDeleteSubtask={handleDeleteSubtask}
                    onCategoriesUpdate={categoriesUpdateKey}
                  />
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                  <TaskList
                    tasks={filteredTasks}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                    onAddSubtask={handleAddSubtask}
                    onToggleSubtask={handleToggleSubtask}
                    onDeleteSubtask={handleDeleteSubtask}
                    onCategoriesUpdate={categoriesUpdateKey}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Suspense fallback={null}>
        <RewardDialog
          open={showRewardDialog}
          onOpenChange={setShowRewardDialog}
          result={rewardResult}
        />
      </Suspense>
    </div>
  );
}

