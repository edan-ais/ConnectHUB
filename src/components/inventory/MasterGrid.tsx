import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useMasterInventory } from "../../hooks/useMasterInventory";
import { ChevronDown } from "lucide-react";
import "../../styles/app.css";

/* ================================
   COLUMN FILTER DROPDOWN (no search)
   ================================ */
interface FilterMenuProps {
  values: string[];
  activeValues: string[];
  setValues: (vals: string[]) => void;
  sortAsc: () => void;
  sortDesc: () => void;
  clearSort: () => void;
  onClose: () => void;
}

const ColumnFilterMenu: React.FC<FilterMenuProps> = ({
  values,
  activeValues,
  setValues,
  sortAsc,
  sortDesc,
  clearSort,
  onClose
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const toggleValue = (value: string) => {
    if (activeValues.includes(value)) {
      setValues(activeValues.filter(v => v !== value));
    } else {
      setValues([...activeValues, value]);
    }
  };

  const selectAll = () => setValues([...values]);
  const clearAll = () => setValues([]);

  return (
    <div className="filter-menu" ref={menuRef} onClick={e => e.stopPropagation()}>
      <div className="filter-section">
        <button onClick={() => { sortAsc(); onClose(); }}>Sort A → Z</button>
        <button onClick={() => { sortDesc(); onClose(); }}>Sort Z → A</button>
        <button onClick={() => { clearSort(); onClose(); }}>Clear Sort</button>
      </div>

      <div className="filter-divider" />

      <div className="filter-value-list">
        {values.map(v => (
          <label key={v} className="filter-checkbox-row">
            <input
              type="checkbox"
              checked={activeValues.includes(v)}
              onChange={() => toggleValue(v)}
            />
            {v || "(blank)"}
          </label>
        ))}
      </div>

      <div className="filter-actions">
        <button className="filter-action-btn" onClick={selectAll}>Select All</button>
        <button className="filter-action-btn" onClick={clearAll}>Clear</button>
      </div>
    </div>
  );
};

/* ================================
   COLUMN DEFINITIONS WITH SECTIONS
   ================================ */
interface ColumnDef {
  key: string;
  label: string;
  section: string;
  width: number;
  sticky?: boolean;
}

const SECTIONS = [
  { id: "core", label: "Core", className: "section-core" },
  { id: "inventory", label: "Inventory", className: "section-inventory" },
  { id: "product-info", label: "Product Info", className: "section-product-info" },
  { id: "variants", label: "Variants", className: "section-variants" },
  { id: "options", label: "Options", className: "section-options" },
  { id: "pricing", label: "Pricing", className: "section-pricing" },
  { id: "tax", label: "Tax", className: "section-tax" },
  { id: "shipping", label: "Shipping & Fulfillment", className: "section-shipping" },
  { id: "alerts", label: "Stock Alerts", className: "section-alerts" },
  { id: "quantities", label: "Quantities", className: "section-quantities" },
  { id: "identifiers", label: "Identifiers", className: "section-identifiers" },
  { id: "shopify", label: "Shopify", className: "section-shopify" },
  { id: "square", label: "Square", className: "section-square" },
  { id: "quickbooks", label: "QuickBooks", className: "section-quickbooks" },
  { id: "seo", label: "SEO", className: "section-seo" },
  { id: "archive", label: "Archive", className: "section-archive" },
  { id: "timestamps", label: "Timestamps", className: "section-timestamps" },
];

const COLUMNS: ColumnDef[] = [
  // Core
  { key: "status", label: "Status", section: "core", width: 100, sticky: true },
  { key: "product_name", label: "Product Name", section: "core", width: 200, sticky: true },
  { key: "sku", label: "SKU", section: "core", width: 120 },
  { key: "vendor", label: "Vendor", section: "core", width: 120 },

  // Inventory
  { key: "total_inventory_on_hand", label: "Total On Hand", section: "inventory", width: 100 },
  { key: "total_inventory_on_the_way", label: "On The Way", section: "inventory", width: 100 },
  { key: "incoming_total", label: "Incoming Total", section: "inventory", width: 100 },
  { key: "qty_coastal_cowgirl", label: "Qty CC", section: "inventory", width: 80 },
  { key: "qty_salty_tails", label: "Qty ST", section: "inventory", width: 80 },
  { key: "qty_central_valley", label: "Qty CV", section: "inventory", width: 80 },
  { key: "new_qty_coastal_cowgirl", label: "New Qty CC", section: "inventory", width: 90 },
  { key: "new_qty_salty_tails", label: "New Qty ST", section: "inventory", width: 90 },
  { key: "new_qty_central_valley", label: "New Qty CV", section: "inventory", width: 90 },
  { key: "reorder_point", label: "Reorder Point", section: "inventory", width: 100 },

  // Product Info
  { key: "product_type", label: "Product Type", section: "product-info", width: 120 },
  { key: "product_category", label: "Product Category", section: "product-info", width: 130 },
  { key: "category", label: "Category", section: "product-info", width: 120 },
  { key: "reporting_category", label: "Reporting Category", section: "product-info", width: 140 },
  { key: "description", label: "Description", section: "product-info", width: 200 },
  { key: "sales_description", label: "Sales Description", section: "product-info", width: 180 },
  { key: "purchase_description", label: "Purchase Description", section: "product-info", width: 180 },
  { key: "tags", label: "Tags", section: "product-info", width: 150 },
  { key: "image_url", label: "Image", section: "product-info", width: 60 },
  { key: "variant_image_url", label: "Variant Image", section: "product-info", width: 80 },

  // Variants
  { key: "single_parent_or_variant", label: "Parent/Variant", section: "variants", width: 110 },
  { key: "variant_name", label: "Variant Name", section: "variants", width: 130 },
  { key: "variant_title", label: "Variant Title", section: "variants", width: 130 },
  { key: "handle", label: "Handle", section: "variants", width: 130 },
  { key: "permalink", label: "Permalink", section: "variants", width: 150 },

  // Options
  { key: "option1_name", label: "Option1 Name", section: "options", width: 100 },
  { key: "option1_value", label: "Option1 Value", section: "options", width: 100 },
  { key: "option2_name", label: "Option2 Name", section: "options", width: 100 },
  { key: "option2_value", label: "Option2 Value", section: "options", width: 100 },
  { key: "option3_name", label: "Option3 Name", section: "options", width: 100 },
  { key: "option3_value", label: "Option3 Value", section: "options", width: 100 },
  { key: "option4_name", label: "Option4 Name", section: "options", width: 100 },
  { key: "option4_value", label: "Option4 Value", section: "options", width: 100 },

  // Pricing
  { key: "price", label: "Price", section: "pricing", width: 80 },
  { key: "online_price", label: "Online Price", section: "pricing", width: 100 },
  { key: "cost", label: "Cost", section: "pricing", width: 80 },
  { key: "compare_at", label: "Compare At", section: "pricing", width: 100 },
  { key: "default_unit_cost", label: "Default Unit Cost", section: "pricing", width: 120 },
  { key: "income_account", label: "Income Account", section: "pricing", width: 130 },
  { key: "expense_account", label: "Expense Account", section: "pricing", width: 130 },
  { key: "inventory_asset_account", label: "Asset Account", section: "pricing", width: 130 },

  // Tax
  { key: "sales_tax_rate", label: "Tax Rate", section: "tax", width: 90 },
  { key: "tax_code", label: "Tax Code", section: "tax", width: 90 },
  { key: "taxable", label: "Taxable", section: "tax", width: 80 },

  // Shipping
  { key: "last_delivery_date", label: "Last Delivery", section: "shipping", width: 110 },
  { key: "weight_lb", label: "Weight (lb)", section: "shipping", width: 90 },
  { key: "shipping_enabled", label: "Shipping", section: "shipping", width: 80 },
  { key: "self_serve_ordering_enabled", label: "Self-Serve", section: "shipping", width: 90 },
  { key: "delivery_enabled", label: "Delivery", section: "shipping", width: 80 },
  { key: "pickup_enabled", label: "Pickup", section: "shipping", width: 80 },

  // Alerts
  { key: "stock_alert_enabled_cc", label: "Alert CC", section: "alerts", width: 80 },
  { key: "stock_alert_count_cc", label: "Alert CC #", section: "alerts", width: 90 },
  { key: "stock_alert_enabled_st", label: "Alert ST", section: "alerts", width: 80 },
  { key: "stock_alert_count_st", label: "Alert ST #", section: "alerts", width: 90 },
  { key: "stock_alert_enabled_cv", label: "Alert CV", section: "alerts", width: 80 },
  { key: "stock_alert_count_cv", label: "Alert CV #", section: "alerts", width: 90 },

  // Quantities
  { key: "total_quantity", label: "Total Qty", section: "quantities", width: 90 },
  { key: "current_qty_cc", label: "Current CC", section: "quantities", width: 100 },
  { key: "current_qty_st", label: "Current ST", section: "quantities", width: 100 },
  { key: "current_qty_cv", label: "Current CV", section: "quantities", width: 100 },
  { key: "quantity_as_of_date", label: "As Of", section: "quantities", width: 100 },

  // Identifiers
  { key: "parent_sku", label: "Parent SKU", section: "identifiers", width: 110 },
  { key: "barcode", label: "Barcode", section: "identifiers", width: 120 },
  { key: "gtin", label: "GTIN", section: "identifiers", width: 120 },
  { key: "vendor_code", label: "Vendor Code", section: "identifiers", width: 110 },
  { key: "sellable", label: "Sellable", section: "identifiers", width: 80 },
  { key: "stockable", label: "Stockable", section: "identifiers", width: 80 },
  { key: "contains_alcohol", label: "Alcohol?", section: "identifiers", width: 80 },
  { key: "skip_pos_detail", label: "Skip POS", section: "identifiers", width: 80 },

  // Shopify
  { key: "shopify_product_id", label: "Shopify Prod ID", section: "shopify", width: 130 },
  { key: "shopify_variant_id", label: "Shopify Var ID", section: "shopify", width: 130 },
  { key: "variants_json", label: "Variants JSON", section: "shopify", width: 120 },

  // Square
  { key: "square_object_id", label: "Square Obj ID", section: "square", width: 130 },
  { key: "square_variation_id", label: "Square Var ID", section: "square", width: 130 },
  { key: "square_image_id", label: "Square Image ID", section: "square", width: 130 },
  { key: "stock_json", label: "Stock JSON", section: "square", width: 120 },

  // QuickBooks
  { key: "quickbooks_id", label: "QuickBooks ID", section: "quickbooks", width: 130 },
  { key: "booker_id", label: "Booker ID", section: "quickbooks", width: 120 },

  // SEO
  { key: "seo_title", label: "SEO Title", section: "seo", width: 150 },
  { key: "seo_description", label: "SEO Desc", section: "seo", width: 180 },

  // Archive
  { key: "archived", label: "Archived", section: "archive", width: 80 },
  { key: "archive_reason", label: "Archive Reason", section: "archive", width: 130 },
  { key: "archived_timestamp", label: "Archived TS", section: "archive", width: 130 },

  // Timestamps
  { key: "master_id", label: "Master ID", section: "timestamps", width: 100 },
  { key: "date_added", label: "Date Added", section: "timestamps", width: 110 },
  { key: "last_updated", label: "Last Updated", section: "timestamps", width: 130 },
  { key: "last_synced_square", label: "Synced Square", section: "timestamps", width: 130 },
  { key: "last_synced_qb", label: "Synced QB", section: "timestamps", width: 130 },
  { key: "last_synced_booker", label: "Synced Booker", section: "timestamps", width: 130 },
];

/* ================================
   MASTER GRID COMPONENT
   ================================ */
export const MasterGrid: React.FC = () => {
  const { rows, loading, error } = useMasterInventory();

  // Sort state
  const [sort, setSort] = useState<{ col: string; dir: "asc" | "desc" | null }>({
    col: "",
    dir: null
  });

  // Filter state: { colKey: [allowedValues] }
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  // Which column's filter menu is open
  const [openCol, setOpenCol] = useState<string | null>(null);

  // Column widths (for resizing)
  const [colWidths, setColWidths] = useState<Record<string, number>>({});

  // Refs for header cells (for auto-fit)
  const colRefs = useRef<Record<string, HTMLTableCellElement | null>>({});
  const tableRef = useRef<HTMLTableElement | null>(null);

  // Build section header spans
  const sectionSpans = useMemo(() => {
    const spans: { id: string; label: string; className: string; colSpan: number }[] = [];
    let currentSection = "";
    let currentSpan = 0;

    COLUMNS.forEach((col, idx) => {
      if (col.section !== currentSection) {
        if (currentSection !== "") {
          const sectionInfo = SECTIONS.find(s => s.id === currentSection);
          spans.push({
            id: currentSection,
            label: sectionInfo?.label || currentSection,
            className: sectionInfo?.className || "",
            colSpan: currentSpan
          });
        }
        currentSection = col.section;
        currentSpan = 1;
      } else {
        currentSpan++;
      }

      // Last column
      if (idx === COLUMNS.length - 1) {
        const sectionInfo = SECTIONS.find(s => s.id === currentSection);
        spans.push({
          id: currentSection,
          label: sectionInfo?.label || currentSection,
          className: sectionInfo?.className || "",
          colSpan: currentSpan
        });
      }
    });

    return spans;
  }, []);

  // Process rows: filter + sort
  const processed = useMemo(() => {
    let data = [...rows];

    // Apply filters
    for (const col of Object.keys(filters)) {
      const allowed = filters[col];
      if (!allowed || allowed.length === 0) continue;
      data = data.filter(r => allowed.includes(String((r as any)[col] ?? "")));
    }

    // Apply sort
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

  // Get unique values for a column
  const getUniqueValues = useCallback((colKey: string): string[] => {
    const vals = rows.map(r => String((r as any)[colKey] ?? ""));
    return [...new Set(vals)].sort();
  }, [rows]);

  // Column resize: drag handler
  const startResize = useCallback((colKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const currentWidth = colWidths[colKey] || colRefs.current[colKey]?.offsetWidth || 120;

    const onMouseMove = (ev: MouseEvent) => {
      const diff = ev.clientX - startX;
      const newWidth = Math.max(50, currentWidth + diff);
      setColWidths(prev => ({ ...prev, [colKey]: newWidth }));
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [colWidths]);

  // Column resize: double-click to auto-fit
  const autoFitColumn = useCallback((colKey: string) => {
    const headerCell = colRefs.current[colKey];
    if (!headerCell) return;

    // Start with header text width
    let maxWidth = 60;

    // Measure header label
    const headerLabel = COLUMNS.find(c => c.key === colKey)?.label || colKey;
    const measureSpan = document.createElement("span");
    measureSpan.style.visibility = "hidden";
    measureSpan.style.position = "absolute";
    measureSpan.style.whiteSpace = "nowrap";
    measureSpan.style.fontSize = "12px";
    measureSpan.style.fontWeight = "600";
    measureSpan.style.padding = "0 30px 0 6px"; // Account for filter button + resize handle
    measureSpan.innerText = headerLabel;
    document.body.appendChild(measureSpan);
    maxWidth = Math.max(maxWidth, measureSpan.offsetWidth);
    document.body.removeChild(measureSpan);

    // Measure each cell value
    for (const row of processed) {
      let value = (row as any)[colKey];
      if (value === null || value === undefined) value = "";
      if (typeof value === "boolean") value = value ? "Yes" : "";

      const cellSpan = document.createElement("span");
      cellSpan.style.visibility = "hidden";
      cellSpan.style.position = "absolute";
      cellSpan.style.whiteSpace = "nowrap";
      cellSpan.style.fontSize = "12px";
      cellSpan.style.padding = "0 6px";
      cellSpan.innerText = String(value);
      document.body.appendChild(cellSpan);
      maxWidth = Math.max(maxWidth, cellSpan.offsetWidth + 12);
      document.body.removeChild(cellSpan);
    }

    // Cap at reasonable max
    maxWidth = Math.min(maxWidth, 600);

    setColWidths(prev => ({ ...prev, [colKey]: maxWidth }));
  }, [processed]);

  // Close filter menu handler
  const closeFilterMenu = useCallback(() => {
    setOpenCol(null);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="sheet-container">
        <div className="sheet-name">Master (loading…)</div>
        <div className="empty-state">Loading inventory data...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="sheet-container">
        <div className="sheet-name">Master (error)</div>
        <div className="empty-state" style={{ color: "#b91c1c" }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="sheet-container fade-in">
      <div className="sheet-name">Master (Source of Truth · read-only)</div>

      <div className="sheet-table-wrapper">
        <table className="sheet-table" ref={tableRef}>
          <thead>
            {/* Section header row */}
            <tr className="section-header-row">
              {sectionSpans.map(section => (
                <th
                  key={section.id}
                  colSpan={section.colSpan}
                  className={section.className}
                >
                  {section.label}
                </th>
              ))}
            </tr>

            {/* Column header row */}
            <tr>
              {COLUMNS.map((col, idx) => {
                const width = colWidths[col.key] || col.width;
                const isOpen = openCol === col.key;
                const hasActiveFilter = (filters[col.key] || []).length > 0;

                let stickyClass = "";
                if (col.sticky) {
                  stickyClass = idx === 0 ? "col-sticky-1" : "col-sticky-2";
                }

                return (
                  <th
                    key={col.key}
                    ref={el => (colRefs.current[col.key] = el)}
                    className={stickyClass}
                    style={{ width, minWidth: width, maxWidth: width }}
                  >
                    <div className="header-cell">
                      <span>{col.label}</span>

                      <button
                        className={`filter-button ${hasActiveFilter ? "active" : ""}`}
                        onClick={e => {
                          e.stopPropagation();
                          setOpenCol(isOpen ? null : col.key);
                        }}
                      >
                        <ChevronDown size={14} />
                      </button>

                      {/* Resize handle */}
                      <div
                        className="col-resize-handle"
                        onMouseDown={e => startResize(col.key, e)}
                        onDoubleClick={() => autoFitColumn(col.key)}
                      />

                      {/* Filter dropdown */}
                      {isOpen && (
                        <ColumnFilterMenu
                          values={getUniqueValues(col.key)}
                          activeValues={filters[col.key] || []}
                          setValues={vals =>
                            setFilters(prev => ({ ...prev, [col.key]: vals }))
                          }
                          sortAsc={() => setSort({ col: col.key, dir: "asc" })}
                          sortDesc={() => setSort({ col: col.key, dir: "desc" })}
                          clearSort={() => setSort({ col: "", dir: null })}
                          onClose={closeFilterMenu}
                        />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {processed.map(row => {
              const status = String((row as any).status ?? "").toLowerCase();
              let rowClass = "row-status-default";
              if (status === "approved" || status === "active") rowClass = "row-status-approved";
              else if (status === "pending") rowClass = "row-status-pending";
              else if (status === "missing" || status === "error") rowClass = "row-status-missing";

              return (
                <tr key={row.id} className={rowClass}>
                  {COLUMNS.map((col, idx) => {
                    let value = (row as any)[col.key];
                    let stickyClass = "";
                    if (col.sticky) {
                      stickyClass = idx === 0 ? "col-sticky-1" : "col-sticky-2";
                    }

                    // Format booleans
                    if (typeof value === "boolean") {
                      value = value ? "Yes" : "";
                    }

                    // Render images
                    if (col.key === "image_url" || col.key === "variant_image_url") {
                      return (
                        <td key={col.key} className={stickyClass}>
                          {value ? (
                            <img src={value} alt="" className="mini-image" />
                          ) : (
                            ""
                          )}
                        </td>
                      );
                    }

                    return (
                      <td key={col.key} className={stickyClass}>
                        {String(value ?? "")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {processed.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="empty-state">
                  No products match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
