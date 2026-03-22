import { HeroSection } from '@/components/marketing/hero-section';
import { FeaturesSection } from '@/components/marketing/features-section';
import { BentoGrid } from '@/components/marketing/bento-grid';
import { StatsSection } from '@/components/marketing/stats-section';
import { FaqSection } from '@/components/marketing/faq-section';
import { PricingCards } from '@/components/marketing/pricing-cards';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <BentoGrid />
      <StatsSection />
      <section className="relative container mx-auto px-4 py-24 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] animate-pulse" />

        <div className="relative mx-auto max-w-2xl text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl font-orbitron text-gradient-cyber">
            简单透明的价格
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            按需购买，<span className="text-primary font-semibold">无月费</span>，用多少买多少
          </p>
        </div>
        <div className="relative animate-fade-in-up delay-200">
          <PricingCards />
        </div>
      </section>
      <FaqSection />
    </>
  );
}
