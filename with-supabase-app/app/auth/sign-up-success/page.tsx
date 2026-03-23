'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from 'lucide-react';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // 使用 window.location 强制刷新页面
        window.location.href = '/projects';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="border-primary/30 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-orbitron text-gradient-cyber">
                注册成功
              </CardTitle>
              <CardDescription>请查收邮件完成验证</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                我们已向您的邮箱发送了一封验证邮件，请点击邮件中的链接完成账号验证。验证完成后将自动跳转。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
