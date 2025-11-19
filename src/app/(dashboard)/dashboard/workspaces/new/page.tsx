// src/app/(dashboard)/dashboard/workspaces/new/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewWorkspacePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📁',
    color: '#6366f1',
  });

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Workspace name is required');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create workspace
      const { data: newWorkspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          name: formData.name,
          description: formData.description || null,
          icon: formData.icon,
          color: formData.color,
          owner_id: user.id,
          is_personal: false,
        })
        .select()
        .single();

      if (workspaceError) throw workspaceError;

      // Add user as workspace member (IMPORTANT!)
      const { error: memberError } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: newWorkspace.id,
          user_id: user.id,
          role: 'owner',
        });

      if (memberError) throw memberError;

      toast.success('Workspace created! Refreshing...');
      
      // Redirect and force refresh
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 500);
    } catch (error: any) {
      console.error('Create error:', error);
      toast.error(error.message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

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
          Create New Workspace
        </h1>
        <p className="text-gray-600">
          Organize your notes into separate workspaces for different projects or areas of your life.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Preview Card */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Preview
          </p>
          <div 
            className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm"
            style={{ borderLeftColor: formData.color, borderLeftWidth: '4px' }}
          >
            <span className="text-4xl">{formData.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900">
                {formData.name || 'Workspace Name'}
              </h3>
              <p className="text-sm text-gray-500">
                {formData.description || 'No description'}
              </p>
            </div>
          </div>
        </div>

        {/* Icon & Color */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon Emoji
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value.slice(0, 2) })
                }
                className="w-full h-24 text-5xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                placeholder="📁"
                maxLength={2}
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Click to type an emoji
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accent Color
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
              Used for highlighting
            </p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Workspace Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Work Projects, Personal Notes, School"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.name.length}/50 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="What's this workspace for? (e.g., All my work-related notes and documents)"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/200 characters
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
            {loading ? 'Creating...' : 'Create Workspace'}
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
              <li>• Use different emojis to quickly identify workspaces</li>
              <li>• Choose colors that match your workflow or mood</li>
              <li>• You can create multiple workspaces for different areas of life</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}