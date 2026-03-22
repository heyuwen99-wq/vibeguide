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
    <section className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          一站式文档生成
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          从需求到实施，5 种专业文档助力您的项目成功
        </p>
      </div>
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="relative rounded-lg border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
