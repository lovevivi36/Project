import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import type { Task } from '@/types/task';
import { exportTasksToExcel } from '@/utils/excel';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ExportDialogProps {
  tasks: Task[];
  disabled?: boolean;
}

// 可导出的列配置
export interface ExportColumn {
  key: string;
  label: string;
  enabled: boolean;
}

const defaultColumns: ExportColumn[] = [
  { key: 'title', label: '任务标题', enabled: true },
  { key: 'subtasks', label: '子任务', enabled: true },
  { key: 'priority', label: '优先级', enabled: true },
  { key: 'status', label: '状态', enabled: true },
  { key: 'dueDate', label: '截止日期', enabled: true },
  { key: 'createdAt', label: '创建日期', enabled: true },
];

export default function ExportDialog({ tasks, disabled }: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [columns, setColumns] = useState<ExportColumn[]>(defaultColumns);

  const handleToggleColumn = (key: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === key ? { ...col, enabled: !col.enabled } : col))
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newColumns = [...columns];
    [newColumns[index - 1], newColumns[index]] = [newColumns[index], newColumns[index - 1]];
    setColumns(newColumns);
  };

  const handleMoveDown = (index: number) => {
    if (index === columns.length - 1) return;
    const newColumns = [...columns];
    [newColumns[index], newColumns[index + 1]] = [newColumns[index + 1], newColumns[index]];
    setColumns(newColumns);
  };

  const handleExport = () => {
    const enabledColumns = columns.filter((col) => col.enabled).map((col) => col.key);
    exportTasksToExcel(tasks, enabledColumns);
    const fileName = `DopaList_任务列表_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.xlsx`;
    toast.success(`导出成功！文件已保存到浏览器默认下载位置`, {
      description: `文件名：${fileName}`,
      duration: 5000,
    });
    setOpen(false);
  };

  const handleSelectAll = () => {
    const allEnabled = columns.every((col) => col.enabled);
    setColumns((prev) => prev.map((col) => ({ ...col, enabled: !allEnabled })));
  };

  const allSelected = columns.every((col) => col.enabled);
  const someSelected = columns.some((col) => col.enabled) && !allSelected;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="rounded-xl hover-lift border-border/50 bg-background/50 backdrop-blur-sm"
        >
          <Download className="h-4 w-4 mr-2" />
          导出 Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>导出任务列表</DialogTitle>
          <DialogDescription>选择要导出的列并调整顺序，然后点击导出按钮</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* 全选/取消全选 */}
          <div className="flex items-center space-x-2 pb-2 border-b">
            <Checkbox
              id="select-all"
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              className={someSelected ? 'data-[state=checked]:bg-primary/50' : ''}
            />
            <Label
              htmlFor="select-all"
              className="text-sm font-semibold cursor-pointer"
            >
              {allSelected ? '取消全选' : '全选'}
            </Label>
          </div>

          {/* 列选择和排序 */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {columns.map((column, index) => (
              <div
                key={column.key}
                className={cn(
                  'flex items-center space-x-2 p-2 rounded-lg transition-colors',
                  'hover:bg-accent/50'
                )}
              >
                {/* 拖拽图标 */}
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />

                {/* 复选框 */}
                <Checkbox
                  id={column.key}
                  checked={column.enabled}
                  onCheckedChange={() => handleToggleColumn(column.key)}
                />

                {/* 列名 */}
                <Label
                  htmlFor={column.key}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {column.label}
                </Label>

                {/* 上移/下移按钮 */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="h-7 w-7 rounded-md"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === columns.length - 1}
                    className="h-7 w-7 rounded-md"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* 提示信息 */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p>💡 提示：</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>使用 ↑ ↓ 按钮调整列的顺序</li>
              <li>子任务将紧跟主任务后面显示</li>
              <li>至少需要选择一列才能导出</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-lg"
          >
            取消
          </Button>
          <Button
            onClick={handleExport}
            disabled={!columns.some((col) => col.enabled)}
            className="rounded-lg"
          >
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
