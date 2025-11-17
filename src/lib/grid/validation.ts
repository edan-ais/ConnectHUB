import { Product, ValidationStatus } from '../../types/product';

const REQUIRED_FIELDS = ['sku', 'name', 'description'] as const;

export function computeMissingFields(product: Product): string[] {
  const missing: string[] = [];

  REQUIRED_FIELDS.forEach((field) => {
    const value = (product as any)[field];
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      missing.push(field);
    }
  });

  return missing;
}

export function computeValidationStatus(product: Product): ValidationStatus {
  const missing = computeMissingFields(product);
  if (missing.length > 0) return 'incomplete';
  // If user explicitly sets validated, we keep that; otherwise pending.
  return product.validationStatus === 'validated' ? 'validated' : 'pending';
}
