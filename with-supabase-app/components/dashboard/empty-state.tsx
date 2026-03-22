import { FolderOpen, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function EmptyState() {
  return (
    <div className="relative flex flex-col items-center justify-center py-24 text-center">
      {/* 背景装饰 */}
      <div className="absolute inset-0 tech-grid opacity-20 rounded-xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[128px] animate-pulse" />

      {/* 图标 */}
      <div className="relative mb-6 animate-fade-in-up">
        <div className="relative rounded-full bg-primary/10 p-8 border-2 border-primary/30 shadow-xl shadow-primary/20">
          <FolderOpen className="h-16 w-16 text-primary" />

          {/* 装饰性浮动图标 */}
          <div className="absolute -top-2 -right-2 p-2 rounded-full bg-secondary/20 border border-secondary/30 animate-bounce">
            <Sparkles className="h-4 w-4 text-secondary" />
          </div>
        </div>

        {/* 光晕效果 */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
      </div>

      {/* 文本内容 */}
      <div className="relative animate-fade-in-up delay-100">
        <h3 className="text-3xl font-bold mb-3 font-orbitron text-gradient-cyber">
          暂无项目
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md text-lg leading-relaxed">
          开始创建您的第一个项目，让 <span className="text-primary font-semibold">AI</span> 帮助您生成专业的开发文档
        </p>

        {/* 按钮 */}
        <Button asChild size="lg" className="glow-cyan hover:scale-105 transition-all duration-300 animate-fade-in-up delay-200">
          <Link href="/projects/new">
            <Plus className="mr-2 h-5 w-5" />
            创建新项目
          </Link>
        </Button>
      </div>

      {/* 底部装饰性提示 */}
      <div className="relative mt-12 flex items-center gap-8 text-sm text-muted-foreground animate-fade-in-up delay-300">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>5 种专业文档</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse delay-100" />
          <span>AI 智能生成</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-200" />
          <span>30 秒完成</span>
        </div>
      </div>
    </div>
  );
}
