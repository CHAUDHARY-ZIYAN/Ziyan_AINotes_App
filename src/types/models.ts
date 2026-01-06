export interface User {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    created_at: string;
}

export interface Note {
    id: string;
    title: string;
    content: string | null;
    content_type: string | null;
    emoji: string | null; // Nullable in database
    created_by: string | null; // Nullable in database
    workspace_id: string | null;
    category_id?: string | null;
    is_pinned: boolean | null; // Nullable in database
    is_archived: boolean | null; // Nullable in database
    archived_at: string | null;
    color: string | null;
    cover_image: string | null;
    created_at: string | null; // Nullable in database
    updated_at: string | null;
}

export interface Category {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    user_id: string;
    workspace_id: string;
    parent_id: string | null;
    position: number | null;
    created_at: string;
}

export interface NoteVersion {
    id: string;
    note_id: string;
    title: string;
    content: string;
    version_number: number;
    created_by: string;
    created_at: string;
}

export type NoteStatus = 'active' | 'archived' | 'trash';

export interface Workspace {
    id: string;
    name: string;
    icon: string | null;
    color: string | null; // Added missing color property
    owner_id: string; // Changed from created_by
    created_at: string;
    is_personal: boolean; // Added based on error message
    description: string | null; // Added based on error message
}
