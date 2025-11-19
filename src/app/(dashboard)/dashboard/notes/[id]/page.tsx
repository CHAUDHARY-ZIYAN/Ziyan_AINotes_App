// src/app/(dashboard)/dashboard/notes/[id]/page.tsx
// src/app/(dashboard)/dashboard/notes/[id]/page.tsx
// src/app/(dashboard)/dashboard/notes/[id]/page.tsx
// 'use client';

// import type { Note, Workspace, NoteVersion } from "@/types/supabase";
// import { useEffect, useState } from 'react';
// import { createClient } from '@/lib/supabase/client';
// import { useRouter } from 'next/navigation';
// import NoteEditor from '@/components/editor/NoteEditor';

// import {
//   ArrowLeft,
//   Save,
//   Pin,
//   Archive,
//   Trash2,
//   MoreVertical,
//   Download,
//   Share2,
// } from 'lucide-react';
// import toast from 'react-hot-toast';
// import dynamic from 'next/dynamic';
// import type { Database } from '@/types/supabase';

// // Dynamically import EmojiPicker to avoid SSR issues
// const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

// interface PageProps {
//   params: { id: string };
// }

// // type Note = Database['public']['Tables']['notes']['Row'] & {
// //   workspace?: Database['public']['Tables']['workspaces']['Row'] | null;
// // };

// // type Workspace = Database['public']['Tables']['workspaces']['Row'];


// export default function NoteEditPage({ params }: PageProps) {
//   const router = useRouter();
//   const supabase = createClient();
//   const noteId = params.id;
//   const isNewNote = noteId === 'new';

//   const [note, setNote] = useState<Note | null>(null);
//   const [title, setTitle] = useState('Untitled');
//   const [content, setContent] = useState('');
//   const [emoji, setEmoji] = useState('📝');
//   const [loading, setLoading] = useState(!isNewNote);
//   const [saving, setSaving] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [workspace, setWorkspace] = useState<Workspace | null>(null);
//   const [versions, setVersions] = useState<NoteVersion[]>([]);

//   useEffect(() => {
//     if (isNewNote) {
//       loadDefaultWorkspace();
//     } else {
//       loadNote();
//     }
//   }, [noteId]);

//   // Auto-save every 5 seconds
//   useEffect(() => {
//     if (!isNewNote && note && (title !== note.title || content !== note.content || emoji !== note.emoji)) {
//       const timer = setTimeout(() => {
//         handleSave(true); // silent save
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [title, content, emoji]);

//   const loadDefaultWorkspace = async () => {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) {
//       toast.error('Not authenticated');
//       router.push('/signin');
//       return;
//     }

//     const { data, error } = await supabase
//       .from('workspaces')
//       .select('*')
//       .eq('owner_id', user.id)
//       .eq('is_personal', true)
//       .single();

//     if (error) {
//       console.error('Error loading workspace:', error);
//       toast.error('Failed to load workspace');
//       return;
//     }

//     if (data) {
//       setWorkspace(data);
//     } else {
//       toast.error('No workspace found. Please create one first.');
//     }
//   };

//   const loadNote = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('notes')
//       .select(`
//         *,
//         workspace:workspaces(id, name, icon)
//       `)
//       .eq('id', noteId)
//       .single();

//     if (error) {
//       console.error('Error loading note:', error);
//       toast.error('Failed to load note');
//       router.push('/dashboard');
//       return;
//     }

//     if (data) {
//       setNote(data as Note);
//       setTitle(data.title);
//       setContent(data.content || '');
//       setEmoji(data.emoji);
//       if (data.workspace) {
//         setWorkspace(data.workspace as Workspace);
//       }
//     }
//     setLoading(false);
//   };

//   const handleSave = async (silent = false) => {
//     if (saving) return;
//     setSaving(true);

//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error('Not authenticated');

//       if (isNewNote) {
//         // Create new note
//         if (!workspace) {
//           toast.error('No workspace found. Please reload the page.');
//           setSaving(false);
//           return;
//         }

