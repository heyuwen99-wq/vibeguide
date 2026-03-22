'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const pricingPlans = [
  {
    name: '基础版',
    price: '¥20',
    credits: 10,
    features: [
      '10 个项目点数',
      '生成 5 种专业文档',
      'Markdown 格式导出',
      '在线预览和下载',
      '永久保存项目历史',
    ],
  },
  {
    name: '进阶版',
    price: '¥40',
    credits: 30,
    features: [
      '30 个项目点数',
      '生成 5 种专业文档',
      'Markdown 格式导出',
      '在线预览和下载',
      '永久保存项目历史',
      '更优惠的单价',
    ],
    popular: true,
  },
];

export function PricingCards() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handlePurchase = (credits: number, amount: number) => {
    if (!isAuthenticated) {
      alert('请先登录后再购买');
      router.push('/auth/login');
      return;
    }

    // TODO: Implement payment flow
    // For now, just redirect to a placeholder
    router.push(`/payment?credits=${credits}&amount=${amount}`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
      {pricingPlans.map((plan, index) => (
        <div
          key={index}
          className={`group relative rounded-2xl border p-8 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
            plan.popular
              ? 'border-primary/50 shadow-lg shadow-primary/20 glow-cyan'
              : 'border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10'
          }`}
        >
          {/* 顶部装饰线 */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* 角落光晕 */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-bold px-6 py-1.5 rounded-full shadow-lg glow-cyan animate-pulse-glow">
                推荐
              </span>
            </div>
          )}
          <div className="relative text-center">
            <h3 className="text-3xl font-bold font-rajdhani">{plan.name}</h3>
            <div className="mt-6 flex items-baseline justify-center gap-x-2">
              <span className="text-6xl font-bold tracking-tight text-gradient-cyber font-orbitron">
                {plan.price}
              </span>
            </div>
            <p className="mt-3 text-muted-foreground">
              {plan.credits} 个项目点数
            </p>
          </div>
          <ul className="mt-8 space-y-4">
            {plan.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-center gap-3">
                <div className="rounded-full bg-primary/20 p-1 border border-primary/30">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                </div>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            className={`mt-8 w-full font-semibold transition-all duration-300 ${
              plan.popular
                ? 'glow-cyan hover:scale-105'
                : 'hover:bg-primary/10 hover:border-primary'
            }`}
            size="lg"
            variant={plan.popular ? 'default' : 'outline'}
            onClick={() =>
              handlePurchase(plan.credits, parseInt(plan.price.replace('¥', '')))
            }
            disabled={isLoading}
          >
            {isLoading ? '加载中...' : '立即购买'}
          </Button>
        </div>
      ))}
    </div>
  );
}
