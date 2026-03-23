import Link from "next/link";
import { SignUpForm } from "@/components/sign-up-form";
import { UserPlus, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 overflow-hidden">
      {/* 网格背景 */}
      <div className="absolute inset-0 tech-grid opacity-30" />

      {/* 渐变光晕 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] animate-pulse delay-1000" />

      {/* 装饰性图标 */}
      <div className="absolute top-10 left-10 text-primary/10 animate-bounce">
        <UserPlus size={80} />
      </div>

      {/* 返回主页按钮 */}
      <div className="absolute top-6 right-6 z-50">
        <Button variant="outline" asChild className="border-primary/50 hover:bg-primary/20 hover:border-primary">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            返回主页
          </Link>
        </Button>
      </div>

      <div className="relative w-full max-w-md">
        {/* 标题 */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold font-orbitron text-gradient-cyber mb-2">
            开始旅程
          </h1>
          <p className="text-muted-foreground">创建您的账户</p>
        </div>

        {/* 注册表单卡片 */}
        <div className="relative border border-primary/30 rounded-xl p-8 bg-card/50 backdrop-blur-md shadow-2xl glow-cyan animate-fade-in-up delay-100">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
