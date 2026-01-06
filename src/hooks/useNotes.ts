import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useNoteStore } from '@/store/useNoteStore';
import { useAuth } from '@/hooks/useAuth';
import { handleError } from '@/utils/AppError';
import { Note } from '@/types/supabase';

export function useNotes() {
    const supabase = createClient();
    const { user } = useAuth();
    const {
        notes,
        setNotes,
        addNote,
        updateNote,
        deleteNote,
        isLoading,
        setLoading,
        setError
    } = useNoteStore();

    useEffect(() => {
        if (!user) return;

        const fetchNotes = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('notes')
                    .select('*')
                    .order('updated_at', { ascending: false });

                if (error) throw error;
                setNotes(data as Note[]);
            } catch (error) {
                const { message } = handleError(error);
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();

        // Real-time subscription
        const channel = supabase
            .channel('realtime-notes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notes',
                    filter: `created_by=eq.${user.id}`, // Changed from user_id to created_by to match schema
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        addNote(payload.new as Note);
                    } else if (payload.eventType === 'UPDATE') {
                        updateNote(payload.new.id, payload.new as Partial<Note>);
                    } else if (payload.eventType === 'DELETE') {
                        deleteNote(payload.old.id);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, setNotes, addNote, updateNote, deleteNote, setLoading, setError]);

    return { notes, isLoading };
}
