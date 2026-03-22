'use client';

import Link from 'next/link';
import { FileText, Clock, CheckCircle2, FileEdit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Project } from '@/lib/db/schema';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const formattedDate = new Date(project.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isCompleted = project.status === 'completed';
  const statusText = isCompleted ? '已完成' : '草稿';
  const statusColor = isCompleted ? 'text-green-400' : 'text-yellow-400';
  const StatusIcon = isCompleted ? CheckCircle2 : FileEdit;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert('删除项目失败，请重试');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
    <Link
      href={`/projects/${project.id}`}
      className="group relative block rounded-xl border border-primary/20 p-6 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-card/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20"
    >
      {/* 顶部装饰线 */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* 角落光晕效果 */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/20 p-3 group-hover:bg-primary/30 transition-colors duration-300 border border-primary/30">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-xl font-rajdhani group-hover:text-primary transition-colors duration-300">
                {project.title}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <StatusIcon className={`h-3 w-3 ${statusColor}`} />
                <p className={`text-sm font-medium ${statusColor}`}>{statusText}</p>
              </div>
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className="rounded-lg bg-destructive/20 p-2 hover:bg-destructive/30 transition-all duration-300 border border-destructive/30 hover:border-destructive/50 hover:shadow-lg hover:shadow-destructive/20"
            title="删除项目"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {project.step1Description || '无描述'}
        </p>

        <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
          <Clock className="h-3 w-3" />
          {formattedDate}
        </div>
      </div>
    </Link>

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            确定要删除项目「{project.title}」吗？此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? '删除中...' : '确认删除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
