import type { SheetColumn } from './column-defs-master';

export const mainColumns: SheetColumn[] = [
  { key: 'sku', label: 'SKU', editable: false, width: '120px' },
  { key: 'name', label: 'Name', editable: true, width: '220px' },
  { key: 'description', label: 'Description', editable: true, width: '260px' },
  { key: 'category', label: 'Category', editable: true, width: '140px' },
  { key: 'onHandInventory', label: 'On Hand', editable: true, width: '80px' },
  { key: 'newInventory', label: 'On Order', editable: true, width: '80px' },
];
