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
    <section className="relative container mx-auto px-4 py-24 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 tech-grid opacity-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] animate-pulse" />

      <div className="relative mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl font-orbitron text-gradient-cyber">
          为什么选择 VibeGuide?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          简单、高效、专业的 <span className="text-primary font-semibold">AI 开发文档生成工具</span>
        </p>
      </div>

      <div className="relative mx-auto max-w-5xl grid gap-4 md:grid-cols-3">
        {highlights.map((highlight, index) => {
          const Icon = highlight.icon;
          return (
            <div
              key={index}
              className={`group relative rounded-xl border border-primary/20 bg-card/30 backdrop-blur-sm p-8 hover:border-primary/50 hover:bg-card/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20 ${highlight.className}`}
            >
              {/* 顶部装饰线 */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* 角落光晕 */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                {/* 图标 */}
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 shadow-lg shadow-primary/20 group-hover:bg-primary/30 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-110">
                  <Icon className="h-7 w-7 text-primary" />
                </div>

                {/* 标题 */}
                <h3 className="mt-6 text-xl font-bold font-rajdhani group-hover:text-primary transition-colors duration-300">
                  {highlight.title}
                </h3>

                {/* 描述 */}
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
