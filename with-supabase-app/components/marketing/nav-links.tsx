'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: '首页' },
  { href: '/pricing', label: '价格' },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 items-center space-x-6 text-sm font-medium font-rajdhani">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'relative py-5 transition-all duration-300 hover:text-primary group',
              isActive ? 'text-primary' : 'text-foreground/80'
            )}
          >
            {item.label}
            <span
              className={cn(
                'absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300',
                isActive ? 'w-full' : 'w-0 group-hover:w-full'
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
