import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: { title: string; description: string }[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="relative w-full border border-primary/30 rounded-xl p-6 mb-8 bg-card/30 backdrop-blur-sm shadow-lg">
      {/* 顶部装饰线 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-xl" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold font-rajdhani text-primary">进度追踪</h3>
        <span className="text-sm font-bold font-rajdhani text-primary">
          步骤 {currentStep} / {steps.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-muted/30 rounded-full mb-8 overflow-hidden border border-primary/20">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 shadow-lg shadow-primary/50 relative"
          style={{ width: `${progress}%` }}
        >
          {/* 进度条上的光晕效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </div>
      </div>

      {/* Step Labels */}
      <div className="grid grid-cols-3 gap-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={index} className="relative text-center">
              {/* 步骤编号/图标 */}
              <div className="flex justify-center mb-3">
                <div
                  className={cn(
                    'relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2',
                    isCurrent
                      ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/50 scale-110'
                      : isCompleted
                      ? 'bg-primary/30 border-primary/50 text-primary'
                      : 'bg-muted/30 border-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-orbitron">{stepNumber}</span>
                  )}

                  {/* 当前步骤的脉冲环 */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-75" />
                  )}
                </div>
              </div>

              {/* 步骤标题 */}
              <div
                className={cn(
                  'inline-block px-4 py-2 rounded-lg mb-2 text-sm font-bold font-rajdhani transition-all duration-300',
                  isCurrent
                    ? 'bg-primary/20 text-primary border border-primary/50'
                    : isCompleted
                    ? 'text-primary/80'
                    : 'text-muted-foreground'
                )}
              >
                {step.title}
              </div>

              {/* 步骤描述 */}
              <p className={cn(
                "text-xs leading-relaxed transition-colors duration-300",
                isCurrent ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
