// src/app/(dashboard)/dashboard/recent/page.tsx
import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function RecentPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .eq('created_by', user.id)
    .eq('is_archived', false)
    .order('updated_at', { ascending: false })
    .limit(50);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">Recent Notes</h1>
      </div>

      {!notes || notes.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No recent notes</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {notes.map((note: any) => (
            <Link
              key={note.id}
              href={`/dashboard/notes/${note.id}`}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
            >
              <span className="text-3xl">{note.emoji}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{note.title}</h3>
                <p className="text-sm text-gray-500">{formatDate(note.updated_at)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}