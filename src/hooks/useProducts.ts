import { useCallback, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Product } from '../types/product';
import {
  productsState,
  productsLoadingState,
  productsSavingState,
  lastSavedAtState,
} from '../state/productAtom';
import { productsApi } from '../lib/api/products';
import { computeMissingFields, computeValidationStatus } from '../lib/grid/validation';

export function useProducts() {
  const [products, setProducts] = useRecoilState(productsState);
  const [loading, setLoading] = useRecoilState(productsLoadingState);
  const [saving, setSaving] = useRecoilState(productsSavingState);
  const setLastSavedAt = useSetRecoilState(lastSavedAtState);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsApi.getProducts();
      const withValidation = res.map((p) => {
        const missing = computeMissingFields(p);
        const status = computeValidationStatus({ ...p, missingFields: missing });
        return { ...p, missingFields: missing, validationStatus: status };
      });
      setProducts(withValidation);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateField = useCallback(
    async (productId: string, key: string, rawValue: string) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== productId) return p;
          let value: any = rawValue;
          if (key === 'newInventory' || key === 'onHandInventory') {
            value = Number(rawValue) || 0;
          }
          const updated = { ...p, [key]: value };
          const missingFields = computeMissingFields(updated);
          const validationStatus = computeValidationStatus({
            ...updated,
            missingFields,
          });
          return { ...updated, missingFields, validationStatus };
        })
      );

      setSaving(true);
      try {
        await productsApi.updateProductField(productId, key, rawValue);
        setLastSavedAt(new Date());
      } catch (err) {
        console.error('Failed to save field', err);
      } finally {
        setSaving(false);
      }
    },
    [setProducts, setSaving, setLastSavedAt]
  );

  const toggleValidation = useCallback(
    async (productId: string) => {
      const current = products.find((p) => p.id === productId);
      if (!current) return;
      const nextStatus = current.validationStatus === 'validated' ? 'pending' : 'validated';

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, validationStatus: nextStatus } : p
        )
      );

      setSaving(true);
      try {
        await productsApi.updateValidationStatus(productId, nextStatus);
        setLastSavedAt(new Date());
      } catch (err) {
        console.error('Failed to update validation', err);
      } finally {
        setSaving(false);
      }
    },
    [products, setProducts, setSaving, setLastSavedAt]
  );

  return {
    products,
    loading,
    saving,
    loadProducts,
    updateField,
    toggleValidation,
  };
}
