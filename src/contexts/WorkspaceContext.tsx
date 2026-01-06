'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Workspace } from '@/types/supabase';
import { workspaceService } from '@/services/workspaces';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/lib/utils';

interface WorkspaceContextType {
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    setCurrentWorkspace: (workspace: Workspace) => void;
    loading: boolean;
    refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
    const [loading, setLoading] = useState(true);

    const loadWorkspaces = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const data = await workspaceService.getWorkspaces(user.id);
            setWorkspaces(data || []);

            // Persist selection or default to first
            const savedId = localStorage.getItem('last_workspace_id');
            const saved = data?.find(w => w.id === savedId);

            if (saved) {
                setCurrentWorkspace(saved);
            } else if (data && data.length > 0) {
                setCurrentWorkspace(data[0]);
            }
        } catch (error) {
            logger.error('Failed to load workspaces:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWorkspaces();
    }, [user]);

    const handleSetCurrentWorkspace = (workspace: Workspace) => {
        setCurrentWorkspace(workspace);
        localStorage.setItem('last_workspace_id', workspace.id);
    };

    return (
        <WorkspaceContext.Provider
            value={{
                workspaces,
                currentWorkspace,
                setCurrentWorkspace: handleSetCurrentWorkspace,
                loading,
                refreshWorkspaces: loadWorkspaces,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspaces() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error('useWorkspaces must be used within a WorkspaceProvider');
    }
    return context;
}
