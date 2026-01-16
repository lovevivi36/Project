import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Task } from '@/types/task';
import { getDeletedTasks, saveDeletedTasks } from '@/utils/localStorage';
import { Trash2, RotateCcw, Trash, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RecycleBinProps {
  onRestore: (task: Task) => void;
}

export default function RecycleBin({ onRestore }: RecycleBinProps) {
  const [open, setOpen] = useState(false);
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);

  const loadDeletedTasks = () => {
    setDeletedTasks(getDeletedTasks());
  };

  useEffect(() => {
    if (open) {
      loadDeletedTasks();
    }
  }, [open]);

  const handleRestore = (task: Task) => {
    const updatedTasks = deletedTasks.filter((t) => t.id !== task.id);
    setDeletedTasks(updatedTasks);
    saveDeletedTasks(updatedTasks);
    onRestore(task);
    toast.success('任务已恢复');
  };

  const handlePermanentDelete = (taskId: string) => {
    const updatedTasks = deletedTasks.filter((t) => t.id !== taskId);
    setDeletedTasks(updatedTasks);
    saveDeletedTasks(updatedTasks);
    toast.success('任务已永久删除');
  };

  const handleClearAll = () => {
    setDeletedTasks([]);
    saveDeletedTasks([]);
    toast.success('回收站已清空');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-xl hover-lift border-border/50 bg-background/50 backdrop-blur-sm"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          回收站 {deletedTasks.length > 0 && `(${deletedTasks.length})`}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto glass-card border-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trash2 className="h-6 w-6 text-muted-foreground" />
            回收站
          </DialogTitle>
          <DialogDescription className="text-base">
            已删除的任务可以恢复或永久删除
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {deletedTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">回收站是空的</p>
            </div>
          ) : (
            <>
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  清空回收站
                </Button>
              </div>
              <div className="space-y-2">
                <AnimatePresence>
                  {deletedTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-xl border bg-card/50 backdrop-blur-sm hover-lift group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground line-through">
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {new Date(task.createdAt).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestore(task)}
                          className="h-8 hover:bg-primary/10 hover:text-primary"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          恢复
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePermanentDelete(task.id)}
                          className="h-8 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          永久删除
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
