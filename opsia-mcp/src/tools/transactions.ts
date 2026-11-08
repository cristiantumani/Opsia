import { supabase, getUserId } from '../supabase.js';
import { getCategoryIdByName } from './categories.js';

export interface Transaction {
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
}

export interface TransactionInsertResult {
  success: number;
  failed: number;
  errors: string[];
}

export async function insertTransactions(
  transactions: Transaction[]
): Promise<TransactionInsertResult> {
  const userId = getUserId();
  const result: TransactionInsertResult = {
    success: 0,
    failed: 0,
    errors: [],
  };

  // Process transactions in batches
  const batchSize = 100;
  for (let i = 0; i < transactions.length; i += batchSize) {
    const batch = transactions.slice(i, i + batchSize);

    // Prepare batch for insertion
    const insertData = [];
    for (const tx of batch) {
      // Get category ID
      const categoryId = await getCategoryIdByName(tx.category);
      if (!categoryId) {
        result.failed++;
        result.errors.push(`Category not found: ${tx.category} for transaction: ${tx.description}`);
        continue;
      }

      insertData.push({
        user_id: userId,
        date: tx.date,
        type: tx.type,
        category_id: categoryId,
        amount: tx.amount,
        description: tx.description || '',
      });
    }

    // Insert batch
    if (insertData.length > 0) {
      const { error } = await supabase
        .from('transactions')
        .insert(insertData);

      if (error) {
        result.failed += insertData.length;
        result.errors.push(`Batch insert error: ${error.message}`);
      } else {
        result.success += insertData.length;
      }
    }
  }

  return result;
}

export async function getTransactions(params: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<any[]> {
  const userId = getUserId();

  let query = supabase
    .from('transactions')
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (params.startDate) {
    query = query.gte('date', params.startDate);
  }

  if (params.endDate) {
    query = query.lte('date', params.endDate);
  }

  if (params.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }

  return data || [];
}

export async function checkDuplicates(
  transactions: Transaction[]
): Promise<{
  duplicates: number;
  unique: number;
  duplicate_details: Array<{ date: string; amount: number; description: string }>;
}> {
  const userId = getUserId();

  // Get date range from transactions
  const dates = transactions.map(t => t.date);
  const minDate = dates.reduce((a, b) => (a < b ? a : b));
  const maxDate = dates.reduce((a, b) => (a > b ? a : b));

  // Fetch existing transactions in this date range
  const { data: existing, error } = await supabase
    .from('transactions')
    .select('date, amount, description')
    .eq('user_id', userId)
    .gte('date', minDate)
    .lte('date', maxDate);

  if (error) {
    throw new Error(`Failed to check duplicates: ${error.message}`);
  }

  // Check for duplicates (same date + amount + description)
  const existingSet = new Set(
    (existing || []).map(t => `${t.date}|${t.amount}|${t.description}`)
  );

  const duplicateDetails: Array<{ date: string; amount: number; description: string }> = [];
  let duplicateCount = 0;

  for (const tx of transactions) {
    const key = `${tx.date}|${tx.amount}|${tx.description || ''}`;
    if (existingSet.has(key)) {
      duplicateCount++;
      duplicateDetails.push({
        date: tx.date,
        amount: tx.amount,
        description: tx.description || '',
      });
    }
  }

  return {
    duplicates: duplicateCount,
    unique: transactions.length - duplicateCount,
    duplicate_details: duplicateDetails.slice(0, 10), // Return first 10 duplicates
  };
}
