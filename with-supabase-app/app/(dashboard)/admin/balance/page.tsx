'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface BalanceData {
  balance: number;
  usage: number;
  limit: number;
  alert: string | null;
  formatted: {
    balance: string;
    usage: string;
    limit: string;
  };
}

export default function BalancePage() {
  const [data, setData] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/balance');
      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const balancePercentage = data
    ? (data.balance / data.limit) * 100
    : 0;

  const getBalanceColor = () => {
    if (balancePercentage > 50) return 'bg-green-500';
    if (balancePercentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">OpenRouter 余额监控</h1>
          <p className="text-muted-foreground mt-2">
            实时查看 API 余额和使用情况
          </p>
        </div>
        <Button onClick={fetchBalance} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      {error && (
        <div className="border border-red-500 bg-red-50 dark:bg-red-950 rounded-lg p-4 mb-6">
          <p className="text-red-600 dark:text-red-400">❌ {error}</p>
        </div>
      )}

      {data?.alert && (
        <div className="border border-yellow-500 bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4 mb-6">
          <p className="text-yellow-600 dark:text-yellow-400">{data.alert}</p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Balance Card */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">当前余额</h2>
            <div className="text-5xl font-bold text-primary mb-4">
              {data.formatted.balance}
            </div>
            <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all ${getBalanceColor()}`}
                style={{ width: `${balancePercentage}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {balancePercentage.toFixed(1)}% 剩余
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                累计使用
              </h3>
              <p className="text-3xl font-bold">{data.formatted.usage}</p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                充值总额
              </h3>
              <p className="text-3xl font-bold">{data.formatted.limit}</p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="border rounded-lg p-6 bg-card">
            <h3 className="text-lg font-semibold mb-4">建议</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 余额低于 $5 时建议充值</li>
              <li>• 定期检查余额（建议每周）</li>
              <li>• 单个项目成本约 $0.04（¥0.28）</li>
              <li>
                • 当前余额可生成约{' '}
                {Math.floor(data.balance / 0.04)} 个项目
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="border rounded-lg p-6 bg-card">
            <h3 className="text-lg font-semibold mb-4">快捷操作</h3>
            <div className="flex gap-4">
              <Button asChild>
                <a
                  href="https://openrouter.ai/settings/billing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  去充值
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://openrouter.ai/settings/usage"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  查看详细使用记录
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
