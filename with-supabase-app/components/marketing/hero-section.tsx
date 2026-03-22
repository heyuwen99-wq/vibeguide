'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Sparkles, Zap, Code2 } from 'lucide-react';

export function HeroSection() {
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

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/projects');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <section className="relative container mx-auto px-4 py-24 md:py-32 overflow-hidden">
      {/* 网格背景 */}
      <div className="absolute inset-0 tech-grid opacity-40" />

      {/* 渐变光晕背景 */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] animate-pulse delay-1000" />

      {/* 扫描线效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="scan-line absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* 浮动图标装饰 */}
        <div className="absolute -top-10 -left-10 text-primary/20 animate-bounce">
          <Code2 size={60} />
        </div>
        <div className="absolute -top-5 -right-5 text-secondary/20 animate-bounce delay-200">
          <Sparkles size={40} />
        </div>

        <div className="text-center space-y-8">
          {/* 标题 */}
          <div className="space-y-4 opacity-0 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/50 bg-primary/10 backdrop-blur-sm">
              <Zap size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">AI 驱动的智能开发助手</span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              <span className="block">智能 AI 开发</span>
              <span className="block text-gradient-cyber mt-2">文档生成平台</span>
            </h1>
          </div>

          {/* 副标题 */}
          <p className="mt-6 text-lg md:text-xl mx-auto max-w-3xl leading-relaxed text-muted-foreground opacity-0 animate-fade-in-up delay-100">
            只需<span className="text-primary font-semibold">描述你的项目想法</span>，AI 智能生成专业的开发文档：<br className="hidden md:block" />
            用户旅程地图、PRD、前端设计、后端设计、数据库设计。<br />
            让你的项目从<span className="text-secondary font-semibold">概念到实施</span>，清晰明了。
          </p>

          {/* 按钮组 */}
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center opacity-0 animate-fade-in-up delay-200">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoading}
              className="text-lg font-semibold px-8 py-6 glow-cyan hover:scale-105 transition-all duration-300"
            >
              <Zap className="mr-2" size={20} />
              {isLoading ? '加载中...' : '立即开始'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6 border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-300"
            >
              <Link href="/pricing">
                <Sparkles className="mr-2" size={20} />
                查看价格
              </Link>
            </Button>
          </div>

          {/* 特性卡片组 */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-0 animate-fade-in-up delay-300">
            {[
              { icon: Code2, title: '5种专业文档', desc: '一键生成完整开发文档' },
              { icon: Zap, title: '极速生成', desc: '30秒完成需求分析' },
              { icon: Sparkles, title: 'AI 深度理解', desc: '智能问答精准把握需求' }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-card/80 transition-all duration-300 hover:scale-105"
              >
                {/* 卡片光晕效果 */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  <feature.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 装饰性代码块 */}
          <div className="mt-16 relative opacity-0 animate-fade-in-up delay-400">
            <div className="mx-auto max-w-3xl p-6 rounded-xl border border-primary/30 bg-card/30 backdrop-blur-md overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="mt-8 space-y-2 text-left font-mono text-sm">
                <div className="text-secondary">// 描述你的想法</div>
                <div className="text-muted-foreground">const project = <span className="text-primary">"我想做一个AI记账应用"</span>;</div>
                <div className="text-secondary">// AI 自动生成</div>
                <div className="text-muted-foreground">generate(<span className="text-primary">project</span>); <span className="text-green-400">// ✓ 5份专业文档已生成</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
