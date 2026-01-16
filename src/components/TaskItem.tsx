import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Task, Priority, Category } from '@/types/task';
import { Trash2, Circle, ChevronDown, ChevronRight, Plus, Edit2, Check, X, Calendar, Clock, AlertCircle, FolderKanban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isOverdue, isDueSoon, formatDueDate, getTodayString } from '@/utils/date';
import { getCategories } from '@/utils/localStorage';
import SubtaskWarningDialog from './SubtaskWarningDialog';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
  onAddSubtask: (parentId: string, title: string, priority: Priority, dueDate?: string) => void;
  onToggleSubtask: (parentId: string, subtaskId: string) => void;
  onDeleteSubtask: (parentId: string, subtaskId: string) => void;
  isSubtask?: boolean;
  onCategoriesUpdate?: number;
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  isSubtask = false,
  onCategoriesUpdate,
}: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // 子任务输入状态
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [subtaskPriority, setSubtaskPriority] = useState<Priority>('P3');
  const [subtaskDueDate, setSubtaskDueDate] = useState('');
  
  // 编辑状态
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');
  const [editCategoryId, setEditCategoryId] = useState(task.categoryId || '');

  useEffect(() => {
    setCategories(getCategories());
  }, [onCategoriesUpdate]);

  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const incompleteSubtasks = task.subtasks?.filter((st) => !st.completed) || [];

  const handleAddSubtask = () => {
    if (subtaskTitle.trim()) {
      onAddSubtask(task.id, subtaskTitle.trim(), subtaskPriority, subtaskDueDate || undefined);
      setSubtaskTitle('');
      setSubtaskPriority('P3');
      setSubtaskDueDate('');
      setIsAddingSubtask(false);
      setIsExpanded(true);
    }
  };

  const handleToggle = () => {
    // 如果是父任务且有未完成子任务，显示警告
    if (!isSubtask && !task.completed && incompleteSubtasks.length > 0) {
      setShowWarning(true);
    } else {
      isSubtask ? onToggleSubtask(task.id, task.id) : onToggle(task.id);
    }
  };

  const handleConfirmComplete = () => {
    onToggle(task.id);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onEdit(task.id, {
        title: editTitle.trim(),
        priority: editPriority,
        dueDate: editDueDate || undefined,
        categoryId: editCategoryId || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
    setEditCategoryId(task.categoryId || '');
    setIsEditing(false);
  };

  // 截止日期状态
  const dueDateStatus = task.dueDate
    ? isOverdue(task.dueDate)
      ? 'overdue'
      : isDueSoon(task.dueDate)
      ? 'soon'
      : 'normal'
    : null;

  return (
    <div>
      <SubtaskWarningDialog
        open={showWarning}
        onOpenChange={setShowWarning}
        incompleteTasks={incompleteSubtasks}
        onConfirm={handleConfirmComplete}
      />
      
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
        layout
        className={cn(
          'group relative flex items-center gap-4 p-4 rounded-xl border bg-card/50 backdrop-blur-sm',
          'hover-lift cursor-pointer',
          'transition-all duration-300',
          task.completed && 'task-completed',
          isSubtask && 'ml-8 bg-card/30'
        )}
      >
        {/* 优先级指示器 - 左侧光晕圆点 */}
        {task.priority !== 'P3' && !isSubtask && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full overflow-hidden">
            <div
              className={cn(
                'w-full h-full',
                task.priority === 'P1' && 'bg-priority-high',
                task.priority === 'P2' && 'bg-priority-medium'
              )}
              style={{
                boxShadow:
                  task.priority === 'P1'
                    ? '0 0 12px hsla(0, 84%, 60%, 0.5)'
                    : '0 0 12px hsla(45, 93%, 48%, 0.5)',
              }}
            />
          </div>
        )}

        {/* 展开/收起按钮 */}
        {hasSubtasks && !isSubtask && (
          <motion.button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0 p-1 hover:bg-accent rounded-md transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </motion.button>
        )}

        {/* 复选框 */}
        <motion.div whileTap={{ scale: 0.9 }} className="shrink-0">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggle}
            className="h-5 w-5 rounded-md border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
          />
        </motion.div>

        {/* 任务内容 */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            // 编辑模式
            <div className="space-y-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-8 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
              />
              <div className="flex gap-2 flex-wrap">
                <Select value={editPriority} onValueChange={(v) => setEditPriority(v as Priority)}>
                  <SelectTrigger className="h-7 text-xs w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P1">🔴 P1</SelectItem>
                    <SelectItem value="P2">🟡 P2</SelectItem>
                    <SelectItem value="P3">⚪ P3</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  min={getTodayString()}
                  className="h-7 text-xs w-36"
                />
                {categories.length > 0 && (
                  <Select value={editCategoryId} onValueChange={setEditCategoryId}>
                    <SelectTrigger className="h-7 text-xs w-32">
                      <div className="flex items-center gap-1.5">
                        <FolderKanban className="h-3 w-3" />
                        <SelectValue placeholder="类别" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">无类别</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          ) : (
            // 显示模式
            <>
              <motion.p
                className={cn(
                  'text-[15px] font-medium leading-relaxed transition-all duration-500',
                  task.completed ? 'line-through text-muted-foreground/60' : 'text-foreground'
                )}
                animate={{
                  opacity: task.completed ? 0.6 : 1,
                  y: task.completed ? 2 : 0,
                }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                {task.title}
              </motion.p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <p className="text-xs text-muted-foreground/70 font-light">
                  {new Date(task.createdAt).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                {task.dueDate && (
                  <div
                    className={cn(
                      'flex items-center gap-1 text-xs px-2 py-0.5 rounded-full',
                      dueDateStatus === 'overdue' && 'bg-red-500/10 text-red-600',
                      dueDateStatus === 'soon' && 'bg-yellow-500/10 text-yellow-600',
                      dueDateStatus === 'normal' && 'bg-muted/50 text-muted-foreground'
                    )}
                  >
                    {dueDateStatus === 'overdue' ? (
                      <AlertCircle className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    <span>{formatDueDate(task.dueDate)}</span>
                  </div>
                )}
                {hasSubtasks && (
                  <span className="text-xs text-muted-foreground/70">
                    {task.subtasks?.filter((s) => s.completed).length}/{task.subtasks?.length} 完成
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* 优先级徽章 */}
        {!isEditing && task.priority !== 'P3' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold',
              task.priority === 'P1' && 'priority-badge-high',
              task.priority === 'P2' && 'priority-badge-medium'
            )}
          >
            <Circle className="h-2 w-2 fill-current" />
            <span>{task.priority}</span>
          </motion.div>
        )}

        {/* 操作按钮 */}
        {isEditing ? (
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveEdit}
              className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancelEdit}
              className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1 shrink-0 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
            {!task.completed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 rounded-lg hover:bg-accent"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {!isSubtask && !task.completed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAddingSubtask(!isAddingSubtask)}
                className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                isSubtask ? onDeleteSubtask(task.id, task.id) : onDelete(task.id);
              }}
              className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </motion.div>

      {/* 添加子任务输入框 */}
      <AnimatePresence>
        {isAddingSubtask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-8 mt-2 overflow-hidden"
          >
            <div className="flex gap-2 p-3 rounded-xl border bg-card/30 backdrop-blur-sm">
              <Input
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                placeholder="输入子任务..."
                className="flex-1 h-8 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSubtask();
                  } else if (e.key === 'Escape') {
                    setIsAddingSubtask(false);
                  }
                }}
                autoFocus
              />
              <Input
                type="date"
                value={subtaskDueDate}
                onChange={(e) => setSubtaskDueDate(e.target.value)}
                min={getTodayString()}
                className="w-32 h-8 text-xs"
              />
              <Button onClick={handleAddSubtask} size="sm" className="h-8">
                添加
              </Button>
              <Button
                onClick={() => setIsAddingSubtask(false)}
                variant="ghost"
                size="sm"
                className="h-8"
              >
                取消
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 子任务列表 */}
      <AnimatePresence>
        {isExpanded && hasSubtasks && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-2 overflow-hidden"
          >
            {task.subtasks?.map((subtask) => (
              <TaskItem
                key={subtask.id}
                task={subtask}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
                onAddSubtask={onAddSubtask}
                onToggleSubtask={(_, subtaskId) => onToggleSubtask(task.id, subtaskId)}
                onDeleteSubtask={(_, subtaskId) => onDeleteSubtask(task.id, subtaskId)}
                isSubtask
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



