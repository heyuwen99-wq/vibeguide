import { createClient } from '@/lib/supabase/server';
import { db, users, payments } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Coins } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getUserData(userId: string) {
  const userRecords = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return userRecords[0] || null;
}

async function getPaymentHistory(userId: string) {
  return await db
    .select()
    .from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.createdAt))
    .limit(10);
}

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const userData = await getUserData(user.id);
  const paymentHistory = await getPaymentHistory(user.id);

  const credits = userData?.projectCredits || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      {/* 背景装饰 */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[128px] animate-pulse pointer-events-none" />

      <div className="relative animate-fade-in-up">
        <h1 className="text-4xl font-bold font-orbitron text-gradient-cyber">我的账户</h1>
        <p className="text-muted-foreground mt-2 text-lg">管理您的账户信息和点数</p>
      </div>

      {/* User Info Card */}
      <div className="relative rounded-xl border border-primary/30 p-8 bg-card/30 backdrop-blur-sm shadow-lg animate-fade-in-up delay-100">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-xl" />

        <h2 className="text-2xl font-bold font-rajdhani mb-6 text-primary">账户信息</h2>
        <div className="space-y-6">
          <div>
            <span className="text-sm text-muted-foreground font-rajdhani">邮箱地址</span>
            <p className="font-medium text-lg mt-1">{user.email}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground font-rajdhani">可用点数</span>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-primary/10 border border-primary/30">
                <Coins className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold font-orbitron text-gradient-cyber">{credits}</span>
              </div>
              {credits === 0 && (
                <Button asChild size="lg" className="glow-cyan hover:scale-105 transition-all duration-300">
                  <Link href="/pricing">获取点数</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="relative rounded-xl border border-primary/30 p-8 bg-card/30 backdrop-blur-sm shadow-lg animate-fade-in-up delay-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-xl" />

        <h2 className="text-2xl font-bold font-rajdhani mb-6 text-primary">支付历史</h2>
        {paymentHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无支付记录</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="group flex items-center justify-between rounded-xl border border-primary/20 p-5 bg-card/20 hover:bg-card/40 hover:border-primary/40 transition-all duration-300 hover:scale-[1.02]"
              >
                <div>
                  <p className="font-bold font-rajdhani text-lg">
                    购买 {payment.credits} 个点数
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(payment.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl font-orbitron">¥{payment.amount}</p>
                  <p
                    className={`text-sm font-medium mt-1 ${
                      payment.status === 'success'
                        ? 'text-green-400'
                        : payment.status === 'pending'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {payment.status === 'success'
                      ? '✓ 成功'
                      : payment.status === 'pending'
                      ? '⏳ 待支付'
                      : '✗ 失败'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
