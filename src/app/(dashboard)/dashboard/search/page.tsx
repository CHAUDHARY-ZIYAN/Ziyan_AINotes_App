// src/app/(dashboard)/dashboard/search/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, FileText } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { Database } from '@/types/supabase';

type Note = Database['public']['Tables']['notes']['Row'];

export default function SearchPage() {
  const supabase = createClient();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);

    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('created_by', user.id)
        .eq('is_archived', false)
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Notes</h1>

      {/* Search Input */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by title or content..."
          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          autoFocus
        />
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : results.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {results.map((note) => (
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
                  {formatDate(note.updated_at || '')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : query.trim().length >= 2 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No notes found for "{query}"</p>
        </div>
      ) : null}
    </div>
  );
}