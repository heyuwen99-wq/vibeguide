import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
}

export function LoadingSpinner({ text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* 加载动画容器 */}
      <div className="relative">
        {/* 外圈脉冲光晕 */}
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse" />

        {/* 中圈旋转环 */}
        <div className="relative w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin shadow-lg shadow-primary/50" />

        {/* 内圈图标 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-primary animate-spin" style={{ animationDirection: 'reverse' }} />
        </div>

        {/* 装饰性粒子 */}
        <div className="absolute -inset-4">
          <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-primary animate-ping" />
          <div className="absolute bottom-0 left-1/2 w-2 h-2 rounded-full bg-secondary animate-ping delay-100" />
        </div>
      </div>

      {/* 加载文本 */}
      {text && (
        <div className="mt-8 space-y-2 text-center">
          <p className="text-base text-foreground font-rajdhani font-medium animate-pulse">{text}</p>
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
          </div>
        </div>
      )}
    </div>
  );
}
