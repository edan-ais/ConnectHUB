export interface SheetColumn {
  key: string;
  label: string;
  width?: string;
  editable?: boolean;
}

export const masterColumns: SheetColumn[] = [
  { key: 'sku', label: 'SKU', editable: true, width: '120px' },
  { key: 'name', label: 'Name', editable: true, width: '220px' },
  { key: 'description', label: 'Description', editable: true, width: '260px' },
  { key: 'vendor', label: 'Vendor', editable: true, width: '140px' },
  { key: 'category', label: 'Category', editable: true, width: '140px' },
  { key: 'newInventory', label: 'New Inv', editable: true, width: '80px' },
  { key: 'onHandInventory', label: 'On Hand', editable: true, width: '80px' },
];
