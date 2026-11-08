import { supabase, getUserId } from '../supabase.js';

export interface Category {
  id: string;
  name: string;
  expense_type: string | null;
  income_category: boolean;
}

export async function getCategories(): Promise<{
  categories: Category[];
  expense_categories: string[];
  income_categories: string[];
}> {
  const userId = getUserId();

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, expense_type, income_category')
    .eq('user_id', userId)
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  const categories = data || [];
  const expense_categories = categories
    .filter(c => !c.income_category)
    .map(c => c.name);
  const income_categories = categories
    .filter(c => c.income_category)
    .map(c => c.name);

  return {
    categories,
    expense_categories,
    income_categories,
  };
}

export async function getCategoryIdByName(categoryName: string): Promise<string | null> {
  const userId = getUserId();

  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('user_id', userId)
    .eq('name', categoryName)
    .single();

  if (error || !data) {
    return null;
  }

  return data.id;
}
