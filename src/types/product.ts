export type LocationId = 'salty_tails' | 'central_coast' | 'central_valley' | string;

export type ValidationStatus = 'pending' | 'incomplete' | 'validated';

export interface LocationAllocation {
  locationId: LocationId;
  onHand: number;
  onOrder: number;
  reorderPoint: number | null;
}

export interface Product {
  id: string;
  sku: string;
  faireSku?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  vendor?: string;
  category?: string;
  tags: string[];
  newInventory: number;
  onHandInventory: number;
  locations: LocationAllocation[];
  lastOrderDate?: string;
  lastSaleDate?: string;
  isArchived: boolean;
  validationStatus: ValidationStatus;
  missingFields: string[];
  canSyncToSquare: boolean;
  canSyncToBooker: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductLogEntry {
  id: string;
  productId?: string;
  timestamp: string;
  source: 'Faire' | 'Square' | 'Booker' | 'QuickBooks' | 'ConnectHUB';
  action: string;
  status: 'success' | 'error' | 'info';
  detail?: string;
}
