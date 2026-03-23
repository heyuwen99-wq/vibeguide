import Link from 'next/link';
import { AuthButton } from '@/components/auth-button';
import { Zap } from 'lucide-react';
import { NavLinks } from './nav-links';

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60 shadow-lg shadow-primary/5">
      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-8 flex">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-primary/20 border border-primary/30 group-hover:bg-primary/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/50">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xl font-bold font-orbitron text-gradient-cyber">
              VibeGuide
            </span>
          </Link>
        </div>
        <NavLinks />
        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
