import Link from 'next/link';
import { FileText, Clock } from 'lucide-react';
import type { Project } from '@/lib/db/schema';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const formattedDate = new Date(project.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statusText = project.status === 'completed' ? '已完成' : '草稿';
  const statusColor =
    project.status === 'completed' ? 'text-green-600' : 'text-yellow-600';

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block rounded-lg border p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{project.title}</h3>
            <p className={`text-sm ${statusColor}`}>{statusText}</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {project.step1Description || '无描述'}
      </p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        {formattedDate}
      </div>
    </Link>
  );
}
