import { Coins } from 'lucide-react';

interface CreditsBadgeProps {
  credits: number;
}

export function CreditsBadge({ credits }: CreditsBadgeProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5">
      <Coins className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium">{credits} 点数</span>
    </div>
  );
}
