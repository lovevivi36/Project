import { motion } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Task } from '@/types/task';
import { AlertTriangle } from 'lucide-react';

interface SubtaskWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incompleteTasks: Task[];
  onConfirm: () => void;
}

export default function SubtaskWarningDialog({
  open,
  onOpenChange,
  incompleteTasks,
  onConfirm,
}: SubtaskWarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card border-0">
        <DialogHeader>
          <motion.div
            className="mx-auto mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </motion.div>
          <DialogTitle className="text-center text-xl">还有子任务未完成</DialogTitle>
          <DialogDescription className="text-center">
            以下子任务尚未完成，确定要完成主任务吗？
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-60 overflow-y-auto py-4">
          {incompleteTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-muted/30"
            >
              <div className="w-2 h-2 rounded-full bg-yellow-600 shrink-0" />
              <p className="text-sm font-medium flex-1">{task.title}</p>
            </motion.div>
          ))}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            取消
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700"
          >
            确认完成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
