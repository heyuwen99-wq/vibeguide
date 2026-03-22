import { FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <FolderOpen className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">暂无项目</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        开始创建您的第一个项目，让 AI 帮助您生成专业的开发文档
      </p>
      <Button asChild size="lg">
        <Link href="/projects/new">创建新项目</Link>
      </Button>
    </div>
  );
}
