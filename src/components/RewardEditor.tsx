import { useState } from 'react';
import { motion } from 'motion/react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Reward } from '@/types/task';
import { getRewards, saveRewards } from '@/utils/localStorage';
import { Settings, Plus, Trash2, Sparkles, Weight } from 'lucide-react';

export default function RewardEditor() {
  const [open, setOpen] = useState(false);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [newRewardText, setNewRewardText] = useState('');
  const [newRewardType, setNewRewardType] = useState<'small' | 'super'>('small');
  const [newRewardWeight, setNewRewardWeight] = useState('10');

  const loadRewards = () => {
    setRewards(getRewards());
  };

  const handleAdd = () => {
    if (newRewardText.trim()) {
      const weight = Number.parseInt(newRewardWeight) || 1;
      const newReward: Reward = {
        id: Date.now().toString(),
        text: newRewardText.trim(),
        type: newRewardType,
        weight: Math.max(1, weight), // 最小权重为1
      };
      const updatedRewards = [...rewards, newReward];
      setRewards(updatedRewards);
      saveRewards(updatedRewards);
      setNewRewardText('');
      setNewRewardWeight('10');
    }
  };

  const handleDelete = (id: string) => {
    const updatedRewards = rewards.filter((r) => r.id !== id);
    setRewards(updatedRewards);
    saveRewards(updatedRewards);
  };

  const handleWeightChange = (id: string, weight: number) => {
    const updatedRewards = rewards.map((r) =>
      r.id === id ? { ...r, weight: Math.max(1, weight) } : r
    );
    setRewards(updatedRewards);
    saveRewards(updatedRewards);
  };

  // 计算总权重和概率
  const totalWeight = rewards.reduce((sum, r) => sum + r.weight, 0);
  const smallWeight = rewards.filter((r) => r.type === 'small').reduce((sum, r) => sum + r.weight, 0);
  const superWeight = rewards.filter((r) => r.type === 'super').reduce((sum, r) => sum + r.weight, 0);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) loadRewards();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl hover-lift border-border/50 bg-background/50 backdrop-blur-sm"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto glass-card border-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            奖励库管理
          </DialogTitle>
          <DialogDescription className="text-base">
            编辑奖励内容和权重，权重越高触发概率越大
          </DialogDescription>
        </DialogHeader>

        {/* 概率统计 */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">小奖励概率</div>
            <div className="text-lg font-bold text-primary">
              {totalWeight > 0 ? ((smallWeight / totalWeight) * 100).toFixed(1) : 0}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">超级大奖概率</div>
            <div className="text-lg font-bold text-yellow-600">
              {totalWeight > 0 ? ((superWeight / totalWeight) * 100).toFixed(1) : 0}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">总权重</div>
            <div className="text-lg font-bold">{totalWeight}</div>
          </div>
        </div>

        <div className="space-y-6 mt-6">
          {/* 添加奖励输入框 */}
          <div className="flex gap-3 p-1.5 rounded-xl border-2 border-border/50 bg-background/50 backdrop-blur-sm">
            <Input
              value={newRewardText}
              onChange={(e) => setNewRewardText(e.target.value)}
              placeholder="输入奖励内容..."
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <Input
              type="number"
              value={newRewardWeight}
              onChange={(e) => setNewRewardWeight(e.target.value)}
              placeholder="权重"
              className="w-20 border-0 bg-secondary/50 focus-visible:ring-0 focus-visible:ring-offset-0"
              min="1"
            />
            <Select
              value={newRewardType}
              onValueChange={(value) => setNewRewardType(value as 'small' | 'super')}
            >
              <SelectTrigger className="w-32 border-0 bg-secondary/50 hover:bg-secondary focus:ring-0 focus:ring-offset-0 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">✨ 小奖励</SelectItem>
                <SelectItem value="super">🎉 超级大奖</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAdd} size="icon" className="rounded-lg">
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* 小奖励列表 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-muted-foreground">小奖励</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
            </div>
            <div className="space-y-2">
              {rewards
                .filter((r) => r.type === 'small')
                .map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl border bg-card/50 backdrop-blur-sm hover-lift group"
                  >
                    <span className="flex-1 text-sm font-medium">{reward.text}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <Weight className="h-3 w-3 text-muted-foreground" />
                      <Input
                        type="number"
                        value={reward.weight}
                        onChange={(e) =>
                          handleWeightChange(reward.id, Number.parseInt(e.target.value) || 1)
                        }
                        className="w-16 h-8 text-xs text-center"
                        min="1"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(reward.id)}
                      className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* 超级大奖列表 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-muted-foreground">超级大奖</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
            </div>
            <div className="space-y-2">
              {rewards
                .filter((r) => r.type === 'super')
                .map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl border bg-gradient-to-br from-yellow-500/5 to-orange-500/5 backdrop-blur-sm hover-lift group"
                  >
                    <span className="flex-1 text-sm font-semibold">{reward.text}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <Weight className="h-3 w-3 text-muted-foreground" />
                      <Input
                        type="number"
                        value={reward.weight}
                        onChange={(e) =>
                          handleWeightChange(reward.id, Number.parseInt(e.target.value) || 1)
                        }
                        className="w-16 h-8 text-xs text-center"
                        min="1"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(reward.id)}
                      className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


