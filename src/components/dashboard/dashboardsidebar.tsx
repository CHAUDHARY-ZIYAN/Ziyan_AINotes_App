'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  BookOpen,
  Home,
  FileText,
  Search,
  Archive,
  Settings,
  Plus,
  ChevronDown,
  Tag,
} from 'lucide-react';
import { cn, logger } from '@/lib/utils';

import { workspaceService } from '@/services/workspaces';
import { categoryService } from '@/services/categories';
import { Workspace, Category } from '@/types/supabase';


import { useWorkspaces } from '@/contexts/WorkspaceContext';

export default function DashboardSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspaces();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showWorkspaces, setShowWorkspaces] = useState(false);

  useEffect(() => {
    if (currentWorkspace) {
      loadCategories(currentWorkspace.id);
    }
  }, [currentWorkspace]);

  const loadCategories = async (workspaceId: string) => {
    try {
      const data = await categoryService.getCategories(workspaceId);
      if (data) {
        setCategories(data);
      }
    } catch (error: unknown) {
      logger.error('Failed to load categories in sidebar:', error);
    }
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'Recent', href: '/dashboard/recent' },
    { icon: Search, label: 'Search', href: '/dashboard/search' },
    { icon: Tag, label: 'Tags', href: '/dashboard/tags' },
    { icon: Archive, label: 'Archived', href: '/dashboard/archived' },
  ];

  if (!user) return null;

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
            <Link
              href="/dashboard/create-workspace"
              onClick={() => setShowWorkspaces(false)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Workspace</span>
            </Link>
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
          // Exact match for dashboard home, startsWith for others to handle sub-routes
          const isActive = item.href === '/dashboard'
            ? pathname === item.href
            : pathname?.startsWith(item.href);

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
              <Link
                href="/dashboard/categories/new"
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </Link>
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
                    style={{ backgroundColor: category.color ?? undefined }}
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