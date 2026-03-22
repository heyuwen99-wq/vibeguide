import { Map, FileText, Layout, Server, Database } from 'lucide-react';

const features = [
  {
    icon: Map,
    title: '用户旅程地图',
    description: '清晰了解用户在产品中的每一步操作，识别痛点和机会点。',
  },
  {
    icon: FileText,
    title: '产品需求文档 PRD',
    description: '详细的功能需求、用户故事、验收标准，让团队对齐目标。',
  },
  {
    icon: Layout,
    title: '前端设计文档',
    description: '组件结构、状态管理、路由设计，为前端开发提供完整蓝图。',
  },
  {
    icon: Server,
    title: '后端设计文档',
    description: 'API 接口、业务逻辑、系统架构，构建稳定可靠的后端服务。',
  },
  {
    icon: Database,
    title: '数据库设计文档',
    description: 'ER 图、表结构、索引设计，为数据持久化打下坚实基础。',
  },
];

export function FeaturesSection() {
  return (
    <section className="relative container mx-auto px-4 py-24 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[128px] animate-pulse" />

      <div className="relative mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl font-orbitron text-gradient-cyber">
          一站式文档生成
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          从需求到实施，<span className="text-primary font-semibold">5 种专业文档</span>助力您的项目成功
        </p>
      </div>

      {/* 第一行：2个主要功能卡片（较大） */}
      <div className="relative mt-16 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto mb-8">
        {features.slice(0, 2).map((feature, index) => {
          const Icon = feature.icon;
          const delay = index * 100;
          return (
            <div
              key={index}
              className="group relative rounded-xl border border-primary/20 p-8 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-card/60 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${delay}ms` }}
            >
              {/* 顶部装饰线 */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* 角落光晕 */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 shadow-lg shadow-primary/20 group-hover:bg-primary/30 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-110 mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-2xl font-rajdhani group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 第二行：3个次要功能卡片（较小） */}
      <div className="relative grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {features.slice(2).map((feature, index) => {
          const Icon = feature.icon;
          const delay = (index + 2) * 100;
          return (
            <div
              key={index + 2}
              className="group relative rounded-xl border border-primary/20 p-6 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-card/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${delay}ms` }}
            >
              {/* 顶部装饰线 */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* 角落光晕 */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 group-hover:bg-primary/30 group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
                    <Icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-bold text-lg font-rajdhani group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
