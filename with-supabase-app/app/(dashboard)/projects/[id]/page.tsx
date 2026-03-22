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
      <div className="max-w-5xl mx-auto relative">
        {/* 背景装饰 */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[128px] animate-pulse pointer-events-none" />

        <div className="relative mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold font-orbitron text-gradient-cyber">{project.title}</h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            创建于 {new Date(project.createdAt).toLocaleString('zh-CN')}
          </p>
        </div>

        <StepIndicator currentStep={hasDocuments ? 4 : 1} steps={STEPS} />

        {/* Step 1: Project Description */}
        <div className="mb-8 animate-fade-in-up delay-100">
          <h2 className="text-2xl font-bold font-rajdhani mb-4 text-primary">1. 项目描述</h2>
          <div className="relative rounded-xl border border-primary/30 p-6 bg-card/30 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <p className="whitespace-pre-wrap leading-relaxed">{project.step1Description || ''}</p>
          </div>
        </div>

      {/* Step 2: Deep Requirements */}
      {project.step2Questions && project.step2Answers && (
        <div className="mb-8 animate-fade-in-up delay-200">
          <h2 className="text-2xl font-bold font-rajdhani mb-4 text-primary">2. 深入需求</h2>
          <div className="relative rounded-xl border border-primary/30 p-6 space-y-6 bg-card/30 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div>
              <h3 className="font-bold font-rajdhani mb-3 text-lg">AI 生成的问题</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                {(project.step2Questions as string[]).map((q, i) => (
                  <li key={i} className="text-sm leading-relaxed">
                    {q}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-bold font-rajdhani mb-3 text-lg">您的回答</h3>
              <div className="relative rounded-lg border border-primary/20 bg-muted/30 p-4">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {project.step2Answers}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Documents */}
      {documents && (
        <div className="animate-fade-in-up delay-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-rajdhani text-primary">3. 生成的文档</h2>
            <DownloadButtons
              projectTitle={project.title}
              documents={documents}
            />
          </div>

          <div className="relative rounded-xl border border-primary/30 p-6 bg-card/30 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <Tabs defaultValue="userJourney" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-muted/30 p-1 rounded-lg border border-primary/20">
                <TabsTrigger value="userJourney" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-300 font-rajdhani font-bold">用户旅程</TabsTrigger>
                <TabsTrigger value="prd" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-300 font-rajdhani font-bold">PRD</TabsTrigger>
                <TabsTrigger value="frontend" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-300 font-rajdhani font-bold">前端设计</TabsTrigger>
                <TabsTrigger value="backend" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-300 font-rajdhani font-bold">后端设计</TabsTrigger>
                <TabsTrigger value="database" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-300 font-rajdhani font-bold">数据库设计</TabsTrigger>
              </TabsList>

              <TabsContent value="userJourney">
                <div className="border border-primary/20 rounded-lg p-6 max-h-[600px] overflow-y-auto bg-card/20 backdrop-blur-sm">
                  <MarkdownRenderer content={documents.userJourney} />
                </div>
              </TabsContent>

              <TabsContent value="prd">
                <div className="border border-primary/20 rounded-lg p-6 max-h-[600px] overflow-y-auto bg-card/20 backdrop-blur-sm">
                  <MarkdownRenderer content={documents.prd} />
                </div>
              </TabsContent>

              <TabsContent value="frontend">
                <div className="border border-primary/20 rounded-lg p-6 max-h-[600px] overflow-y-auto bg-card/20 backdrop-blur-sm">
                  <MarkdownRenderer content={documents.frontend} />
                </div>
              </TabsContent>

              <TabsContent value="backend">
                <div className="border border-primary/20 rounded-lg p-6 max-h-[600px] overflow-y-auto bg-card/20 backdrop-blur-sm">
                  <MarkdownRenderer content={documents.backend} />
                </div>
              </TabsContent>

              <TabsContent value="database">
                <div className="border border-primary/20 rounded-lg p-6 max-h-[600px] overflow-y-auto bg-card/20 backdrop-blur-sm">
                  <MarkdownRenderer content={documents.database} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

        {!hasDocuments && (
          <div className="text-center py-12 animate-fade-in-up delay-300">
            <p className="text-muted-foreground">此项目尚未生成文档</p>
          </div>
        )}
      </div>
    </>
  );
}
