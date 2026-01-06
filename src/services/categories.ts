import { createClient } from '@/lib/supabase/client';
import { Category } from '@/types/supabase';
import { AppError } from '@/utils/AppError';

export const categoryService = {
    async getCategories(workspaceId: string): Promise<Category[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('workspace_id', workspaceId)
            .is('parent_id', null)
            .order('position', { ascending: true });

        if (error) {
            throw new AppError('Failed to fetch categories', 500, true);
        }

        return data as Category[];
    },

    async createCategory(category: Partial<Category>): Promise<Category> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('categories')
            .insert(category as Omit<Category, 'id' | 'created_at'>)
            .select()
            .single();

        if (error) {
            throw new AppError('Failed to create category', 500, true);
        }

        return data as Category;
    }
};
