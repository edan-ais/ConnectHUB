import { Product } from '../../types/product';
import { rowBgClass } from './colors';

export function rowClassName(product: Product): string {
  return `${rowBgClass(product.validationStatus)} hover:bg-slate-200`;
}
