// src/lib/api/logs.ts
import { supabase } from '../supabase';

export async function fetchLogs(limit = 200) {
  const { data, error } = await supabase
    .from('product_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
