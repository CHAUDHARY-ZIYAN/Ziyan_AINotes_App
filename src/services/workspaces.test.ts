import { workspaceService } from './workspaces';
import { createClient } from '@/lib/supabase/client';
import { AppError } from '@/utils/AppError';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
    createClient: jest.fn(),
}));

describe('workspaceService', () => {
    interface MockSupabaseClient {
        from: jest.Mock;
        select: jest.Mock;
        insert: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
        eq: jest.Mock;
        single: jest.Mock;
        order: jest.Mock;
        limit: jest.Mock;
    }

    let mockSupabase: MockSupabaseClient;

    beforeEach(() => {
        mockSupabase = {
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({ error: null }),
            }),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn(),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
        };
        (createClient as jest.Mock).mockReturnValue(mockSupabase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createWorkspace', () => {
        it('should create a workspace and add owner as member', async () => {
            const mockWorkspace = { name: 'Test Workspace', owner_id: 'user-123' };
            const createdWorkspace = { id: 'workspace-123', ...mockWorkspace };

            // Mock workspace creation success
            mockSupabase.single.mockResolvedValue({ data: createdWorkspace, error: null });

            // Mock member addition success
            mockSupabase.insert.mockImplementation((data) => {
                if (data.role === 'owner') {
                    return { error: null };
                }
                return { select: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: createdWorkspace, error: null }) };
            });

            // We need to handle the chain differently because insert is called twice
            // First call: insert workspace -> select -> single
            // Second call: insert member -> (no select/single chain in the code, just await)

            // Let's refine the mock to handle the specific chain in the service
            const mockInsert = jest.fn();
            mockSupabase.insert = mockInsert;

            // First call (workspace creation) returns a chain
            mockInsert.mockReturnValueOnce({
                select: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({ data: createdWorkspace, error: null })
                })
            });

            // Second call (member addition) returns a promise with error: null
            mockInsert.mockReturnValueOnce(Promise.resolve({ error: null }));

            const result = await workspaceService.createWorkspace(mockWorkspace);

            expect(result).toEqual(createdWorkspace);

            // Verify workspace creation
            expect(mockSupabase.from).toHaveBeenNthCalledWith(1, 'workspaces');
            expect(mockInsert).toHaveBeenNthCalledWith(1, expect.objectContaining({
                name: 'Test Workspace',
                owner_id: 'user-123'
            }));

            // Verify member addition
            expect(mockSupabase.from).toHaveBeenNthCalledWith(2, 'workspace_members');
            expect(mockInsert).toHaveBeenNthCalledWith(2, {
                workspace_id: 'workspace-123',
                user_id: 'user-123',
                role: 'owner'
            });
        });

        it('should throw AppError if workspace creation fails', async () => {
            const mockWorkspace = { name: 'Test Workspace', owner_id: 'user-123' };

            const mockInsert = jest.fn();
            mockSupabase.insert = mockInsert;

            mockInsert.mockReturnValueOnce({
                select: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } })
                })
            });

            await expect(workspaceService.createWorkspace(mockWorkspace)).rejects.toThrow(AppError);
        });

        it('should throw AppError if member addition fails', async () => {
            const mockWorkspace = { name: 'Test Workspace', owner_id: 'user-123' };
            const createdWorkspace = { id: 'workspace-123', ...mockWorkspace };

            const mockInsert = jest.fn();
            mockSupabase.insert = mockInsert;

            // Workspace creation succeeds
            mockInsert.mockReturnValueOnce({
                select: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({ data: createdWorkspace, error: null })
                })
            });

            // Member addition fails
            mockInsert.mockReturnValueOnce(Promise.resolve({ error: { message: 'Member Error' } }));

            await expect(workspaceService.createWorkspace(mockWorkspace)).rejects.toThrow('Failed to add owner to workspace');
        });
    });
});
