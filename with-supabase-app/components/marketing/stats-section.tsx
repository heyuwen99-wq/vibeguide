import { TrendingUp, Users, FileCheck, Star } from 'lucide-react';

const stats = [
  { label: '注册用户', value: '1,000+', icon: Users },
  { label: '生成项目', value: '5,000+', icon: FileCheck },
  { label: '文档下载', value: '20,000+', icon: TrendingUp },
  { label: '满意度', value: '98%', icon: Star },
];

export function StatsSection() {
  return (
    <section className="relative container mx-auto px-4 py-24 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 tech-grid opacity-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative text-center p-8 rounded-xl border border-primary/20 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-card/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20"
              >
                {/* 顶部装饰线 */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                {/* 角落光晕 */}
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  {/* 图标 */}
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-xl bg-primary/20 border border-primary/30 group-hover:bg-primary/30 group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  {/* 数值 */}
                  <div className="text-5xl font-bold text-gradient-cyber mb-3 font-orbitron group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>

                  {/* 标签 */}
                  <div className="text-sm text-muted-foreground font-rajdhani font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
