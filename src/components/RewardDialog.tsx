import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { RewardResult } from '@/types/task';
import confetti from 'canvas-confetti';
import { Sparkles, Gift } from 'lucide-react';

interface RewardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: RewardResult | null;
}

export default function RewardDialog({ open, onOpenChange, result }: RewardDialogProps) {
  useEffect(() => {
    if (open && result?.type === 'super') {
      // 触发五彩纸屑效果
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [open, result]);

  if (!result || result.type === 'normal') return null;

  const isSuper = result.type === 'super';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 glass-card overflow-hidden">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <DialogHeader className="space-y-6 pt-6">
                {/* 图标动画 */}
                <motion.div
                  className="mx-auto"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.1,
                  }}
                >
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
                      isSuper
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                        : 'bg-gradient-to-br from-blue-400 to-purple-500'
                    } shadow-2xl`}
                  >
                    {isSuper ? (
                      <Gift className="h-10 w-10 text-white" />
                    ) : (
                      <Sparkles className="h-10 w-10 text-white" />
                    )}
                  </div>
                </motion.div>

                {/* 标题 */}
                <DialogTitle className="text-center">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`${isSuper ? 'text-3xl' : 'text-2xl'} font-bold`}
                  >
                    {isSuper ? '🎉 超级大奖！' : '✨ 小奖励'}
                  </motion.div>
                </DialogTitle>

                {/* 奖励内容 */}
                <DialogDescription className="text-center pb-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      duration: 0.6,
                      delay: 0.3,
                    }}
                    className={`${
                      isSuper ? 'text-2xl' : 'text-xl'
                    } font-semibold text-foreground px-6 py-4 rounded-2xl bg-gradient-to-br from-background/80 to-background/50 backdrop-blur-sm border`}
                  >
                    {result.reward?.text}
                  </motion.div>
                </DialogDescription>
              </DialogHeader>

              {/* 装饰性粒子效果 */}
              {isSuper && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                      initial={{
                        x: '50%',
                        y: '50%',
                        scale: 0,
                        opacity: 1,
                      }}
                      animate={{
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 100}%`,
                        scale: [0, 1, 0],
                        opacity: [1, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.05,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

