import { Sparkles, Download, Coins, Clock } from 'lucide-react';

const highlights = [
  {
    icon: Sparkles,
    title: 'AI 智能生成',
    description: '使用先进的 GLM-5 大模型，生成专业、详细的开发文档。',
    className: 'md:col-span-2',
  },
  {
    icon: Download,
    title: '一键下载',
    description: '支持单个文档下载或批量打包成 ZIP。',
    className: '',
  },
  {
    icon: Coins,
    title: '灵活点数',
    description: '按需购买项目点数，无月费，用多少买多少。',
    className: '',
  },
  {
    icon: Clock,
    title: '快速生成',
    description: '从需求输入到文档输出，仅需几分钟时间。',
    className: 'md:col-span-2',
  },
];

export function BentoGrid() {
  return (
    <section className="container mx-auto px-4 py-24 bg-muted/50">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          为什么选择 VibeGuide?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          简单、高效、专业的 AI 开发文档生成工具
        </p>
      </div>
      <div className="mx-auto max-w-5xl grid gap-4 md:grid-cols-3">
        {highlights.map((highlight, index) => {
          const Icon = highlight.icon;
          return (
            <div
              key={index}
              className={`rounded-xl border bg-card p-8 ${highlight.className}`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{highlight.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {highlight.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
