'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { formatDate, logger } from '@/lib/utils';
import { Note } from '@/types/supabase';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspaces } from '@/contexts/WorkspaceContext';

export default function RecentPage() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaces();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    if (user && currentWorkspace) {
      loadRecentNotes();
    }
  }, [user, currentWorkspace]);

  const loadRecentNotes = async () => {
    if (!user || !currentWorkspace) return;
    setLoading(true);

    try {
      const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('created_by', user.id)
        .eq('workspace_id', currentWorkspace.id)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false })
        .limit(50);

      setNotes(data || []);
    } catch (error) {
      logger.error('Error loading recent notes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">Recent Notes ({currentWorkspace?.name})</h1>
      </div>

      {notes.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No recent notes in this workspace</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {notes.map((note: Note) => (
            <Link
              key={note.id}
              href={`/dashboard/notes/${note.id}`}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
            >
              <span className="text-3xl">{note.emoji}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{note.title}</h3>
                <p className="text-sm text-gray-500">{formatDate(note.updated_at || note.created_at || '')}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}