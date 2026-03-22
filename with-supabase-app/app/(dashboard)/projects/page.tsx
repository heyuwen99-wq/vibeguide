import { createClient } from '@/lib/supabase/server';
import { db, projects } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ProjectCard } from '@/components/dashboard/project-card';
import { EmptyState } from '@/components/dashboard/empty-state';

export const dynamic = 'force-dynamic';

async function getUserProjects(userId: string) {
  return await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.createdAt));
}

export default async function ProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const userProjects = await getUserProjects(user.id);

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* 背景装饰 */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[128px] animate-pulse pointer-events-none" />

      <div className="relative flex items-center justify-between mb-8">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl font-bold font-orbitron text-gradient-cyber">我的项目</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            管理您的所有项目和文档
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="glow-cyan hover:scale-105 transition-all duration-300 animate-fade-in-up delay-100"
        >
          <Link href="/projects/new">
            <Plus className="h-5 w-5 mr-2" />
            新建项目
          </Link>
        </Button>
      </div>

      {userProjects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