//         const { data: newNote, error } = await supabase
//           .from('notes')
//           .insert({
//             title: title || 'Untitled',
//             content: content || '',
//             emoji: emoji || '📝',
//             workspace_id: workspace.id,
//             created_by: user.id,
//           })
//           .select()
//           .single();

//         if (error) throw error;

//         if (!silent) toast.success('Note created!');
//         router.push(`/dashboard/notes/${newNote.id}`);
//       } else {
//         // Update existing note
//         const { error } = await supabase
//           .from('notes')
//           .update({
//             title: title || 'Untitled',
//             content: content || '',
//             emoji: emoji || '📝',
//             updated_at: new Date().toISOString(),
//           })
//           .eq('id', noteId);

//         if (error) throw error;

//         // Create version history (YOUR UNIQUE FEATURE!)
//         const { data: versions } = await supabase
//           .from('note_versions')
//           .select('version_number')
//           .eq('note_id', noteId)
//           .order('version_number', { ascending: false })
//           .limit(1);

//         const nextVersion = versions && versions.length > 0 
//           ? versions[0].version_number + 1 
//           : 1;

//         await supabase.from('note_versions').insert({
//           note_id: noteId,
//           title: title || 'Untitled',
//           content: content || '',
//           version_number: nextVersion,
//           created_by: user.id,
//         });

//         if (!silent) toast.success('Note saved!');
        
//         // Reload note to get latest data
//         await loadNote();
//       }
//     } catch (error: any) {
//       console.error('Save error:', error);
//       toast.error(error.message || 'Failed to save note');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handlePin = async () => {
//     if (isNewNote || !note) return;

//     const { error } = await supabase
//       .from('notes')
//       .update({ is_pinned: !note.is_pinned })
//       .eq('id', noteId);

//     if (error) {
//       toast.error('Failed to pin note');
//     } else {
//       setNote({ ...note, is_pinned: !note.is_pinned });
//       toast.success(note.is_pinned ? 'Note unpinned' : 'Note pinned');
//       setShowMenu(false);
//     }
//   };

//   const handleArchive = async () => {
//     if (isNewNote) return;

//     const { error } = await supabase
//       .from('notes')
//       .update({
//         is_archived: true,
//         archived_at: new Date().toISOString(),
//       })
//       .eq('id', noteId);

//     if (error) {
//       toast.error('Failed to archive note');
//     } else {
//       toast.success('Note archived');
//       router.push('/dashboard');
//     }
//   };

//   const handleDelete = async () => {
//     if (isNewNote) return;

//     if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) return;

//     const { error } = await supabase.from('notes').delete().eq('id', noteId);

//     if (error) {
//       toast.error('Failed to delete note');
//     } else {
//       toast.success('Note deleted');
//       router.push('/dashboard');
//     }
//   };

//   const handleExport = () => {
//     const blob = new Blob([content], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${title || 'note'}.html`;
//     a.click();
//     URL.revokeObjectURL(url);
//     toast.success('Note exported!');
//     setShowMenu(false);
//   };

//   if (loading) {
//     return (
//       <div className="h-full flex items-center justify-center">
//         <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4 flex-1">
//             <button
//               onClick={() => router.push('/dashboard')}
//               className="p-2 hover:bg-gray-100 rounded-lg transition"
//               title="Back to dashboard"
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </button>

//             {/* Emoji Picker */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                 className="text-4xl hover:scale-110 transition"
//                 title="Change emoji"
//               >
//                 {emoji}
//               </button>

//               {showEmojiPicker && (
//                 <>
//                   <div 
//                     className="fixed inset-0 z-40" 
//                     onClick={() => setShowEmojiPicker(false)}
//                   />
//                   <div className="absolute top-full left-0 mt-2 z-50">
//                     <EmojiPicker
//                       onEmojiClick={(emojiData) => {
//                         setEmoji(emojiData.emoji);
//                         setShowEmojiPicker(false);
//                       }}
//                     />
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Title Input */}
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Untitled"
//               className="flex-1 text-2xl font-bold outline-none"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             {/* Save Button */}
//             <button
//               onClick={() => handleSave(false)}
//               disabled={saving}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
//             >
//               <Save className="w-4 h-4" />
//               {saving ? 'Saving...' : 'Save'}
//             </button>

