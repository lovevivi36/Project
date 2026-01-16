import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Priority, Category } from '@/types/task';
import { Plus, Sparkles, Calendar, FolderKanban } from 'lucide-react';
import { getTodayString } from '@/utils/date';
import { getCategories } from '@/utils/localStorage';

interface TaskInputProps {
  onAdd: (title: string, priority: Priority, dueDate?: string, categoryId?: string) => void;
  onCategoriesUpdate?: number;
}

export default function TaskInput({ onAdd, onCategoriesUpdate }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('P3');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setCategories(getCategories());
  }, [onCategoriesUpdate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), priority, dueDate || undefined, categoryId || undefined);
      setTitle('');
      setPriority('P3');
      setDueDate('');
      setCategoryId('');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* 移动端：垂直布局 */}
      <div className="xl:hidden space-y-3">
        {/* 任务输入框 */}
        <div
          className={cn(
            'flex items-center gap-2 p-3 rounded-lg border-2 bg-background/50 backdrop-blur-sm transition-all duration-300',
            isFocused
              ? 'border-primary/50 shadow-lg shadow-primary/5'
              : 'border-border/50'
          )}
        >
          <Sparkles className="h-4 w-4 text-muted-foreground/50 shrink-0" />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="添加新任务..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-muted-foreground/50"
          />
        </div>

        {/* 类别选择 */}
        {categories.length > 0 && (
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-full h-9 border border-border/50 bg-background/50 hover:bg-secondary focus:ring-0 focus:ring-offset-0 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-3.5 w-3.5 text-muted-foreground/50" />
                <SelectValue placeholder="选择类别（可选）" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" " className="text-xs">无类别</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="text-xs">
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

        {/* 日期、优先级和提交按钮 */}
        <div className="flex items-center gap-2">
          {/* 截止日期 */}
          <div className="flex-1 flex items-center gap-2 p-2 rounded-lg border border-border/50 bg-background/50">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={getTodayString()}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-xs p-0 h-auto"
              placeholder="截止日期"
            />
          </div>

          {/* 优先级 */}
          <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
            <SelectTrigger className="w-20 h-9 border border-border/50 bg-secondary/50 hover:bg-secondary focus:ring-0 focus:ring-offset-0 rounded-lg text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="P1" className="text-xs">🔴 P1</SelectItem>
              <SelectItem value="P2" className="text-xs">🟡 P2</SelectItem>
              <SelectItem value="P3" className="text-xs">⚪ P3</SelectItem>
            </SelectContent>
          </Select>

          {/* 提交按钮 */}
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 rounded-lg bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 桌面端：水平布局 */}
      <div
        className={cn(
          'hidden xl:flex gap-3 p-1.5 rounded-xl border-2 bg-background/50 backdrop-blur-sm transition-all duration-300',
          isFocused
            ? 'border-primary/50 shadow-lg shadow-primary/5'
            : 'border-border/50 hover:border-border'
        )}
      >
        <div className="flex-1 flex items-center gap-2 px-2">
          <Sparkles className="h-4 w-4 text-muted-foreground/50" />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="添加新任务，按回车提交..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px] placeholder:text-muted-foreground/50"
          />
        </div>

        {/* 类别选择 */}
        {categories.length > 0 && (
          <div className="flex items-center px-2 border-l border-border/50">
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-32 border-0 bg-secondary/50 hover:bg-secondary focus:ring-0 focus:ring-offset-0 rounded-lg">
                <div className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-muted-foreground/50" />
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
          </div>
        )}

        {/* 截止日期和优先级在同一行 */}
        <div className="flex items-center gap-2 px-2 border-l border-border/50">
          <Calendar className="h-4 w-4 text-muted-foreground/50" />
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={getTodayString()}
            className="w-36 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            placeholder="截止日期"
          />
          <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
            <SelectTrigger className="w-28 border-0 bg-secondary/50 hover:bg-secondary focus:ring-0 focus:ring-offset-0 rounded-lg font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="P1">🔴 P1</SelectItem>
              <SelectItem value="P2">🟡 P2</SelectItem>
              <SelectItem value="P3">⚪ P3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          size="icon"
          className="rounded-lg bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </motion.form>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
