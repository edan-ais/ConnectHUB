// src/components/ValidationSummary.tsx
import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Product } from '../types';

interface ValidationSummaryProps {
  products: Product[];
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({ products }) => {
  const validated = products.filter(p => p.validationStatus === 'validated').length;
  const pending   = products.filter(p => p.validationStatus === 'pending').length;
  const incomplete = products.filter(p => p.validationStatus === 'incomplete').length;
  const total = products.length || 1;

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 border border-emerald-300">
        <CheckCircle2 size={14} className="text-emerald-600" />
        <span className="font-semibold text-emerald-700">{validated}</span>
        <span className="text-slate-600">validated</span>
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 border border-amber-300">
        <AlertTriangle size={14} className="text-amber-600" />
        <span className="font-semibold text-amber-700">{pending}</span>
        <span className="text-slate-600">pending</span>
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 border border-rose-300">
        <XCircle size={14} className="text-rose-600" />
        <span className="font-semibold text-rose-700">{incomplete}</span>
        <span className="text-slate-600">incomplete</span>
      </span>
      <span className="text-slate-500">
        ({Math.round((validated / total) * 100)}% green)
      </span>
    </div>
  );
};