//             {/* Actions Menu */}
//             {!isNewNote && (
//               <div className="relative">
//                 <button
//                   onClick={() => setShowMenu(!showMenu)}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition"
//                   title="More options"
//                 >
//                   <MoreVertical className="w-5 h-5" />
//                 </button>

//                 {showMenu && (
//                   <>
//                     <div 
//                       className="fixed inset-0 z-40" 
//                       onClick={() => setShowMenu(false)}
//                     />
//                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
//                       <button
//                         onClick={handlePin}
//                         className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition text-left"
//                       >
//                         <Pin className="w-4 h-4" />
//                         {note?.is_pinned ? 'Unpin' : 'Pin'}
//                       </button>

//                       <button
//                         onClick={handleExport}
//                         className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition text-left"
//                       >
//                         <Download className="w-4 h-4" />
//                         Export
//                       </button>

//                       <button
//                         onClick={() => {
//                           toast('Share feature coming in Phase 6!', { icon: '🚀' });
//                           setShowMenu(false);
//                         }}
//                         className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition text-left"
//                       >
//                         <Share2 className="w-4 h-4" />
//                         Share
//                       </button>

//                       <div className="border-t border-gray-200 my-2" />

//                       <button
//                         onClick={handleArchive}
//                         className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition text-left"
//                       >
//                         <Archive className="w-4 h-4" />
//                         Archive
//                       </button>

//                       <button
//                         onClick={handleDelete}
//                         className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                         Delete
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Editor */}
//       <div className="flex-1 overflow-hidden">
//         <NoteEditor content={content} onChange={setContent} />
//       </div>
//     </div>
//   );
// }



// src/app/(dashboard)/dashboard/notes/[id]/page.tsx
'use client';

