import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getUserId = () => {
  const userId = process.env.OPSIA_USER_ID;
  if (!userId) {
    throw new Error('Missing OPSIA_USER_ID environment variable');
  }
  return userId;
};
