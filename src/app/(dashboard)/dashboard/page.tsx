// src/app/(dashboard)/dashboard/page.tsx
// This is a Server Component
// src/app/(dashboard)/dashboard/page.tsx
// src/app/(dashboard)/dashboard/page.tsx
import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText, Pin, Clock, Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';
//import type { Tables } from '@/types/supabase';
//type Note = Tables<'notes'>;


export default async function DashboardPage() {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch user's notes
  const { data: notes } = await supabase
    .from('notes')
    .select(`
      *,
      workspace:workspaces(name, icon)
    `)
    .eq('created_by', user.id)
    .eq('is_archived', false)
    .order('updated_at', { ascending: false })
    .limit(20)
    .returns<Note[]>();

  // Fetch pinned notes
  const { data: pinnedNotes } = await supabase
    .from('notes')
    .select('*')
    .eq('created_by', user.id)
    .eq('is_pinned', true)
    .eq('is_archived', false)
    .order('updated_at', { ascending: false })
    .limit(3);

  // Get stats
  const { count: totalNotes } = await supabase
    .from('notes')
    .select('*', { count: 'exact', head: true })
    .eq('created_by', user.id)
    .eq('is_archived', false);


  type Note = {
    id: string;
    title: string;
    emoji: string | null;
    created_at: string;
    updated_at: string;
    is_pinned: boolean;
    is_archived: boolean;
    workspace?: { name: string; icon: string | null } | null;
  };

  const typedNotes = notes as Note[] | null;
  // Calculate notes from this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const thisWeekNotes =
    typedNotes?.filter(
      (n) => n.created_at && new Date(n.created_at) > oneWeekAgo
    ).length || 0;


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
              <p className="text-2xl font-bold text-gray-900">{totalNotes || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">
                {pinnedNotes?.length || 0}
              </p>
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
      {pinnedNotes && pinnedNotes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Pin className="w-5 h-5 text-purple-600" />
            Pinned Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pinnedNotes.map((note: any) => (
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
                  {formatDate(note.updated_at)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Notes */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Notes
        </h2>

        {!notes || notes.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No notes yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first note to get started
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
            {notes.map((note: any) => (
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
                    {note.workspace?.name || 'Personal'} · {formatDate(note.updated_at)}
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


// import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';
// import { createServerClient } from '@/lib/supabase/server';
// const supabase = createServerClient();
// const { data, error } = await supabase.from('notes').select('*');
// import Link from 'next/link';
// import { FileText, Pin, Clock, Plus } from 'lucide-react';
// import { formatDate } from '@/lib/utils';
// import type { Tables } from '@/types/supabase';

// export default async function DashboardPage() {
//   const supabase = createServerClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) return null;

//   // Fetch user's notes
//   const { data: notes } = await supabase
//     .from('notes')
//     .select(`
//       *,
//       workspace:workspaces(name, icon)
//     `)
//     .eq('created_by', user.id)
//     .eq('is_archived', false)
//     .order('updated_at', { ascending: false })
//     .limit(20) as {
//     data: (Tables<'notes'> & { workspace: { name: string; icon: string } })[] | null;
//   };
  
//   // Fetch pinned notes
//   const { data: pinnedNotes } = (await supabase
//     .from('notes')
//     .select('*')
//     .eq('created_by', user.id)
//     .eq('is_pinned', true)
//     .eq('is_archived', false)
//     .order('updated_at', { ascending: false })
//     .limit(3)
//   ) as { data: Tables<'notes'>[] | null };


//   // Get stats
//   const { count: totalNotes } = await supabase
//     .from('notes')
//     .select('*', { count: 'exact', head: true })
//     .eq('created_by', user.id)
//     .eq('is_archived', false);

//   return (
//     <div className="p-8 max-w-7xl mx-auto">
//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white rounded-xl p-6 border border-gray-200">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-blue-50 rounded-lg">
//               <FileText className="w-6 h-6 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Total Notes</p>
//               <p className="text-2xl font-bold text-gray-900">{totalNotes || 0}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 border border-gray-200">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-purple-50 rounded-lg">
//               <Pin className="w-6 h-6 text-purple-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Pinned</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {pinnedNotes?.length || 0}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 border border-gray-200">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-green-50 rounded-lg">
//               <Clock className="w-6 h-6 text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">This Week</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {notes?.filter(
//                   (n) => n.created_at && 
//                       new Date(n.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
//                 ).length || 0}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Pinned Notes */}
//       {pinnedNotes && pinnedNotes.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//             <Pin className="w-5 h-5 text-purple-600" />
//             Pinned Notes
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {pinnedNotes.map((note: any) => (
//               <Link
//                 key={note.id}
//                 href={`/dashboard/notes/${note.id}`}
//                 className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition"
//               >
//                 <div className="flex items-start justify-between mb-2">
//                   <span className="text-2xl">{note.emoji}</span>
//                   <Pin className="w-4 h-4 text-purple-600" />
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
//                   {note.title}
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   {formatDate(note.updated_at)}
//                 </p>
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Recent Notes */}
//       <div>
//         <h2 className="text-lg font-semibold text-gray-900 mb-4">
//           Recent Notes
//         </h2>

//         {!notes || notes.length === 0 ? (
//           <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
//             <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               No notes yet
//             </h3>
//             <p className="text-gray-600 mb-6">
//               Create your first note to get started
//             </p>
//             <Link
//               href="/dashboard/notes/new"
//               className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
//             >
//               <Plus className="w-5 h-5" />
//               Create Note
//             </Link>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//             {notes.map((note: any) => (
//               <Link
//                 key={note.id}
//                 href={`/dashboard/notes/${note.id}`}
//                 className="flex items-center gap-4 p-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
//               >
//                 <span className="text-3xl">{note.emoji}</span>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="font-semibold text-gray-900 truncate">
//                     {note.title}
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     {note.workspace?.name} · {formatDate(note.updated_at)}
//                   </p>
//                 </div>
//                 {note.is_pinned && (
//                   <Pin className="w-4 h-4 text-purple-600" />
//                 )}
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }