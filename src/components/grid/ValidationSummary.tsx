import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Product } from '../../types/product';
import { Badge } from '../ui/Badge';
import { percent } from '../../lib/utils/math';

interface ValidationSummaryProps {
  products: Product[];
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({ products }) => {
  const validated = products.filter((p) => p.validationStatus === 'validated').length;
  const pending = products.filter((p) => p.validationStatus === 'pending').length;
  const incomplete = products.filter((p) => p.validationStatus === 'incomplete').length;
  const pct = percent(validated, products.length || 1);

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <Badge variant="green">
        <CheckCircle2 size={14} />
        <span className="font-semibold">{validated}</span>
        <span>validated</span>
      </Badge>
      <Badge variant="yellow">
        <AlertTriangle size={14} />
        <span className="font-semibold">{pending}</span>
        <span>pending</span>
      </Badge>
      <Badge variant="red">
        <XCircle size={14} />
        <span className="font-semibold">{incomplete}</span>
        <span>incomplete</span>
      </Badge>
      <span className="text-slate-500">({pct}% green)</span>
    </div>
  );
};
