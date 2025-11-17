// src/lib/api/products.ts
import { supabase } from '../supabase';
import type { Product } from '@/types/product';

export async function fetchActiveProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('master_products_active')
    .select('*')
    .order('name');
  if (error) throw error;
  return data as Product[];
}

export async function fetchArchivedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('master_products_archived')
    .select('*');
  if (error) throw error;
  return data as Product[];
}

export async function updateProductField(
  id: string,
  key: string,
  value: any
) {
  const { error } = await supabase
    .from('master_products')
    .update({ [key]: value })
    .eq('id', id);
  if (error) throw error;
}

export async function toggleValidation(id: string, status: string) {
  const { error } = await supabase
    .from('master_products')
    .update({ validation_status: status })
    .eq('id', id);
  if (error) throw error;
}

// Export as productsApi object to match the import in useProducts
export const productsApi = {
  getProducts: fetchActiveProducts,
  updateProductField: updateProductField,
  updateValidationStatus: toggleValidation,
};
