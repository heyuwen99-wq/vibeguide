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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">我的账户</h1>
        <p className="text-muted-foreground mt-2">管理您的账户信息和点数</p>
      </div>

      {/* User Info Card */}
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">账户信息</h2>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-muted-foreground">邮箱</span>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">项目点数</span>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{credits}</span>
              </div>
              {credits === 0 && (
                <Button asChild size="sm">
                  <Link href="/pricing">获取点数</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">支付历史</h2>
        {paymentHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无支付记录</p>
        ) : (
          <div className="space-y-2">
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">
                    购买 {payment.credits} 个点数
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">¥{payment.amount}</p>
                  <p
                    className={`text-sm ${
                      payment.status === 'success'
                        ? 'text-green-600'
                        : payment.status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {payment.status === 'success'
                      ? '成功'
                      : payment.status === 'pending'
                      ? '待支付'
                      : '失败'}
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
