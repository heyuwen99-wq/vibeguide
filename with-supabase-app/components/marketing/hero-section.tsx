'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

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
    <section className="container mx-auto px-4 py-24 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          智能 AI 开发文档平台
          <br />
          <span className="text-primary">让编程新手轻松上手</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl">
          只需描述你的项目想法，AI 智能生成专业的开发文档：用户旅程地图、PRD、前端设计、后端设计、数据库设计。
          <br />
          让你的项目从概念到实施，清晰明了。
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            onClick={handleGetStarted}
            disabled={isLoading}
            className="text-lg"
          >
            {isLoading ? '加载中...' : '立即开始'}
          </Button>
          <Button size="lg" variant="outline" asChild className="text-lg">
            <Link href="/pricing">查看价格</Link>
          </Button>
        </div>
        <div className="mt-16">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop"
            alt="开发团队协作"
            className="rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
