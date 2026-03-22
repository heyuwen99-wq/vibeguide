'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StepIndicator } from '@/components/dashboard/step-indicator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { MarkdownRenderer } from '@/components/shared/markdown-renderer';
import { downloadMarkdown, downloadAllAsZip } from '@/lib/utils/download';
import { toast } from 'sonner';

const STEPS = ['描述项目', '深入需求', '生成文档'];

export default function NewProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1
  const [description, setDescription] = useState('');

  // Step 2
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState('');
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);

  // Step 3
  const [documents, setDocuments] = useState<{
    userJourney: string;
    prd: string;
    frontend: string;
    backend: string;
    database: string;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [projectId, setProjectId] = useState<string | null>(null);

  const handleStep1Next = async () => {
    if (description.length < 20) {
      toast.error('项目描述至少需要 20 个字符');
      return;
    }

    setIsLoading(true);
    try {
      // Generate questions
      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
      setCurrentStep(2);
    } catch (error) {
      console.error(error);
      toast.error('生成问题失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Next = async () => {
    if (!answers.trim()) {
      toast.error('请回答问题');
      return;
    }

    // Check credits (simplified - should fetch from server)
    // For now, we'll try to proceed and let the server check
    setIsLoading(true);
    try {
      // Create project first
      const createResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: description.slice(0, 50),
          step1Description: description,
          step2Questions: questions,
          step2Answers: answers,
        }),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create project');
      }

      const createData = await createResponse.json();
      setProjectId(createData.project.id);
      setCurrentStep(3);

      // Start document generation
      generateDocuments(createData.project.id);
    } catch (error) {
      console.error(error);
      toast.error('创建项目失败，请重试');
      setIsLoading(false);
    }
  };

  const generateDocuments = async (pid: string) => {
    try {
      setProgress(10);

      const response = await fetch('/api/ai/generate-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          answers,
          projectId: pid,
        }),
      });

      setProgress(50);

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 402) {
          setShowCreditsDialog(true);
          setIsLoading(false);
          setCurrentStep(2);
          return;
        }
        throw new Error(errorData.error || 'Failed to generate documents');
      }

      const data = await response.json();
      setProgress(90);
      setDocuments(data.documents);
      setProgress(100);
      toast.success('文档生成成功！');
    } catch (error) {
      console.error(error);
      toast.error('生成文档失败，请重试');
      setCurrentStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProject = () => {
    toast.success('项目已保存');
    router.push('/projects');
  };

  const handleDownloadSingle = (docName: string, content: string) => {
    downloadMarkdown(docName, content);
    toast.success('下载成功');
  };

  const handleDownloadAll = async () => {
    if (!documents) return;
    await downloadAllAsZip(description.slice(0, 30), documents);
    toast.success('下载成功');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">创建新项目</h1>
        <p className="text-muted-foreground mt-2">
          使用 AI Agent 辅助您完成专业的项目需求分析
        </p>
      </div>

      <StepIndicator currentStep={currentStep} steps={STEPS} />

      {/* Step 1: Project Description */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              项目描述 <span className="text-destructive">*</span>
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请详细描述您的项目想法，包括项目目标、主要功能、目标用户等（至少 20 个字符）..."
              rows={10}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {description.length} / 20 字符
            </p>
          </div>
          <Button
            size="lg"
            onClick={handleStep1Next}
            disabled={isLoading || description.length < 20}
          >
            {isLoading ? '生成问题中...' : '下一步'}
          </Button>
        </div>
      )}

      {/* Step 2: Deep Requirements */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">AI 生成的深入问题</h3>
            {questions.length === 0 ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <ol className="list-decimal list-inside space-y-2 mb-6">
                {questions.map((q, i) => (
                  <li key={i} className="text-sm">
                    {q}
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              您的回答 <span className="text-destructive">*</span>
            </label>
            <Textarea
              value={answers}
              onChange={(e) => setAnswers(e.target.value)}
              placeholder="请详细回答上述问题，帮助 AI 更好地理解您的需求..."
              rows={12}
              className="resize-none"
            />
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              上一步
            </Button>
            <Button
              size="lg"
              onClick={handleStep2Next}
              disabled={isLoading || !answers.trim()}
            >
              {isLoading ? '创建中...' : '下一步（消耗 1 点数）'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Document Creation */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {isLoading || !documents ? (
            <div>
              <Progress value={progress} className="mb-4" />
              <LoadingSpinner text="AI 正在生成您的专业开发文档，请稍候..." />
            </div>
          ) : (
            <>
              <Tabs defaultValue="userJourney" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="userJourney">用户旅程</TabsTrigger>
                  <TabsTrigger value="prd">PRD</TabsTrigger>
                  <TabsTrigger value="frontend">前端设计</TabsTrigger>
                  <TabsTrigger value="backend">后端设计</TabsTrigger>
                  <TabsTrigger value="database">数据库设计</TabsTrigger>
                </TabsList>

                <TabsContent value="userJourney" className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownloadSingle('用户旅程地图', documents.userJourney)
                      }
                    >
                      下载此文档
                    </Button>
                  </div>
                  <div className="border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                    <MarkdownRenderer content={documents.userJourney} />
                  </div>
                </TabsContent>

                <TabsContent value="prd" className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadSingle('产品需求PRD', documents.prd)}
                    >
                      下载此文档
                    </Button>
                  </div>
                  <div className="border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                    <MarkdownRenderer content={documents.prd} />
                  </div>
                </TabsContent>

                <TabsContent value="frontend" className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownloadSingle('前端设计', documents.frontend)
                      }
                    >
                      下载此文档
                    </Button>
                  </div>
                  <div className="border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                    <MarkdownRenderer content={documents.frontend} />
                  </div>
                </TabsContent>

                <TabsContent value="backend" className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownloadSingle('后端设计', documents.backend)
                      }
                    >
                      下载此文档
                    </Button>
                  </div>
                  <div className="border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                    <MarkdownRenderer content={documents.backend} />
                  </div>
                </TabsContent>

                <TabsContent value="database" className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownloadSingle('数据库设计', documents.database)
                      }
                    >
                      下载此文档
                    </Button>
                  </div>
                  <div className="border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                    <MarkdownRenderer content={documents.database} />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-4">
                <Button size="lg" onClick={handleDownloadAll}>
                  批量下载 ZIP
                </Button>
                <Button size="lg" variant="outline" onClick={handleSaveProject}>
                  保存项目
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Credits Dialog */}
      <ConfirmDialog
        open={showCreditsDialog}
        onOpenChange={setShowCreditsDialog}
        title="点数不足"
        description="您的项目点数不足，无法生成文档。请前往充值页面购买点数。"
        confirmText="去充值"
        onConfirm={() => router.push('/pricing')}
      />
    </div>
  );
}
