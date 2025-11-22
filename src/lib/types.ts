export type LocationId = "SALTY_TAILS" | "CENTRAL_COAST" | "CENTRAL_VALLEY";

export interface LocationStock {
  locationId: LocationId;
  onHand: number;
  onOrder: number;
}

export type InventoryStatus =
  | "NEW"
  | "NEEDS_REVIEW"
  | "VALIDATED"
  | "ARCHIVED";

export interface Product {
  id: string; // internal connectHUB id
  faireId?: string;
  sku: string;
  name: string;
  description: string;
  imageUrl?: string;
  vendorName?: string;
  category?: string;
  tags: string[];

  // Inventory
  onHandTotal: number;
  onOrderTotal: number;
  archived: boolean;

  locations: LocationStock[];

  // Validation
  status: InventoryStatus;
  missingFields: string[]; // e.g. ["description", "category"]
  notes?: string;

  // Integration flags
  pushToSquare: boolean;
  pushToQuickBooks: boolean;
  pushToBooker: boolean; // only true when Salty Tails
  isSaltyTailsOnly: boolean;

  // Audit
  createdAt: string;
  updatedAt: string;
}

export type TabId = "MASTER" | "MAIN" | "INTAKE" | "REPORTS" | "LOGS";

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  type:
    | "IMPORT_FAIRE"
    | "MANUAL_CREATE"
    | "EDIT"
    | "VALIDATE"
    | "PUSH_SQUARE"
    | "PUSH_QB"
    | "PUSH_BOOKER"
    | "INVENTORY_ADJUSTMENT";
  message: string;
  productId?: string;
  payload?: Record<string, unknown>;
}
