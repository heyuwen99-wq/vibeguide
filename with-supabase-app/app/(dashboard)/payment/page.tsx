'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<'alipay' | 'wxpay'>('alipay');

  const credits = searchParams.get('credits');
  const amount = searchParams.get('amount');

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push('/auth/login');
      }
    };
    checkAuth();
  }, [router]);

  const handlePayment = async () => {
    if (!credits || !amount) {
      alert('参数错误');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          credits: parseInt(credits),
          type: paymentType,
        }),
      });

      const data = await response.json();

      console.log('Payment API response:', data);

      if (response.ok && data.paymentUrl) {
        console.log('Redirecting to:', data.paymentUrl);
        // Redirect to payment page
        window.location.href = data.paymentUrl;
      } else {
        console.error('Payment creation failed:', data);
        alert('创建支付失败: ' + (data.error || '未知错误'));
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('创建支付失败，请稍后重试');
      setIsLoading(false);
    }
  };

  if (!credits || !amount) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold font-orbitron text-gradient-cyber mb-4">参数错误</h1>
        <Button onClick={() => router.push('/pricing')} className="glow-cyan">返回价格页面</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 relative">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[128px] animate-pulse pointer-events-none" />

      <div className="relative max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 font-orbitron text-gradient-cyber animate-fade-in-up">选择支付方式</h1>

        {/* 订单信息卡片 */}
        <div className="relative rounded-xl border border-primary/30 p-6 mb-8 bg-card/30 backdrop-blur-sm shadow-lg animate-fade-in-up delay-100">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-xl" />

          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground font-rajdhani">购买点数</span>
            <span className="font-bold text-lg font-rajdhani">{credits} 个项目点数</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-rajdhani">支付金额</span>
            <span className="text-3xl font-bold text-gradient-cyber font-orbitron">¥{amount}</span>
          </div>
        </div>

        {/* 支付方式选择 */}
        <div className="space-y-4 mb-8 animate-fade-in-up delay-200">
          <div
            className={`group relative rounded-xl p-5 cursor-pointer transition-all duration-300 ${
              paymentType === 'alipay'
                ? 'border-2 border-primary bg-primary/10 shadow-lg shadow-primary/20'
                : 'border border-primary/20 bg-card/20 hover:border-primary/40 hover:bg-card/30'
            }`}
            onClick={() => setPaymentType('alipay')}
          >
            {paymentType === 'alipay' && (
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            )}

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                支
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg font-rajdhani">支付宝</div>
                <div className="text-sm text-muted-foreground">推荐使用</div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                  paymentType === 'alipay'
                    ? 'border-primary bg-primary shadow-lg shadow-primary/50'
                    : 'border-muted'
                }`}
              >
                {paymentType === 'alipay' && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className={`group relative rounded-xl p-5 cursor-pointer transition-all duration-300 ${
              paymentType === 'wxpay'
                ? 'border-2 border-primary bg-primary/10 shadow-lg shadow-primary/20'
                : 'border border-primary/20 bg-card/20 hover:border-primary/40 hover:bg-card/30'
            }`}
            onClick={() => setPaymentType('wxpay')}
          >
            {paymentType === 'wxpay' && (
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            )}

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                微
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg font-rajdhani">微信支付</div>
                <div className="text-sm text-muted-foreground">扫码支付</div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                  paymentType === 'wxpay'
                    ? 'border-primary bg-primary shadow-lg shadow-primary/50'
                    : 'border-muted'
                }`}
              >
                {paymentType === 'wxpay' && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Button
          className="w-full glow-cyan hover:scale-105 transition-all duration-300 animate-fade-in-up delay-300"
          size="lg"
          onClick={handlePayment}
          disabled={isLoading}
        >
          {isLoading ? '正在创建支付...' : `确认支付 ¥${amount}`}
        </Button>

        <div className="text-center mt-6 animate-fade-in-up delay-400">
          <Button variant="ghost" onClick={() => router.push('/pricing')} className="hover:text-primary transition-colors duration-300">
            返回价格页面
          </Button>
        </div>
      </div>
    </div>
  );
}
