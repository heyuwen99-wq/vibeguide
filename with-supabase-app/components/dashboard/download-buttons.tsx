'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { downloadAllAsZip } from '@/lib/utils/download';
import { toast } from 'sonner';

interface DownloadButtonsProps {
  projectTitle: string;
  documents: {
    userJourney: string;
    prd: string;
    frontend: string;
    backend: string;
    database: string;
  };
}

export function DownloadButtons({
  projectTitle,
  documents,
}: DownloadButtonsProps) {
  const handleDownloadAll = async () => {
    try {
      await downloadAllAsZip(projectTitle, documents);
      toast.success('下载成功');
    } catch (error) {
      console.error(error);
      toast.error('下载失败');
    }
  };

  return (
    <Button onClick={handleDownloadAll} size="lg">
      <Download className="h-4 w-4 mr-2" />
      批量下载 ZIP
    </Button>
  );
}
