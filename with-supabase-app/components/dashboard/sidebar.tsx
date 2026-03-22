'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderOpen, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: '我的项目',
    href: '/projects',
    icon: FolderOpen,
  },
  {
    name: '新建项目',
    href: '/projects/new',
    icon: Plus,
  },
  {
    name: '我的',
    href: '/my',
    icon: User,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-muted/40 p-6">
      <div className="mb-8">
        <Link href="/" className="text-2xl font-bold">
          VibeGuide
        </Link>
      </div>
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
