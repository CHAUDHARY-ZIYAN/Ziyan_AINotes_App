import { noteService } from './notes';
import { createClient } from '@/lib/supabase/client';
import { AppError } from '@/utils/AppError';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
    createClient: jest.fn(),
}));

describe('noteService', () => {
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

    describe('getNote', () => {
        it('should fetch a note successfully', async () => {
            const mockNote = { id: '1', title: 'Test Note' };
            mockSupabase.single.mockResolvedValue({ data: mockNote, error: null });

            const result = await noteService.getNote('1');
            expect(result).toEqual(mockNote);
            expect(mockSupabase.from).toHaveBeenCalledWith('notes');
            expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
        });

        it('should throw AppError on failure', async () => {
            mockSupabase.single.mockResolvedValue({ data: null, error: { message: 'Error' } });

            await expect(noteService.getNote('1')).rejects.toThrow(AppError);
        });
    });

    describe('createNote', () => {
        it('should create a note successfully', async () => {
            const mockNote = { title: 'New Note' };
            const createdNote = { id: '1', ...mockNote };
            mockSupabase.single.mockResolvedValue({ data: createdNote, error: null });

            const result = await noteService.createNote(mockNote);
            expect(result).toEqual(createdNote);
            expect(mockSupabase.from).toHaveBeenCalledWith('notes');
            expect(mockSupabase.insert).toHaveBeenCalledWith(mockNote);
        });

        it('should throw AppError on failure', async () => {
            mockSupabase.single.mockResolvedValue({ data: null, error: { message: 'Error' } });

            await expect(noteService.createNote({})).rejects.toThrow(AppError);
        });
    });

    describe('updateNote', () => {
        it('should update a note successfully', async () => {
            const updates = { title: 'Updated Title' };
            const updatedNote = { id: '1', ...updates };
            mockSupabase.single.mockResolvedValue({ data: updatedNote, error: null });

            const result = await noteService.updateNote('1', updates);
            expect(result).toEqual(updatedNote);
            expect(mockSupabase.from).toHaveBeenCalledWith('notes');
            expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining(updates));
            expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
        });
    });

    describe('deleteNote', () => {
        it('should delete a note successfully', async () => {
            const mockEq = jest.fn().mockResolvedValue({ error: null });
            mockSupabase.delete.mockReturnValue({ eq: mockEq });

            await noteService.deleteNote('1');
            expect(mockSupabase.from).toHaveBeenCalledWith('notes');
            expect(mockSupabase.delete).toHaveBeenCalled();
            expect(mockEq).toHaveBeenCalledWith('id', '1');
        });
    });
});
