"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Mail } from "lucide-react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "发生错误";
      const errorMap: Record<string, string> = {
        "User not found": "未找到该邮箱关联的账号",
        "Email rate limit exceeded": "发送过于频繁，请稍后再试",
      };
      setError(errorMap[message] || message);
    } finally {
      setIsLoading(false);
    }
  };

  // 监听密码重置完成
  useEffect(() => {
    if (!success) return;

    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        window.location.href = '/projects';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [success]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card className="border-primary/30 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">查收邮件</CardTitle>
            <CardDescription>密码重置链接已发送</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              我们已向您的邮箱发送了密码重置链接，请点击链接重置密码。完成后将自动跳转。
            </p>
            <div className="mt-4 text-center">
              <Link
                href="/auth/login"
                className="text-sm text-primary hover:underline"
              >
                返回登录
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-primary/30 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">重置密码</CardTitle>
            <CardDescription>
              输入您的邮箱，我们将发送密码重置链接
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "发送中..." : "发送重置链接"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                想起密码了？{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  返回登录
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
