'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderOpen, Plus, User, Zap } from 'lucide-react';
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
    <aside className="w-64 border-r border-primary/20 bg-card/20 backdrop-blur-md p-6 relative">
      {/* 侧边装饰线 */}
      <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent" />

      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-primary/20 border border-primary/30 group-hover:bg-primary/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/50">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <span className="text-2xl font-bold font-orbitron text-gradient-cyber">
            VibeGuide
          </span>
        </Link>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          // 精确匹配，避免 /projects 和 /projects/new 同时高亮
          const isActive = pathname === item.href ||
            (item.href === '/projects' && pathname.startsWith('/projects/') && pathname !== '/projects/new') ||
            (item.href !== '/projects' && pathname.startsWith(item.href + '/'));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium font-rajdhani transition-all duration-300',
                isActive
                  ? 'bg-primary/20 text-primary border border-primary/50 shadow-lg shadow-primary/20'
                  : 'hover:bg-primary/10 hover:border-primary/30 border border-transparent hover:text-primary'
              )}
            >
              {/* 激活状态的左侧装饰条 */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary/0 via-primary to-primary/0 rounded-r-full" />
              )}

              <Icon className={cn(
                "h-5 w-5 transition-transform duration-300",
                isActive ? "text-primary" : "group-hover:scale-110"
              )} />
              {item.name}

              {/* 悬停光晕 */}
              <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </Link>
          );
        })}
      </nav>

      {/* 底部装饰 */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
    </aside>
  );
}
