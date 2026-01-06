'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Pin, Clock, Plus } from 'lucide-react';
import { formatDate, logger } from '@/lib/utils';
import { Note } from '@/types/supabase';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspaces } from '@/contexts/WorkspaceContext';

interface NoteWithWorkspace extends Note {
  workspace: {
    name: string;
    icon: string | null;
  } | null;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaces();
  const [notes, setNotes] = useState<NoteWithWorkspace[]>([]);
  const [pinnedNotes, setPinnedNotes] = useState<Note[]>([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    if (user && currentWorkspace) {
      loadDashboardData();
    }
  }, [user, currentWorkspace]);

  const loadDashboardData = async () => {
    if (!user || !currentWorkspace) return;
    setLoading(true);

    try {
      // Fetch user's notes for CURRENT WORKSPACE
      const { data: notesData } = await supabase
        .from('notes')
        .select(`
          *,
          workspace:workspaces(name, icon)
        `)
        .eq('created_by', user.id)
        .eq('workspace_id', currentWorkspace.id)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false })
        .limit(20)
        .returns<NoteWithWorkspace[]>();

      setNotes(notesData || []);

      // Fetch pinned notes for CURRENT WORKSPACE
      const { data: pinnedData } = await supabase
        .from('notes')
        .select('*')
        .eq('created_by', user.id)
        .eq('workspace_id', currentWorkspace.id)
        .eq('is_pinned', true)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false })
        .limit(3)
        .returns<Note[]>();

      setPinnedNotes(pinnedData || []);

      // Get stats for CURRENT WORKSPACE
      const { count } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', user.id)
        .eq('workspace_id', currentWorkspace.id)
        .eq('is_archived', false);

      setTotalNotes(count || 0);
    } catch (error) {
      logger.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekNotes = notes.filter(
    (n) => n.created_at && new Date(n.created_at) > oneWeekAgo
  ).length;

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
          </div>
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Notes</p>
              <p className="text-2xl font-bold text-gray-900">{totalNotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Pin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pinned</p>
              <p className="text-2xl font-bold text-gray-900">{pinnedNotes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{thisWeekNotes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Pin className="w-5 h-5 text-purple-600" />
            Pinned Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => (
              <Link
                key={note.id}
                href={`/dashboard/notes/${note.id}`}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{note.emoji}</span>
                  <Pin className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {note.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(note.updated_at || note.created_at || new Date())}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Notes */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Notes ({currentWorkspace?.name})
        </h2>

        {notes.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No notes in this workspace
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first note in {currentWorkspace?.name}
            </p>
            <Link
              href="/dashboard/notes/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Note
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={`/dashboard/notes/${note.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
              >
                <span className="text-3xl">{note.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {note.workspace?.name || 'Personal'} · {formatDate(note.updated_at || note.created_at || new Date())}
                  </p>
                </div>
                {note.is_pinned && (
                  <Pin className="w-4 h-4 text-purple-600" />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
