import { create } from "zustand";
import { ActivityLogEntry, Product, TabId } from "../lib/types";
import { mockActivityLog, mockProducts } from "../lib/mockData";

interface InventoryState {
  activeTab: TabId;
  products: Product[];
  activityLog: ActivityLogEntry[];

  // Search
  searchQuery: string;

  // Derived counts
  validatedCount: number;
  needsReviewCount: number;

  // Actions
  setActiveTab: (tab: TabId) => void;
  setSearchQuery: (query: string) => void;
  updateProductField: <K extends keyof Product>(
    id: string,
    field: K,
    value: Product[K]
  ) => void;
  validateProduct: (id: string) => void;
  createManualProduct: (
    partial: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => void;
  logEvent: (entry: Omit<ActivityLogEntry, "id" | "timestamp">) => void;
}

const recomputeCounts = (products: Product[]) => {
  const validatedCount = products.filter(p => p.status === "VALIDATED").length;
  const needsReviewCount = products.filter(
    p => p.status === "NEEDS_REVIEW" || p.status === "NEW"
  ).length;
  return { validatedCount, needsReviewCount };
};

export const useInventoryStore = create<InventoryState>((set, get) => {
  const initialProducts = mockProducts;
  const counts = recomputeCounts(initialProducts);

  return {
    activeTab: "MASTER",
    products: initialProducts,
    activityLog: mockActivityLog,
    searchQuery: "",
    ...counts,

    setActiveTab: tab => set({ activeTab: tab }),

    setSearchQuery: query => set({ searchQuery: query }),

    updateProductField: (id, field, value) => {
      set(state => {
        const updated = state.products.map(p =>
          p.id === id
            ? {
                ...p,
                [field]: value,
                updatedAt: new Date().toISOString()
              }
            : p
        );
        const newCounts = recomputeCounts(updated);

        const log: ActivityLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "EDIT",
          message: `Edited ${field.toString()} for product ${id}.`,
          productId: id,
          payload: { field, value }
        };

        return {
          products: updated,
          activityLog: [log, ...state.activityLog],
          ...newCounts
        };
      });
    },

    validateProduct: id => {
      set(state => {
        const updated = state.products.map(p => {
          if (p.id !== id) return p;
          return {
            ...p,
            status: "VALIDATED",
            missingFields: [],
            pushToSquare: !p.isSaltyTailsOnly,
            pushToQuickBooks: true,
            pushToBooker: p.isSaltyTailsOnly,
            updatedAt: new Date().toISOString()
          };
        });

        const newCounts = recomputeCounts(updated);

        const log: ActivityLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "VALIDATE",
          message: `Validated product ${id}.`,
          productId: id
        };

        return {
          products: updated,
          activityLog: [log, ...state.activityLog],
          ...newCounts
        };
      });
    },

    createManualProduct: partial => {
      const id = `manual-${Date.now()}`;
      const now = new Date().toISOString();
      const product: Product = {
        id,
        ...partial,
        createdAt: now,
        updatedAt: now
      };

      set(state => {
        const products = [product, ...state.products];
        const newCounts = recomputeCounts(products);
        const log: ActivityLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: now,
          type: "MANUAL_CREATE",
          message: `Manually created product ${product.name || product.sku}.`,
          productId: id
        };
        return {
          products,
          activityLog: [log, ...state.activityLog],
          ...newCounts
        };
      });
    },

    logEvent: entry => {
      const now = new Date().toISOString();
      const log: ActivityLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: now,
        ...entry
      };
      set(state => ({
        activityLog: [log, ...state.activityLog]
      }));
    }
  };
});

