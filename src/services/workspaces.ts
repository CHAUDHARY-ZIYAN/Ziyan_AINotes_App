import { createClient } from '@/lib/supabase/client';
import { Workspace } from '@/types/supabase';
import { AppError } from '@/utils/AppError';

export const workspaceService = {
    async getWorkspaces(userId: string): Promise<Workspace[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('workspaces')
            .select('*')
            .eq('owner_id', userId) // Changed from created_by
            .order('created_at', { ascending: false });

        if (error) {
            throw new AppError('Failed to fetch workspaces', 500, true);
        }

        return data as Workspace[];
    },

    async createWorkspace(workspace: Partial<Workspace>): Promise<Workspace> {
        const supabase = createClient();

        // Validate required fields
        if (!workspace.name || !workspace.owner_id) {
            throw new AppError('Workspace name and owner are required', 400, true);
        }

        const { data, error } = await supabase
            .from('workspaces')
            .insert({
                name: workspace.name,
                description: workspace.description || null,
                icon: workspace.icon || '📁',
                color: workspace.color || '#6366f1',
                owner_id: workspace.owner_id,
                is_personal: false,
            })
            .select()
            .single();

        if (error) {
            throw new AppError(
                `Failed to create workspace: ${error.message}`,
                500,
                true
            );
        }

        // Automatically add owner as member
        const { error: memberError } = await supabase
            .from('workspace_members')
            .insert({
                workspace_id: data.id,
                user_id: workspace.owner_id,
                role: 'owner',
            });

        if (memberError) {
            // If adding member fails, we should probably delete the workspace or at least log it
            // For now, throwing an error so the user knows something went wrong
            throw new AppError(
                `Failed to add owner to workspace: ${memberError.message}`,
                500,
                true
            );
        }

        return data as Workspace;
    },

    async addMember(workspaceId: string, userId: string, role: 'owner' | 'member' = 'member'): Promise<void> {
        const supabase = createClient();

        const { error } = await supabase
            .from('workspace_members')
            .insert({
                workspace_id: workspaceId,
                user_id: userId,
                role: role,
            });

        if (error) {
            throw new AppError('Failed to add workspace member', 500, true);
        }
    }
};
