import { createClient } from '@/lib/supabase/server';
import { db, projects } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { redirect, notFound } from 'next/navigation';
import { StepIndicator } from '@/components/dashboard/step-indicator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarkdownRenderer } from '@/components/shared/markdown-renderer';
import { DownloadButtons } from '@/components/dashboard/download-buttons';

// Mark as dynamic route
export const dynamic = 'force-dynamic';

const STEPS = ['描述项目', '深入需求', '生成文档'];

async function getProject(projectId: string, userId: string) {
  const projectRecords = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .limit(1);

  return projectRecords[0] || null;
}

export default async function ProjectDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const project = await getProject(id, user.id);

  if (!project) {
    return notFound();
  }

  const hasDocuments =
    project.docUserJourney &&
    project.docPrd &&
    project.docFrontend &&
    project.docBackend &&
    project.docDatabase;

  const documents = hasDocuments
    ? {
        userJourney: project.docUserJourney!,
        prd: project.docPrd!,
        frontend: project.docFrontend!,
        backend: project.docBackend!,
        database: project.docDatabase!,
      }
    : null;

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-muted-foreground mt-2">
            创建于 {new Date(project.createdAt).toLocaleString('zh-CN')}
          </p>
        </div>

        <StepIndicator currentStep={hasDocuments ? 4 : 1} steps={STEPS} />

        {/* Step 1: Project Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. 项目描述</h2>
          <div className="rounded-lg border p-6 bg-muted/50">
            <p className="whitespace-pre-wrap">{project.step1Description || ''}</p>
          </div>
        </div>

      {/* Step 2: Deep Requirements */}
      {project.step2Questions && project.step2Answers && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. 深入需求</h2>
          <div className="rounded-lg border p-6 space-y-4">
            <div>
              <h3 className="font-medium mb-2">AI 生成的问题</h3>
              <ol className="list-decimal list-inside space-y-2">
                {(project.step2Questions as string[]).map((q, i) => (
                  <li key={i} className="text-sm">
                    {q}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-medium mb-2">您的回答</h3>
              <p className="text-sm whitespace-pre-wrap bg-muted/50 p-4 rounded">
                {project.step2Answers}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Documents */}
      {documents && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">3. 生成的文档</h2>
            <DownloadButtons
              projectTitle={project.title}
              documents={documents}
            />
          </div>

          <Tabs defaultValue="userJourney" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="userJourney">用户旅程</TabsTrigger>
              <TabsTrigger value="prd">PRD</TabsTrigger>
              <TabsTrigger value="frontend">前端设计</TabsTrigger>
              <TabsTrigger value="backend">后端设计</TabsTrigger>
              <TabsTrigger value="database">数据库设计</TabsTrigger>
            </TabsList>

            <TabsContent value="userJourney">
              <div className="border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                <MarkdownRenderer content={documents.userJourney} />
              </div>
            </TabsContent>

            <TabsContent value="prd">
              <div className="border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                <MarkdownRenderer content={documents.prd} />
              </div>
            </TabsContent>

            <TabsContent value="frontend">
              <div className="border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                <MarkdownRenderer content={documents.frontend} />
              </div>
            </TabsContent>

            <TabsContent value="backend">
              <div className="border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                <MarkdownRenderer content={documents.backend} />
              </div>
            </TabsContent>

            <TabsContent value="database">
              <div className="border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                <MarkdownRenderer content={documents.database} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

        {!hasDocuments && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">此项目尚未生成文档</p>
          </div>
        )}
      </div>
    </>
  );
}
