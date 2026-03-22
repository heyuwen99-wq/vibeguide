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
          className={`relative rounded-2xl border p-8 ${
            plan.popular
              ? 'border-primary shadow-lg scale-105'
              : 'border-border'
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-1 rounded-full">
                推荐
              </span>
            </div>
          )}
          <div className="text-center">
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <div className="mt-4 flex items-baseline justify-center gap-x-2">
              <span className="text-5xl font-bold tracking-tight">
                {plan.price}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {plan.credits} 个项目点数
            </p>
          </div>
          <ul className="mt-8 space-y-3">
            {plan.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            className="mt-8 w-full"
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
