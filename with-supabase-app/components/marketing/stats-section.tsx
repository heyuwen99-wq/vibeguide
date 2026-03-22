const stats = [
  { label: '注册用户', value: '1,000+' },
  { label: '生成项目', value: '5,000+' },
  { label: '文档下载', value: '20,000+' },
  { label: '满意度', value: '98%' },
];

export function StatsSection() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary">{stat.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
