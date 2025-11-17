import { ValidationStatus } from '../../types/product';

export function rowBgClass(status: ValidationStatus): string {
  if (status === 'validated') return 'bg-emerald-50';
  if (status === 'incomplete') return 'bg-rose-50';
  return 'bg-amber-50';
}

export function statusPillClass(status: ValidationStatus): string {
  if (status === 'validated') return 'bg-emerald-100 text-emerald-700 border-emerald-300';
  if (status === 'incomplete') return 'bg-rose-100 text-rose-700 border-rose-300';
  return 'bg-amber-100 text-amber-700 border-amber-300';
}
