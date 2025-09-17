import { Grid3X3, List, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ModeToggle } from './mode-toggle';
import UserMenu from './user-menu';

type HeaderProps = {
  title?: string;
  showSearch?: boolean;
  showViewControls?: boolean;
  showFilters?: boolean;
  onSearchChange?: (value: string) => void;
  onViewChange?: (view: 'grid' | 'list') => void;
  currentView?: 'grid' | 'list';
};

export default function Header({
  title = 'Collections',
  showSearch = true,
  showViewControls = true,
  showFilters = true,
  onSearchChange,
  onViewChange,
  currentView = 'grid',
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange?.(value);
  };

  return (
    <div className="border-border border-b bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Title and Search */}
        <div className="flex flex-1 items-center gap-4">
          <h1 className="font-semibold text-2xl">{title}</h1>

          {showSearch && (
            <div className="relative max-w-md flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
              <Input
                className="pl-10"
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search"
                value={searchValue}
              />
            </div>
          )}
        </div>

        {/* Right side - Controls and User Menu */}
        <div className="flex items-center gap-2">
          {showFilters && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Status</DropdownMenuItem>
                <DropdownMenuItem>Category Tag</DropdownMenuItem>
                <DropdownMenuItem>Event Date</DropdownMenuItem>
                <DropdownMenuItem>Expiry Date</DropdownMenuItem>
                <DropdownMenuItem>Starred</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {showViewControls && (
            <div className="flex rounded-lg border">
              <Button
                className="rounded-r-none"
                onClick={() => onViewChange?.('grid')}
                size="sm"
                variant={currentView === 'grid' ? 'default' : 'ghost'}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                className="rounded-l-none"
                onClick={() => onViewChange?.('list')}
                size="sm"
                variant={currentView === 'list' ? 'default' : 'ghost'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="mr-2 h-4 w-4" />
            New Collection
          </Button>

          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
