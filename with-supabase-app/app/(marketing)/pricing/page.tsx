import { PricingCards } from '@/components/marketing/pricing-cards';

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          选择适合您的套餐
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          灵活的点数制计费，按需购买，无月费，用多少买多少
        </p>
      </div>
      <PricingCards />
      <div className="mx-auto max-w-3xl mt-16 rounded-lg border p-8 bg-muted/50">
        <h3 className="text-xl font-semibold mb-4">点数说明</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• 每生成 1 个完整项目（包含 5 种文档）消耗 1 个项目点数</li>
          <li>• 点数永不过期，可随时使用</li>
          <li>• 已生成的项目文档永久保存在您的账户中</li>
          <li>• 支持支付宝和微信支付，支付成功后立即到账</li>
        </ul>
      </div>
    </div>
  );
}
