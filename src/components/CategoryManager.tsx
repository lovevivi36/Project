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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Category } from '@/types/task';
import { getCategories, saveCategories } from '@/utils/localStorage';
import { FolderKanban, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// 预设颜色
const PRESET_COLORS = [
  { name: '蓝色', value: 'hsl(var(--primary))' },
  { name: '绿色', value: 'hsl(142, 76%, 36%)' },
  { name: '橙色', value: 'hsl(24, 95%, 53%)' },
  { name: '紫色', value: 'hsl(262, 83%, 58%)' },
  { name: '红色', value: 'hsl(0, 84%, 60%)' },
  { name: '青色', value: 'hsl(189, 85%, 46%)' },
];

interface CategoryManagerProps {
  onCategoriesChange?: () => void;
}

export default function CategoryManager({ onCategoriesChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(PRESET_COLORS[0].value);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setCategories(getCategories());
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('请输入类别名称');
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      color: newCategoryColor,
      createdAt: new Date().toISOString(),
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    setNewCategoryName('');
    setNewCategoryColor(PRESET_COLORS[0].value);
    toast.success('类别已添加');
    onCategoriesChange?.();
  };

  const handleEditCategory = () => {
    if (!editingCategory || !newCategoryName.trim()) {
      toast.error('请输入类别名称');
      return;
    }

    const updatedCategories = categories.map((cat) =>
      cat.id === editingCategory.id
        ? { ...cat, name: newCategoryName.trim(), color: newCategoryColor }
        : cat
    );
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryColor(PRESET_COLORS[0].value);
    toast.success('类别已更新');
    onCategoriesChange?.();
  };

  const handleDeleteCategory = () => {
    if (!deletingCategory) return;

    const updatedCategories = categories.filter((cat) => cat.id !== deletingCategory.id);
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    setDeletingCategory(null);
    toast.success('类别已删除');
    onCategoriesChange?.();
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryColor(category.color);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryColor(PRESET_COLORS[0].value);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <FolderKanban className="h-4 w-4" />
            <span className="hidden xl:inline">类别管理</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>类别管理</DialogTitle>
            <DialogDescription>创建和管理任务类别</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* 添加/编辑类别表单 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">类别名称</Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="例如：工作、学习、生活"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (editingCategory) {
                        handleEditCategory();
                      } else {
                        handleAddCategory();
                      }
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>颜色</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewCategoryColor(color.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newCategoryColor === color.value
                          ? 'border-foreground scale-110'
                          : 'border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {editingCategory ? (
                <div className="flex gap-2">
                  <Button onClick={handleEditCategory} className="flex-1">
                    保存修改
                  </Button>
                  <Button onClick={cancelEdit} variant="outline">
                    取消
                  </Button>
                </div>
              ) : (
                <Button onClick={handleAddCategory} className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  添加类别
                </Button>
              )}
            </div>

            {/* 类别列表 */}
            {categories.length > 0 && (
              <div className="space-y-2">
                <Label>已有类别</Label>
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {categories.map((category) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => startEdit(category)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeletingCategory(category)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {categories.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                还没有类别，创建第一个吧！
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除类别「{deletingCategory?.name}」吗？该类别下的任务不会被删除，但会失去类别标记。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
