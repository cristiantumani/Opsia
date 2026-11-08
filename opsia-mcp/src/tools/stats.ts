import { supabase, getUserId } from '../supabase.js';

export interface MonthStats {
  month: string;
  total_income: number;
  total_expenses: number;
  net_savings: number;
  transaction_count: number;
  top_categories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export async function getMonthStats(year: number, month: number): Promise<MonthStats> {
  const userId = getUserId();

  // Format month as YYYY-MM
  const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
  const startDate = `${monthStr}-01`;

  // Calculate last day of month
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${monthStr}-${lastDay}`;

  // Fetch transactions for the month
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) {
    throw new Error(`Failed to fetch stats: ${error.message}`);
  }

  const txs = transactions || [];

  // Calculate totals
  const total_income = txs
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const total_expenses = txs
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const net_savings = total_income - total_expenses;

  // Calculate top categories (expenses only)
  const categoryTotals = new Map<string, number>();
  txs
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const categoryName = (t.categories as any)?.name || 'Unknown';
      categoryTotals.set(
        categoryName,
        (categoryTotals.get(categoryName) || 0) + Number(t.amount)
      );
    });

  const top_categories = Array.from(categoryTotals.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total_expenses > 0 ? (amount / total_expenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return {
    month: monthStr,
    total_income,
    total_expenses,
    net_savings,
    transaction_count: txs.length,
    top_categories,
  };
}

export async function getCurrentMonthStats(): Promise<MonthStats> {
  const now = new Date();
  return getMonthStats(now.getFullYear(), now.getMonth() + 1);
}
