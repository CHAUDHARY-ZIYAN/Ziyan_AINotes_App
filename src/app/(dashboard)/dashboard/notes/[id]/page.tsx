'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
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

import { useAuth } from '@/hooks/useAuth';
import { useNoteStore } from '@/store/useNoteStore';
import { noteService } from '@/services/notes';
import { workspaceService } from '@/services/workspaces';
import { Note } from '@/types/supabase';
import NoteEditor from '@/components/editor/NoteEditor';
import AIEnhanceMenu from '@/components/notes/AIEnhanceMenu';
import { getErrorMessage, logger } from '@/lib/utils';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function NoteEditPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addNote, updateNote: updateStoreNote, deleteNote: deleteStoreNote } = useNoteStore();

  const noteId = params.id as string;
  const isNewNote = noteId === 'new';

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('Untitled');
  const [content, setContent] = useState('');
  const [emoji, setEmoji] = useState('📝');
  const [loading, setLoading] = useState(!isNewNote);
  const [saving, setSaving] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const loadNote = useCallback(async () => {
    if (isNewNote) return;

    try {
      setLoading(true);
      const fetchedNote = await noteService.getNote(noteId);
      setNote(fetchedNote);
      setTitle(fetchedNote.title);
      setContent(fetchedNote.content || '');
      setEmoji(fetchedNote.emoji || '📝');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || 'Failed to load note');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [noteId, isNewNote, router]);

  useEffect(() => {
    loadNote();
  }, [loadNote]);

  // Auto-save
  useEffect(() => {
    const hasChanged = isNewNote
      ? (title !== 'Untitled' || content !== '' || emoji !== '📝')
      : (note && (title !== note.title || content !== note.content || emoji !== note.emoji));

    if (hasChanged && !saving) {
      const timer = setTimeout(() => {
        handleSave(true);
      }, 3000); // 3 seconds for auto-save
      return () => clearTimeout(timer);
    }
  }, [title, content, emoji, note, isNewNote, saving]);

  const handleSave = async (silent = false) => {
    if (saving || !user) return;
    setSaving(true);

    try {
      if (isNewNote) {
        // Fetch workspaces to get a default one
        // In a real app, we might want to let the user select one or have a default in user settings
        const workspaces = await workspaceService.getWorkspaces(user.id);
        const defaultWorkspaceId = workspaces.length > 0 ? workspaces[0].id : null;

        const newNote = await noteService.createNote({
          title,
          content,
          emoji,
          created_by: user.id,
          workspace_id: defaultWorkspaceId,
        });

        addNote(newNote);
        if (!silent) toast.success('Note created!');
        router.push(`/dashboard/notes/${newNote.id}`);
      } else {
        const updatedNote = await noteService.updateNote(noteId, {
          title,
          content,
          emoji,
        });

        updateStoreNote(noteId, updatedNote);
        setNote(updatedNote);

        // Create version
        // await noteService.createVersion(noteId, title, content, user.id);

        if (!silent) toast.success('Note saved!');
      }
    } catch (error: unknown) {
      logger.error('Save error:', error);
      toast.error(getErrorMessage(error) || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handlePin = async () => {
    if (isNewNote || !note) return;
    try {
      const updatedNote = await noteService.updateNote(noteId, { is_pinned: !note.is_pinned });
      updateStoreNote(noteId, updatedNote);
      setNote(updatedNote);
      toast.success(updatedNote.is_pinned ? 'Note pinned' : 'Note unpinned');
      setShowMenu(false);
    } catch (error: unknown) {
      logger.error('Pin/unpin error:', error);
      toast.error('Failed to update note');
    }
  };

  const handleArchive = async () => {
    if (isNewNote) return;
    try {
      const updatedNote = await noteService.updateNote(noteId, { is_archived: true });
      updateStoreNote(noteId, updatedNote);
      toast.success('Note archived');
      router.push('/dashboard');
    } catch (error: unknown) {
      logger.error('Archive error:', error);
      toast.error('Failed to archive note');
    }
  };

  const handleDelete = async () => {
    if (isNewNote) return;
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await noteService.deleteNote(noteId);
      deleteStoreNote(noteId);
      toast.success('Note deleted');
      router.push('/dashboard');
    } catch (error: unknown) {
      logger.error('Delete error:', error);
      toast.error('Failed to delete note');
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
            <AIEnhanceMenu
              content={content}
              onInsert={(text) => {
                setContent(content + '\n\n' + text);
              }}
              onReplace={(text) => {
                setContent(text);
              }}
            />

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
                          toast('Share feature coming in Phase 6!', { icon: '🚀' });
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