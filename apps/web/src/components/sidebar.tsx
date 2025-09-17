import { Link, useLocation } from '@tanstack/react-router';
import { ChevronDown, FolderOpen, Home, Settings, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    title: 'Collections',
    icon: FolderOpen,
    href: '/galleries',
    isActive: true,
  },
  {
    title: 'Starred',
    icon: Star,
    href: '/starred',
  },
  {
    title: 'Homepage',
    icon: Home,
    href: '/homepage',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex w-64 flex-col border-border border-r bg-background">
      {/* Header */}
      <div className="border-border border-b p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
            <span className="font-semibold text-sm text-white">CG</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Client Gallery</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )}
                  to={item.href}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Storage Info */}
      <div className="border-border border-t p-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-teal-500">
            <span className="text-white text-xs">□</span>
          </div>
          <span>Storage</span>
        </div>
        <div className="mt-2">
          <div className="text-muted-foreground text-sm">0 GB of 3 GB used</div>
          <div className="mt-1 h-2 w-full rounded-full bg-muted">
            <div className="h-2 w-0 rounded-full bg-teal-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
