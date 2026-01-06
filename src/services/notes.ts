import { createClient } from '@/lib/supabase/client';
import { Note } from '@/types/supabase';
import { AppError } from '@/utils/AppError';

export const noteService = {
    async getNote(id: string): Promise<Note> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('notes')
            .select(`
        *,
        workspace:workspaces(id, name, icon)
      `)
            .eq('id', id)
            .single();

        if (error) {
            throw new AppError('Failed to fetch note', 500, true);
        }

        return data as Note;
    },

    async createNote(note: Partial<Note>): Promise<Note> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('notes')
            .insert(note)
            .select()
            .single();

        if (error) {
            throw new AppError('Failed to create note', 500, true);
        }

        return data as Note;
    },

    async searchNotes(userId: string, query: string): Promise<Note[]> {
        const supabase = createClient();

        if (query.trim().length < 2) {
            return [];
        }

        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('created_by', userId)
            .eq('is_archived', false)
            .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
            .order('updated_at', { ascending: false })
            .limit(20);

        if (error) {
            throw new AppError('Failed to search notes', 500, true);
        }

        return data as Note[];
    },

    async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('notes')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new AppError('Failed to update note', 500, true);
        }

        return data as Note;
    },

    async deleteNote(id: string): Promise<void> {
        const supabase = createClient();
        const { error } = await supabase.from('notes').delete().eq('id', id);

        if (error) {
            throw new AppError('Failed to delete note', 500, true);
        }
    },

    async createVersion(noteId: string, title: string, content: string, userId: string): Promise<void> {
        const supabase = createClient();

        // Get latest version number
        const { data: versions } = await supabase
            .from('note_versions')
            .select('version_number')
            .eq('note_id', noteId)
            .order('version_number', { ascending: false })
            .limit(1);

        const nextVersion = versions && versions.length > 0
            ? versions[0].version_number + 1
            : 1;

        const { error } = await supabase.from('note_versions').insert({
            note_id: noteId,
            title,
            content,
            version_number: nextVersion,
            created_by: userId,
        });

        if (error) {
            throw new AppError('Failed to create note version', 500, true);
        }
    }
};
