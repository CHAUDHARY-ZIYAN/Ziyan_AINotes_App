// src/app/(dashboard)/dashboard/categories/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Database } from '@/types/supabase';
import { getErrorMessage, logger } from '@/lib/utils';

type Workspace = Database['public']['Tables']['workspaces']['Row'];

export default function NewCategoryPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [workspacesLoading, setWorkspacesLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    icon: '📌',
    color: '#94a3b8',
    workspace_id: '',
  });

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    setWorkspacesLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('workspaces')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: true });

    if (data && data.length > 0) {
      setWorkspaces(data);
      setFormData((prev) => ({ ...prev, workspace_id: data[0].id }));
    } else {
      // No workspaces - show message and redirect
      toast.error('Please create a workspace first');
      setTimeout(() => {
        router.push('/dashboard/workspaces/new');
      }, 1500);
    }
    setWorkspacesLoading(false);
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (!formData.workspace_id) {
      toast.error('Please select a workspace');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('categories').insert({
        name: formData.name,
        icon: formData.icon,
        color: formData.color,
        workspace_id: formData.workspace_id,
      });

      if (error) throw error;

      toast.success('Category created! Refreshing...');
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 500);
    } catch (error: unknown) {
      logger.error('Create error:', error);
      toast.error(getErrorMessage(error) || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  if (workspacesLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">📁</div>
          <h2 className="text-xl font-semibold text-yellow-900 mb-2">
            No Workspaces Found
          </h2>
          <p className="text-yellow-800 mb-6">
            You need to create a workspace before creating categories.
          </p>
          <button
            onClick={() => router.push('/dashboard/workspaces/new')}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium"
          >
            Create Your First Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Category
        </h1>
        <p className="text-gray-600">
          Organize your notes with custom categories and tags.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Preview Card */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Preview
          </p>
          <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
            <span className="text-3xl">{formData.icon}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {formData.name || 'Category Name'}
              </h3>
              <p className="text-xs text-gray-500">
                in {workspaces.find(w => w.id === formData.workspace_id)?.name || 'Workspace'}
              </p>
            </div>
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: formData.color }}
            />
          </div>
        </div>

        {/* Workspace Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Workspace *
          </label>
          <select
            value={formData.workspace_id}
            onChange={(e) =>
              setFormData({ ...formData, workspace_id: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.icon} {workspace.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Categories are organized within workspaces
          </p>
        </div>

        {/* Icon & Color */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon Emoji
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value.slice(0, 2) })
              }
              className="w-full h-24 text-5xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              placeholder="📌"
              maxLength={2}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Click to type an emoji
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Tag
            </label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="w-full h-24 border-2 border-gray-300 rounded-lg cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Used for quick identification
            </p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Ideas, Tasks, Learning, Projects"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            maxLength={30}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.name.length}/30 characters
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleCreate}
            disabled={loading || !formData.name.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Creating...' : 'Create Category'}
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use categories to organize notes by topic or project</li>
              <li>• Choose distinct colors to quickly identify categories</li>
              <li>• You can assign multiple categories to a single note</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}