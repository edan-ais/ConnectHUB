import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  MouseEvent as ReactMouseEvent,
} from "react";
import { ChevronDown } from "lucide-react";
import { useMasterInventory } from "../../hooks/useMasterInventory";
import "../../styles/app.css";

type SortState = { col: string; dir: "asc" | "desc" | null };

type ColumnDef = {
  key: string;
  label: string;
  group: GroupName;
  sticky?: boolean; // Only for Status + Product Name
  isImage?: boolean;
};

type GroupName =
  | "Core"
  | "Inventory"
  | "Classification"
  | "Variants"
  | "Shopify"
  | "Pricing & Accounts"
  | "Tax & Weight"
  | "Fulfillment"
  | "Stock Alerts"
  | "Quantities"
  | "Identifiers"
  | "Integrations / SEO"
  | "Lifecycle";

interface ColumnFilterMenuProps {
  values: string[];
  activeValues: string[];
  setValues: (vals: string[]) => void;
  sortAsc: () => void;
  sortDesc: () => void;
  clearSort: () => void;
  close: () => void;
}

/**
 * Excel-style column filter dropdown (no search input).
 */
const ColumnFilterMenu: React.FC<ColumnFilterMenuProps> = ({
  values,
  activeValues,
  setValues,
  sortAsc,
  sortDesc,
  clearSort,
  close,
}) => {
  const toggle = (val: string) => {
    if (activeValues.includes(val)) {
      setValues(activeValues.filter((v) => v !== val));
    } else {
      setValues([...activeValues, val]);
    }
  };

  return (
    <div className="filter-menu" onClick={(e) => e.stopPropagation()}>
      <div className="filter-section">
        <button onClick={sortAsc}>Sort A → Z</button>
        <button onClick={sortDesc}>Sort Z → A</button>
        <button onClick={clearSort}>Clear sort</button>
      </div>

      <div className="filter-divider" />

      <div className="filter-value-list">
        {values.map((v) => (
          <label key={v || "(blank)"} className="filter-checkbox-row">
            <input
              type="checkbox"
              checked={activeValues.includes(v)}
              onChange={() => toggle(v)}
            />
            {v || "(blank)"}
          </label>
        ))}
      </div>

      <div className="filter-actions">
        <button className="filter-action-btn" onClick={close}>
          Close
        </button>
        <button className="filter-action-btn primary" onClick={close}>
          Apply
        </button>
      </div>
    </div>
  );
};

