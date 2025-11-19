// src/components/dashboard/DashboardSidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  BookOpen,
  Home,
  FileText,
  Tag,
  Archive,
  Settings,
  Plus,
  ChevronDown,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type Workspace = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  description: string | null;
  owner_id: string | null;
  is_personal: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};


export type Category = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  parent_id: string | null;
  workspace_id: string | null;
  position: number | null;
  created_at: string | null;
};


export default function DashboardSidebar({ user, profile }: any) {
  const pathname = usePathname();
  const supabase = createClient();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showWorkspaces, setShowWorkspaces] = useState(false);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (currentWorkspace) {
      loadCategories(currentWorkspace.id);
    }
  }, [currentWorkspace]);

  const loadWorkspaces = async () => {
    const { data } = await supabase
      .from('workspaces')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: true });

    if (data && data.length > 0) {
      setWorkspaces(data);
      // Set first workspace as current (usually "Personal")
      setCurrentWorkspace(data[0]);
    }
  };

  const loadCategories = async (workspaceId: string) => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('workspace_id', workspaceId)
      .is('parent_id', null)
      .order('position', { ascending: true });

    if (data) {
      setCategories(data);
    }
  };

  const navItems = [
    { icon: Home, label: 'All Notes', href: '/dashboard' },
    { icon: FileText, label: 'Recent', href: '/dashboard/recent' },
    { icon: Tag, label: 'Tags', href: '/dashboard/tags' },
    { icon: Archive, label: 'Archived', href: '/dashboard/archived' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <BookOpen className="w-6 h-6 text-blue-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">MyNotes</span>
      </div>

      {/* Workspace Selector */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setShowWorkspaces(!showWorkspaces)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentWorkspace?.icon || '📁'}</span>
            <span className="font-semibold text-gray-900 truncate">
              {currentWorkspace?.name || 'Personal'}
            </span>
          </div>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-gray-500 transition-transform',
              showWorkspaces && 'rotate-180'
            )}
          />
        </button>

        {/* Workspace Dropdown */}
        {showWorkspaces && (
          <div className="mt-2 space-y-1">
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => {
                  setCurrentWorkspace(workspace);
                  setShowWorkspaces(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition',
                  workspace.id === currentWorkspace?.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-100 text-gray-700'
                )}
              >
                <span className="text-lg">{workspace.icon}</span>
                <span className="truncate">{workspace.name}</span>
              </button>
            ))}
            <button
              onClick={() => {
                setShowWorkspaces(false);
                // TODO: Navigate to create workspace page
                alert('Create workspace feature coming soon!');
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Workspace</span>
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="p-4">
        <button
          onClick={() => alert('Search feature coming in Phase 6!')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm">Search notes...</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}

        {/* Categories Section */}
        {categories.length > 0 && (
          <div className="pt-4">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Categories
              </span>
              <button
                onClick={() => alert('Category management coming soon!')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/dashboard/category/${category.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  <span className="text-base">{category.icon}</span>
                  <span className="flex-1 truncate">{category.name}</span>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: category.color ?? undefined  }}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}