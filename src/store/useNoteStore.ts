import { create } from 'zustand';
import { Note } from '@/types/supabase';

interface NoteState {
    notes: Note[];
    activeNoteId: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setNotes: (notes: Note[]) => void;
    addNote: (note: Note) => void;
    updateNote: (id: string, updates: Partial<Note>) => void;
    deleteNote: (id: string) => void;
    setActiveNoteId: (id: string | null) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useNoteStore = create<NoteState>((set) => ({
    notes: [],
    activeNoteId: null,
    isLoading: false,
    error: null,

    setNotes: (notes) => set({ notes }),

    addNote: (note) => set((state) => ({
        notes: [note, ...state.notes],
        activeNoteId: note.id
    })),

    updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updates, updated_at: new Date().toISOString() } : note
        ),
    })),

    deleteNote: (id) => set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
    })),

    setActiveNoteId: (id) => set({ activeNoteId: id }),

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),
}));