export const MasterGrid: React.FC = () => {
  const { rows, loading, error } = useMasterInventory();

  const [sort, setSort] = useState<SortState>({ col: "", dir: null });
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [openCol, setOpenCol] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const headerCellRefs = useRef<Record<string, HTMLTableCellElement | null>>({});
  const [statusWidth, setStatusWidth] = useState<number>(180);

  // ORDERED group list so header groups always line up in a predictable way
  const groupOrder: GroupName[] = [
    "Core",
    "Inventory",
    "Classification",
    "Variants",
    "Shopify",
    "Pricing & Accounts",
    "Tax & Weight",
    "Fulfillment",
    "Stock Alerts",
    "Quantities",
    "Identifiers",
    "Integrations / SEO",
    "Lifecycle",
  ];

  // Explicit mapping for group -> class suffix (no weird extra hyphens)
  const groupClassMap: Record<GroupName, string> = {
    "Core": "core",
    "Inventory": "inventory",
    "Classification": "classification",
    "Variants": "variants",
    "Shopify": "shopify",
    "Pricing & Accounts": "pricing-accounts",
    "Tax & Weight": "tax-weight",
    "Fulfillment": "fulfillment",
    "Stock Alerts": "stock-alerts",
    "Quantities": "quantities",
    "Identifiers": "identifiers",
    "Integrations / SEO": "integrations-seo",
    "Lifecycle": "lifecycle",
  };

  // --- COLUMN DEFINITIONS (Product Name is SECOND column) ---
  const columns: ColumnDef[] = [
    // CORE
    { key: "status", label: "Status", group: "Core", sticky: true }, // col 1
    {
      key: "product_name",
      label: "Product Name",
      group: "Core",
      sticky: true,
    }, // col 2

    // INVENTORY
    { key: "sku", label: "SKU", group: "Inventory" },
    { key: "vendor", label: "Vendor", group: "Inventory" },
    {
      key: "total_inventory_on_hand",
      label: "Inventory On Hand – Total",
      group: "Inventory",
    },
    {
      key: "total_inventory_on_the_way",
      label: "Inventory On The Way – Total",
      group: "Inventory",
    },
    { key: "incoming_total", label: "Incoming Total", group: "Inventory" },
    {
      key: "qty_coastal_cowgirl",
      label: "Inventory On Hand – Coastal Cowgirl",
      group: "Inventory",
    },
    {
      key: "qty_salty_tails",
      label: "Inventory On Hand – Salty Tails",
      group: "Inventory",
    },
    {
      key: "qty_central_valley",
      label: "Inventory On Hand – Central Valley",
      group: "Inventory",
    },
    {
      key: "new_qty_coastal_cowgirl",
      label: "Inventory On The Way – Coastal Cowgirl",
      group: "Inventory",
    },
    {
      key: "new_qty_salty_tails",
      label: "Inventory On The Way – Salty Tails",
      group: "Inventory",
    },
    {
      key: "new_qty_central_valley",
      label: "Inventory On The Way – Central Valley",
      group: "Inventory",
    },
    { key: "reorder_point", label: "Reorder Point", group: "Inventory" },

    // CLASSIFICATION
    { key: "product_type", label: "Product Type", group: "Classification" },
    {
      key: "product_category",
      label: "Product Category",
      group: "Classification",
    },
    { key: "category", label: "Category", group: "Classification" },
    {
      key: "reporting_category",
      label: "Reporting Category",
      group: "Classification",
    },
    { key: "description", label: "Description", group: "Classification" },
    {
      key: "sales_description",
      label: "Sales Description",
      group: "Classification",
    },
    {
      key: "purchase_description",
      label: "Purchase Description",
      group: "Classification",
    },
    { key: "tags", label: "Tags", group: "Classification" },

    // VARIANTS
    {
      key: "single_parent_or_variant",
      label: "Single Parent or Variant",
      group: "Variants",
    },
    { key: "variant_name", label: "Variant Name", group: "Variants" },
    { key: "variant_title", label: "Variant Title", group: "Variants" },
    { key: "option1_name", label: "Option 1 Name", group: "Variants" },
    { key: "option1_value", label: "Option 1 Value", group: "Variants" },
    { key: "option2_name", label: "Option 2 Name", group: "Variants" },
    { key: "option2_value", label: "Option 2 Value", group: "Variants" },
    { key: "option3_name", label: "Option 3 Name", group: "Variants" },
    { key: "option3_value", label: "Option 3 Value", group: "Variants" },
    { key: "option4_name", label: "Option 4 Name", group: "Variants" },
    { key: "option4_value", label: "Option 4 Value", group: "Variants" },

    // SHOPIFY
    { key: "handle", label: "Shopify Handle", group: "Shopify" },
    { key: "permalink", label: "Shopify Permalink", group: "Shopify" },
    {
      key: "image_url",
      label: "Product Image",
      group: "Shopify",
      isImage: true,
    },
    {
      key: "variant_image_url",
      label: "Variant Image",
      group: "Shopify",
      isImage: true,
    },
    { key: "square_image_id", label: "Square Image ID", group: "Shopify" },

    // PRICING & ACCOUNTS
    { key: "price", label: "Base Price", group: "Pricing & Accounts" },
    { key: "online_price", label: "Online Price", group: "Pricing & Accounts" },
    { key: "cost", label: "Cost", group: "Pricing & Accounts" },
    { key: "compare_at", label: "Compare At Price", group: "Pricing & Accounts" },
    {
      key: "default_unit_cost",
      label: "Default Unit Cost",
      group: "Pricing & Accounts",
    },
    {
      key: "income_account",
      label: "Income Account (QB)",
      group: "Pricing & Accounts",
    },
    {
      key: "expense_account",
      label: "Expense Account (QB)",
      group: "Pricing & Accounts",
    },
    {
      key: "inventory_asset_account",
      label: "Inventory Asset Account (QB)",
      group: "Pricing & Accounts",
    },

    // TAX & WEIGHT
    { key: "sales_tax_rate", label: "Sales Tax Rate", group: "Tax & Weight" },
    { key: "tax_code", label: "Tax Code", group: "Tax & Weight" },
    { key: "taxable", label: "Taxable?", group: "Tax & Weight" },
    {
      key: "last_delivery_date",
      label: "Last Delivery Date",
      group: "Tax & Weight",
    },
    { key: "weight_lb", label: "Weight (lb)", group: "Tax & Weight" },

    // FULFILLMENT
    {
      key: "shipping_enabled",
      label: "Shipping Enabled",
      group: "Fulfillment",
    },
    {
      key: "self_serve_ordering_enabled",
      label: "Self-Serve Ordering Enabled",
      group: "Fulfillment",
    },
    {
      key: "delivery_enabled",
      label: "Delivery Enabled",
      group: "Fulfillment",
    },
    { key: "pickup_enabled", label: "Pickup Enabled", group: "Fulfillment" },

    // STOCK ALERTS
    {
      key: "stock_alert_enabled_cc",
      label: "Stock Alert – Coastal Cowgirl",
      group: "Stock Alerts",
    },
    {
      key: "stock_alert_count_cc",
      label: "Alert Threshold – Coastal Cowgirl",
      group: "Stock Alerts",
    },
    {
      key: "stock_alert_enabled_st",
      label: "Stock Alert – Salty Tails",
      group: "Stock Alerts",
    },
    {
      key: "stock_alert_count_st",
      label: "Alert Threshold – Salty Tails",
      group: "Stock Alerts",
    },
    {
      key: "stock_alert_enabled_cv",
      label: "Stock Alert – Central Valley",
      group: "Stock Alerts",
    },
    {
      key: "stock_alert_count_cv",
      label: "Alert Threshold – Central Valley",
      group: "Stock Alerts",
    },

    // QUANTITIES SNAPSHOT
    {
      key: "total_quantity",
      label: "Total Quantity (Snapshot)",
      group: "Quantities",
    },
    {
      key: "current_qty_cc",
      label: "Current Qty – Coastal Cowgirl",
      group: "Quantities",
    },
    {
      key: "current_qty_st",
      label: "Current Qty – Salty Tails",
      group: "Quantities",
    },
    {
      key: "current_qty_cv",
      label: "Current Qty – Central Valley",
      group: "Quantities",
    },
    {
      key: "quantity_as_of_date",
      label: "Quantity As Of Date",
      group: "Quantities",
    },

    // IDENTIFIERS
    { key: "parent_sku", label: "Parent SKU", group: "Identifiers" },
    { key: "barcode", label: "Barcode", group: "Identifiers" },
    { key: "gtin", label: "GTIN", group: "Identifiers" },
    { key: "vendor_code", label: "Vendor Code", group: "Identifiers" },
    { key: "sellable", label: "Sellable?", group: "Identifiers" },
    { key: "stockable", label: "Stockable?", group: "Identifiers" },
    {
      key: "contains_alcohol",
      label: "Contains Alcohol?",
      group: "Identifiers",
    },
    {
      key: "skip_pos_detail",
      label: "Skip POS Detail",
      group: "Identifiers",
    },

    // INTEGRATIONS / SEO
    {
      key: "shopify_product_id",
      label: "Shopify Product ID",
      group: "Integrations / SEO",
    },
    {
      key: "shopify_variant_id",
      label: "Shopify Variant ID",
      group: "Integrations / SEO",
    },
    {
      key: "variants_json",
      label: "Variants JSON",
      group: "Integrations / SEO",
    },
    {
      key: "square_object_id",
      label: "Square Object ID",
      group: "Integrations / SEO",
    },
    {
      key: "square_variation_id",
      label: "Square Variation ID",
      group: "Integrations / SEO",
    },
    { key: "stock_json", label: "Stock JSON", group: "Integrations / SEO" },
    { key: "quickbooks_id", label: "QuickBooks ID", group: "Integrations / SEO" },
    { key: "booker_id", label: "Booker ID", group: "Integrations / SEO" },
    { key: "seo_title", label: "SEO Title", group: "Integrations / SEO" },
    {
      key: "seo_description",
      label: "SEO Description",
      group: "Integrations / SEO",
    },

    // LIFECYCLE
    { key: "archived", label: "Archived?", group: "Lifecycle" },
    { key: "archive_reason", label: "Archive Reason", group: "Lifecycle" },
    {
      key: "archived_timestamp",
      label: "Archived Timestamp",
      group: "Lifecycle",
    },
    { key: "master_id", label: "Master ID", group: "Lifecycle" },
    { key: "date_added", label: "Date Added", group: "Lifecycle" },
    { key: "last_updated", label: "Last Updated", group: "Lifecycle" },
    {
      key: "last_synced_square",
      label: "Last Synced – Square",
      group: "Lifecycle",
    },
    {
      key: "last_synced_qb",
      label: "Last Synced – QuickBooks",
      group: "Lifecycle",
    },
    {
      key: "last_synced_booker",
      label: "Last Synced – Booker",
      group: "Lifecycle",
    },
  ];

  // Group spans for header row (using fixed order)
  const groupSpans = useMemo(() => {
    const map: Record<GroupName, number> = {
      Core: 0,
      Inventory: 0,
      Classification: 0,
      Variants: 0,
      Shopify: 0,
      "Pricing & Accounts": 0,
      "Tax & Weight": 0,
      Fulfillment: 0,
      "Stock Alerts": 0,
      Quantities: 0,
      Identifiers: 0,
      "Integrations / SEO": 0,
      Lifecycle: 0,
    };
    columns.forEach((c) => {
      map[c.group] = (map[c.group] || 0) + 1;
    });
    return map;
  }, [columns]);

  // Close filter when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpenCol(null);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  // Measure Status column width once we have header cells,
  // so Product Name sticky offset lines up perfectly.
  useEffect(() => {
    const el = headerCellRefs.current["status"];
    if (el) {
      setStatusWidth(el.offsetWidth || 180);
    }
  }, [rows.length]);

  // Filter + sort
  const processed = useMemo(() => {
    let data = [...rows];

    for (const colKey of Object.keys(filters)) {
      const allowed = filters[colKey];
      if (!allowed || allowed.length === 0) continue;
      data = data.filter((row: any) =>
        allowed.includes(String(row[colKey] ?? ""))
      );
    }

    if (sort.col && sort.dir) {
      const colKey = sort.col;
      const dir = sort.dir;
      data.sort((a: any, b: any) => {
        const A = String(a[colKey] ?? "").toLowerCase();
        const B = String(b[colKey] ?? "").toLowerCase();
        if (A < B) return dir === "asc" ? -1 : 1;
        if (A > B) return dir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [rows, filters, sort]);

  // Sticky style for Status / Product cells
  const getStickyStyle = (col: ColumnDef): React.CSSProperties => {
    if (!col.sticky) return {};
    if (col.key === "status") {
      return {
        position: "sticky",
        left: 0,
        zIndex: 12,
        background: "#ffffff",
      };
    }
    if (col.key === "product_name") {
      return {
        position: "sticky",
        left: statusWidth,
        zIndex: 11,
        background: "#ffffff",
      };
    }
    return {};
  };

  if (loading) {
    return (
      <div className="sheet-container">
        <div className="sheet-name sheet-name-large">Master (loading…)</div>
        <div className="empty-state">Loading Master inventory…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sheet-container">
        <div className="sheet-name sheet-name-large">Master (error)</div>
        <div className="empty-state">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="sheet-container fade-in">
      <div className="sheet-name sheet-name-large">
        Master (Source of Truth · read-only)
      </div>

      <div className="sheet-table-wrapper wide-scroll" ref={containerRef}>
        <table className="sheet-table sheet-table-master">
          <thead>
            {/* GROUP HEADER ROW (color-coded, Core sticky left) */}
            <tr className="header-group-row">
              {groupOrder.map((group) => {
                const span = groupSpans[group];
                if (!span) return null;

                const classSuffix = groupClassMap[group];
                const isCore = group === "Core";

                const style: React.CSSProperties = isCore
                  ? {
                      position: "sticky",
                      left: 0,
                      top: 0,
                      zIndex: 14,
                      background: "#dbeafe",
                    }
                  : { top: 0, position: "sticky", zIndex: 13 };

                return (
                  <th
                    key={group}
                    colSpan={span}
                    className={`header-group-cell header-group-${classSuffix}`}
                    style={style}
                  >
                    {group}
                  </th>
                );
              })}
            </tr>

            {/* COLUMN HEADERS (each with filter) */}
            <tr className="column-header-row">
              {columns.map((col) => {
                const stickyStyle = getStickyStyle(col);

                const uniqueValues = Array.from(
                  new Set(
                    rows.map((r: any) => String(r[col.key] ?? ""))
                  )
                ).sort((a, b) => a.localeCompare(b));

                const isActiveFilter =
                  (filters[col.key] || []).length > 0 ||
                  (sort.col === col.key && !!sort.dir);

                return (
                  <th
                    key={col.key}
                    style={stickyStyle}
                    ref={(el) => {
                      headerCellRefs.current[col.key] = el;
                    }}
                  >
                    <div className="header-cell">
                      <span className="header-label">{col.label}</span>
                      <button
                        className={
                          "filter-button" + (isActiveFilter ? " active" : "")
                        }
                        onClick={(e: ReactMouseEvent) => {
                          e.stopPropagation();
                          setOpenCol(openCol === col.key ? null : col.key);
                        }}
                      >
                        <ChevronDown size={16} />
                      </button>

                      {openCol === col.key && (
                        <ColumnFilterMenu
                          values={uniqueValues}
                          activeValues={filters[col.key] || []}
                          setValues={(vals) =>
                            setFilters((prev) => ({
                              ...prev,
                              [col.key]: vals,
                            }))
                          }
                          sortAsc={() => setSort({ col: col.key, dir: "asc" })}
                          sortDesc={() =>
                            setSort({ col: col.key, dir: "desc" })
                          }
                          clearSort={() => setSort({ col: "", dir: null })}
                          close={() => setOpenCol(null)}
                        />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {processed.map((row: any) => (
              <tr
                key={row.id}
                className={`master-row row-status-${String(
                  row.status || ""
                ).toLowerCase()}`}
              >
                {columns.map((col) => {
                  const stickyStyle = getStickyStyle(col);
                  let value: any = row[col.key];

                  if (typeof value === "boolean") {
                    value = value ? "Yes" : "";
                  }

                  if (col.isImage) {
                    return (
                      <td key={col.key} style={stickyStyle}>
                        {value ? (
                          <img
                            src={String(value)}
                            alt=""
                            className="mini-image"
                          />
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  }

                  return (
                    <td key={col.key} style={stickyStyle}>
                      {String(value ?? "")}
                    </td>
                  );
                })}
              </tr>
            ))}

            {processed.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="empty-state">
                  No products match filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

