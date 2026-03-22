import { Sidebar } from '@/components/dashboard/sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { CreditsBadge } from '@/components/dashboard/credits-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

async function getUserData(userId: string) {
  const userRecords = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return userRecords[0] || null;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const userData = await getUserData(user.id);
  const credits = userData?.projectCredits || 0;

  return (
    <div className="flex min-h-screen relative">
      {/* 全局背景装饰 */}
      <div className="fixed inset-0 tech-grid opacity-20 pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[128px] animate-pulse pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[128px] animate-pulse delay-1000 pointer-events-none" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col relative">
        {/* Top bar */}
        <header className="border-b border-primary/20 h-16 flex items-center justify-end px-6 gap-4 bg-card/30 backdrop-blur-md relative">
          {/* 顶部装饰线 */}
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <CreditsBadge credits={credits} />
          <Avatar className="border-2 border-primary/30 shadow-lg shadow-primary/20">
            <AvatarFallback className="bg-primary/20 text-primary font-bold">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <form action="/auth/signout" method="post">
            <Button variant="ghost" size="sm" type="submit" className="hover:bg-primary/10 hover:text-primary transition-all duration-300">
              <LogOut className="h-4 w-4 mr-2" />
              退出
            </Button>
          </form>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 relative overflow-auto">{children}</main>
      </div>
    </div>
  );
}
