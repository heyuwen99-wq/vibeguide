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
      <section className="container mx-auto px-4 py-24 bg-muted/50">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            简单透明的价格
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            按需购买，无月费，用多少买多少
          </p>
        </div>
        <PricingCards />
      </section>
      <FaqSection />
    </>
  );
}
