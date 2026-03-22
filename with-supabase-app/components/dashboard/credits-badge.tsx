import { Coins } from 'lucide-react';

interface CreditsBadgeProps {
  credits: number;
}

export function CreditsBadge({ credits }: CreditsBadgeProps) {
  const isLow = credits < 5;

  return (
    <div className={`
      flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm transition-all duration-300
      ${isLow
        ? 'border-yellow-500/50 bg-yellow-500/10 shadow-lg shadow-yellow-500/20'
        : 'border-primary/50 bg-primary/10 shadow-lg shadow-primary/20 hover:shadow-primary/30'
      }
    `}>
      <Coins className={`h-4 w-4 ${isLow ? 'text-yellow-400' : 'text-primary'}`} />
      <span className={`text-sm font-bold font-rajdhani ${isLow ? 'text-yellow-400' : 'text-primary'}`}>
        {credits} 点数
      </span>
      {isLow && (
        <span className="text-xs text-yellow-400/80">!</span>
      )}
    </div>
  );
}