//import { enhanceText } from "@/lib/enhance";
import AIEnhanceMenu from '@/components/notes/AIEnhanceMenu';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import NoteEditor from '@/components/editor/NoteEditor';
import {
  ArrowLeft,
  Save,
  Pin,
  Archive,
  Trash2,
  MoreVertical,
  Download,
  Share2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import type { Database } from '@/types/supabase';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

type Note = Database['public']['Tables']['notes']['Row'] & {
  workspace?: {
    id: string;
    name: string;
    icon: string | null;
  } | null;
};

type Workspace = Database['public']['Tables']['workspaces']['Row'];

export default function NoteEditPage() {
  const params = useParams();
  const noteId = params.id as string;
  const isNewNote = noteId === 'new';
  const router = useRouter();
  const supabase = createClient();

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('Untitled');
  const [content, setContent] = useState('');
  const [emoji, setEmoji] = useState('📝');
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(!isNewNote);
  const [saving, setSaving] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (isNewNote) {
      loadDefaultWorkspace();
    } else {
      loadNote();
    }
  }, [noteId]);

  // Auto-save every 5 seconds
  useEffect(() => {
    if (!isNewNote && note && (title !== note.title || content !== note.content || emoji !== note.emoji)) {
      const timer = setTimeout(() => {
        handleSave(true); // silent save
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [title, content, emoji]);

  const loadDefaultWorkspace = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Not authenticated');
      router.push('/signin');
      return;
    }

    // Try to get personal workspace first
    let { data } = await supabase
      .from('workspaces')
      .select('*')
      .eq('owner_id', user.id)
      .eq('is_personal', true)
      .maybeSingle();

    // If no personal workspace, get any workspace
    if (!data) {
      const { data: anyWorkspace } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', user.id)
        .limit(1)
        .single();
      
      data = anyWorkspace;
    }

    if (data) {
      setWorkspace(data);
    } else {
      toast.error('Please create a workspace first', {
        duration: 4000,
      });
    }
  };

  const loadNote = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        workspace:workspaces(id, name, icon)
      `)
      .eq('id', noteId)
      .single();

    if (error) {
      console.error('Error loading note:', error);
      toast.error('Failed to load note');
      router.push('/dashboard');
      return;
    }

    if (data) {
      setNote(data as Note);
      setTitle(data.title || 'Untitled');
      setContent(data.content || '');
      setEmoji(data.emoji || '📝');
    }
    setLoading(false);
  };

  const handleSave = async (silent = false) => {
    if (saving) return;
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (isNewNote) {
        if (!workspace) {
          toast.error('No workspace found. Please reload the page.');
          setSaving(false);
          return;
        }

        const { data: newNote, error } = await supabase
          .from('notes')
          .insert({
            title: title || 'Untitled',
            content: content || '',
            emoji: emoji || '📝',
            workspace_id: workspace.id,
            created_by: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        if (!silent) toast.success('Note created!');
        router.push(`/dashboard/notes/${newNote.id}`);
      } else {
        const { error } = await supabase
          .from('notes')
          .update({
            title: title || 'Untitled',
            content: content || '',
            emoji: emoji || '📝',
            updated_at: new Date().toISOString(),
          })
          .eq('id', noteId);

        if (error) throw error;

        // Create version history
        const { data: versions } = await supabase
          .from('note_versions')
          .select('version_number')
          .eq('note_id', noteId)
          .order('version_number', { ascending: false })
          .limit(1);

        const nextVersion = versions && versions.length > 0 
          ? versions[0].version_number + 1 
          : 1;

        await supabase.from('note_versions').insert({
          note_id: noteId,
          title: title || 'Untitled',
          content: content || '',
          version_number: nextVersion,
          created_by: user.id,
        });

        if (!silent) toast.success('Note saved!');
        await loadNote();
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handlePin = async () => {
    if (isNewNote || !note) return;

    const { error } = await supabase
      .from('notes')
      .update({ is_pinned: !note.is_pinned })
      .eq('id', noteId);

    if (error) {
      toast.error('Failed to pin note');
    } else {
      setNote({ ...note, is_pinned: !note.is_pinned });
      toast.success(note.is_pinned ? 'Note unpinned' : 'Note pinned');
      setShowMenu(false);
    }
  };

  const handleArchive = async () => {
    if (isNewNote) return;

    const { error } = await supabase
      .from('notes')
      .update({
        is_archived: true,
        archived_at: new Date().toISOString(),
      })
      .eq('id', noteId);

    if (error) {
      toast.error('Failed to archive note');
    } else {
      toast.success('Note archived');
      router.push('/dashboard');
    }
  };

  const handleDelete = async () => {
    if (isNewNote) return;

    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) return;

    const { error } = await supabase.from('notes').delete().eq('id', noteId);

    if (error) {
      toast.error('Failed to delete note');
    } else {
      toast.success('Note deleted');
      router.push('/dashboard');
    }
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'note'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Note exported!');
    setShowMenu(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Emoji Picker */}
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-4xl hover:scale-110 transition"
                title="Change emoji"
              >
                {emoji}
              </button>

              {showEmojiPicker && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowEmojiPicker(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 z-50">
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        setEmoji(emojiData.emoji);
                        setShowEmojiPicker(false);
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="flex-1 text-2xl font-bold outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Save Button */}
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>

            {/* AI ENHANCE BUTTON */}
            {!isNewNote && (
              <AIEnhanceMenu
                content={content}
                onInsert={(text) => {
                  setContent(content + '\n\n' + text);
                }}
                onReplace={(text) => {
                  setContent(text);
                }}
              />
            )}
            

            {/* Actions Menu */}
            {!isNewNote && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="More options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {showMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={handlePin}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition text-left"
                      >
                        <Pin className="w-4 h-4" />
                        {note?.is_pinned ? 'Unpin' : 'Pin'}
                      </button>

                      <button
                        onClick={handleExport}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition text-left"
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </button>

                      <button
                        onClick={() => {
                          toast('Share feature coming soon!', { icon: '🚀' });
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition text-left"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>

                      <div className="border-t border-gray-200 my-2" />

                      <button
                        onClick={handleArchive}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition text-left"
                      >
                        <Archive className="w-4 h-4" />
                        Archive
                      </button>

                      <button
                        onClick={handleDelete}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <NoteEditor content={content} onChange={setContent} />
      </div>
    </div>
  );
}