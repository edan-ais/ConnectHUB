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
  group: string;
  sticky?: boolean;
  defaultWidth?: number;
  isImage?: boolean;
};

/* -------------------------------------------------------
 * Excel-style filter dropdown (no search field)
 * -----------------------------------------------------*/
interface ColumnFilterMenuProps {
  values: string[];
  activeValues: string[];
  setValues: (vals: string[]) => void;
  sortAsc: () => void;
  sortDesc: () => void;
  clearSort: () => void;
  close: () => void;
}

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
        <button
          onClick={() => {
            clearSort();
          }}
        >
          Clear sort
        </button>
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
        <button
          className="filter-action-btn primary"
          onClick={close}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------
 * MASTER GRID
 * -----------------------------------------------------*/
export const MasterGrid: React.FC = () => {
  // 1) Hooks at top (React rules)
  const { rows, loading, error } = useMasterInventory();

  const [sort, setSort] = useState<SortState>({ col: "", dir: null });
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [openCol, setOpenCol] = useState<string | null>(null);
  const [colWidths, setColWidths] = useState<Record<string, number>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const colRefs = useRef<Record<string, HTMLTableCellElement | null>>({});

  // 2) Column definitions with grouping + defaults
  const columns: ColumnDef[] = [
    // Core
    {
      key: "status",
      label: "Status",
      group: "Core",
      sticky: true,
      defaultWidth: 160,
    },
    {
      key: "product_name",
      label: "Product Name",
      group: "Core",
      sticky: true,
      defaultWidth: 260,
    },

    // Inventory
    {
      key: "sku",
      label: "SKU",
      group: "Inventory",
      defaultWidth: 140,
    },
    {
      key: "vendor",
      label: "Vendor",
      group: "Inventory",
      defaultWidth: 160,
    },
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
    {
      key: "incoming_total",
      label: "Incoming Total",
      group: "Inventory",
    },
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
    {
      key: "reorder_point",
      label: "Reorder Point",
      group: "Inventory",
    },

    // Classification
    {
      key: "product_type",
      label: "Product Type",
      group: "Classification",
    },
    {
      key: "product_category",
      label: "Product Category",
      group: "Classification",
    },
    {
      key: "category",
      label: "Category",
      group: "Classification",
    },
    {
      key: "reporting_category",
      label: "Reporting Category",
      group: "Classification",
    },
    {
      key: "description",
      label: "Description",
      group: "Classification",
    },
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
    {
      key: "tags",
      label: "Tags",
      group: "Classification",
    },

    // Variants
    {
      key: "single_parent_or_variant",
      label: "Single Parent or Variant",
      group: "Variants",
    },
    {
      key: "variant_name",
      label: "Variant Name",
      group: "Variants",
    },
    {
      key: "variant_title",
      label: "Variant Title",
      group: "Variants",
    },
    {
      key: "option1_name",
      label: "Option 1 Name",
      group: "Variants",
    },
    {
      key: "option1_value",
      label: "Option 1 Value",
      group: "Variants",
    },
    {
      key: "option2_name",
      label: "Option 2 Name",
      group: "Variants",
    },
    {
      key: "option2_value",
      label: "Option 2 Value",
      group: "Variants",
    },
    {
      key: "option3_name",
      label: "Option 3 Name",
      group: "Variants",
    },
    {
      key: "option3_value",
      label: "Option 3 Value",
      group: "Variants",
    },
    {
      key: "option4_name",
      label: "Option 4 Name",
      group: "Variants",
    },
    {
      key: "option4_value",
      label: "Option 4 Value",
      group: "Variants",
    },

    // Shopify
    {
      key: "handle",
      label: "Shopify Handle",
      group: "Shopify",
    },
    {
      key: "permalink",
      label: "Shopify Permalink",
      group: "Shopify",
    },
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
    {
      key: "square_image_id",
      label: "Square Image ID",
      group: "Shopify",
    },

    // Pricing & Accounts
    {
      key: "price",
      label: "Base Price",
      group: "Pricing & Accounts",
    },
    {
      key: "online_price",
      label: "Online Price",
      group: "Pricing & Accounts",
    },
    {
      key: "cost",
      label: "Cost",
      group: "Pricing & Accounts",
    },
    {
      key: "compare_at",
      label: "Compare At Price",
      group: "Pricing & Accounts",
    },
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

    // Tax & Weight
    {
      key: "sales_tax_rate",
      label: "Sales Tax Rate",
      group: "Tax & Weight",
    },
    {
      key: "tax_code",
      label: "Tax Code",
      group: "Tax & Weight",
    },
    {
      key: "taxable",
      label: "Taxable?",
      group: "Tax & Weight",
    },
    {
      key: "last_delivery_date",
      label: "Last Delivery Date",
      group: "Tax & Weight",
    },
    {
      key: "weight_lb",
      label: "Weight (lb)",
      group: "Tax & Weight",
    },

    // Fulfillment
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
    {
      key: "pickup_enabled",
      label: "Pickup Enabled",
      group: "Fulfillment",
    },

    // Stock Alerts
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

    // Quantities snapshot
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

    // Identifiers
    {
      key: "parent_sku",
      label: "Parent SKU",
      group: "Identifiers",
    },
    {
      key: "barcode",
      label: "Barcode",
      group: "Identifiers",
    },
    {
      key: "gtin",
      label: "GTIN",
      group: "Identifiers",
    },
    {
      key: "vendor_code",
      label: "Vendor Code",
      group: "Identifiers",
    },
    {
      key: "sellable",
      label: "Sellable?",
      group: "Identifiers",
    },
    {
      key: "stockable",
      label: "Stockable?",
      group: "Identifiers",
    },
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

    // Integrations / SEO
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
    {
      key: "stock_json",
      label: "Stock JSON",
      group: "Integrations / SEO",
    },
    {
      key: "quickbooks_id",
      label: "QuickBooks ID",
      group: "Integrations / SEO",
    },
    {
      key: "booker_id",
      label: "Booker ID",
      group: "Integrations / SEO",
    },
    {
      key: "seo_title",
      label: "SEO Title",
      group: "Integrations / SEO",
    },
    {
      key: "seo_description",
      label: "SEO Description",
      group: "Integrations / SEO",
    },

    // Lifecycle
    {
      key: "archived",
      label: "Archived?",
      group: "Lifecycle",
    },
    {
      key: "archive_reason",
      label: "Archive Reason",
      group: "Lifecycle",
    },
    {
      key: "archived_timestamp",
      label: "Archived Timestamp",
      group: "Lifecycle",
    },
    {
      key: "master_id",
      label: "Master ID",
      group: "Lifecycle",
    },
    {
      key: "date_added",
      label: "Date Added",
      group: "Lifecycle",
    },
    {
      key: "last_updated",
      label: "Last Updated",
      group: "Lifecycle",
    },
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

  // Group row metadata
  const groupSpans = useMemo(() => {
    const map: Record<string, number> = {};
    columns.forEach((c) => {
      map[c.group] = (map[c.group] || 0) + 1;
    });
    return map;
  }, [columns]);

  const uniqueGroups = Object.keys(groupSpans);

  // 3) outside-click to close filters
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

  // 4) processed rows: filter + sort
  const processed = useMemo(() => {
    let data = [...rows];

    // Filters
    for (const col of Object.keys(filters)) {
      const allowed = filters[col];
      if (!allowed.length) continue;
      data = data.filter((row) =>
        allowed.includes(String((row as any)[col] ?? ""))
      );
    }

    // Sort
    if (sort.col && sort.dir) {
      data.sort((a, b) => {
        const A = String((a as any)[sort.col] ?? "").toLowerCase();
        const B = String((b as any)[sort.col] ?? "").toLowerCase();
        if (A < B) return sort.dir === "asc" ? -1 : 1;
        if (A > B) return sort.dir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [rows, filters, sort]);

  // 5) Resize helpers (drag + auto-fit)
  const startResize = (colKey: string, e: ReactMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const colDef = columns.find((c) => c.key === colKey);
    const baseWidth =
      colWidths[colKey] ||
      colRefs.current[colKey]?.offsetWidth ||
      colDef?.defaultWidth ||
      160;

    const handleMove = (ev: MouseEvent) => {
      const diff = ev.clientX - startX;
      const newWidth = Math.max(80, baseWidth + diff);
      setColWidths((prev) => ({ ...prev, [colKey]: newWidth }));
    };

    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  const autoFitColumn = (colKey: string) => {
    const header = colRefs.current[colKey];
    if (!header) return;

    let maxWidth = header.scrollWidth + 28;

    processed.forEach((row) => {
      const val = String((row as any)[colKey] ?? "");
      if (!val) return;

      const span = document.createElement("span");
      span.style.visibility = "hidden";
      span.style.position = "absolute";
      span.style.fontSize = "14px";
      span.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      span.style.padding = "0 4px";
      span.textContent = val;
      document.body.appendChild(span);
      maxWidth = Math.max(maxWidth, span.offsetWidth + 24);
      document.body.removeChild(span);
    });

    setColWidths((prev) => ({
      ...prev,
      [colKey]: Math.min(maxWidth, 800),
    }));
  };

  // 6) sticky offset for status + product
  const statusWidth =
    colWidths["status"] ||
    columns.find((c) => c.key === "status")?.defaultWidth ||
    160;

  const productWidth =
    colWidths["product_name"] ||
    columns.find((c) => c.key === "product_name")?.defaultWidth ||
    260;

  const getStickyStyle = (col: ColumnDef): React.CSSProperties => {
    if (!col.sticky) return {};
    if (col.key === "status") {
      return {
        position: "sticky",
        left: 0,
        zIndex: 10,
        background: "#ffffff",
      };
    }
    if (col.key === "product_name") {
      return {
        position: "sticky",
        left: statusWidth,
        zIndex: 9,
        background: "#ffffff",
      };
    }
    return {};
  };

  // 7) loading / error
  if (loading) {
    return (
      <div className="sheet-container">
        <div className="sheet-name">Master (loading…)</div>
        <div className="empty-state">Loading Master inventory…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sheet-container">
        <div className="sheet-name">Master (error)</div>
        <div className="empty-state">Error: {error}</div>
      </div>
    );
  }

  // 8) render
  return (
    <div className="sheet-container fade-in" ref={containerRef}>
      <div className="sheet-name sheet-name-large">
        Master (Source of Truth · read-only)
      </div>

      <div className="sheet-table-wrapper wide-scroll">
        <table className="sheet-table sheet-table-master no-shorten">
          <thead>
            {/* GROUP HEADER ROW */}
            <tr className="header-group-row">
              {uniqueGroups.map((group) => (
                <th
                  key={group}
                  colSpan={groupSpans[group]}
                  className="header-group-cell"
                >
                  {group}
                </th>
              ))}
            </tr>

            {/* COLUMN HEADER ROW */}
            <tr>
              {columns.map((col) => {
                const colWidth =
                  colWidths[col.key] || col.defaultWidth || 160;

                const headerStyle: React.CSSProperties = {
                  width: colWidth,
                  minWidth: colWidth,
                  maxWidth: colWidth,
                  ...getStickyStyle(col),
                };

                const uniqueValues = Array.from(
                  new Set(
                    rows.map((r) =>
                      String((r as any)[col.key] ?? "")
                    )
                  )
                ).sort((a, b) => a.localeCompare(b));

                const isActiveFilter =
                  (filters[col.key] || []).length > 0 ||
                  (sort.col === col.key && !!sort.dir);

                return (
                  <th
                    key={col.key}
                    style={headerStyle}
                    ref={(el) => {
                      colRefs.current[col.key] = el;
                    }}
                  >
                    <div className="header-cell">
                      <span className="header-label">{col.label}</span>
                      <button
                        className={
                          "filter-button" +
                          (isActiveFilter ? " active" : "")
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenCol(
                            openCol === col.key ? null : col.key
                          );
                        }}
                      >
                        <ChevronDown size={16} />
                      </button>

                      {/* Resize handle at exact right edge */}
                      <div
                        className="col-resize-handle"
                        onMouseDown={(e) => startResize(col.key, e)}
                        onDoubleClick={() => autoFitColumn(col.key)}
                      />

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
                          sortAsc={() =>
                            setSort({ col: col.key, dir: "asc" })
                          }
                          sortDesc={() =>
                            setSort({ col: col.key, dir: "desc" })
                          }
                          clearSort={() =>
                            setSort({ col: "", dir: null })
                          }
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
            {processed.map((row) => (
              <tr
                key={row.id}
                className={`master-row row-status-${String(
                  (row as any).status || ""
                ).toLowerCase()}`}
              >
                {columns.map((col) => {
                  const colWidth =
                    colWidths[col.key] || col.defaultWidth || 160;

                  const cellStyle: React.CSSProperties = {
                    width: colWidth,
                    minWidth: colWidth,
                    maxWidth: colWidth,
                    ...getStickyStyle(col),
                  };

                  let value: any = (row as any)[col.key];

                  if (typeof value === "boolean") {
                    value = value ? "Yes" : "";
                  }

                  if (col.isImage) {
                    return (
                      <td key={col.key} style={cellStyle}>
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
                    <td key={col.key} style={cellStyle}>
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
