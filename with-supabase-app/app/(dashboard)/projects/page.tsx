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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">我的项目</h1>
          <p className="text-muted-foreground mt-2">
            管理您的所有项目和文档
          </p>
        </div>
        <Button asChild size="lg">
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
