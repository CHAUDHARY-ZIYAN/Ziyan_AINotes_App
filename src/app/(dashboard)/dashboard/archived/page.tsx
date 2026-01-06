'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Archive } from 'lucide-react';
import { formatDate, logger } from '@/lib/utils';
import { Note } from '@/types/supabase';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspaces } from '@/contexts/WorkspaceContext';

export default function ArchivedPage() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaces();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    if (user && currentWorkspace) {
      loadArchivedNotes();
    }
  }, [user, currentWorkspace]);

  const loadArchivedNotes = async () => {
    if (!user || !currentWorkspace) return;
    setLoading(true);

    try {
      const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('created_by', user.id)
        .eq('workspace_id', currentWorkspace.id)
        .eq('is_archived', true)
        .order('archived_at', { ascending: false });

      setNotes(data || []);
    } catch (error) {
      logger.error('Error loading archived notes:', error);
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
        <Archive className="w-6 h-6 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">Archived Notes ({currentWorkspace?.name})</h1>
      </div>

      {notes.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No archived notes in this workspace</p>
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
                <p className="text-sm text-gray-500">
                  Archived {note.archived_at ? formatDate(note.archived_at) : (note.created_at ? formatDate(note.created_at) : 'recently')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}