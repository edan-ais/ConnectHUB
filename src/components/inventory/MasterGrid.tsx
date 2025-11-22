import React, { useMemo, useState, useRef, useEffect } from "react";
import { useMasterInventory } from "../../hooks/useMasterInventory";
import { ChevronDown } from "lucide-react";
import "../../styles/app.css";

/**
 * -----------------------------
 * COLUMN FILTER DROPDOWN
 * -----------------------------
 */
const ColumnFilterMenu = ({
  values,
  activeValues,
  setValues,
  sortAsc,
  sortDesc,
  clearSort
}: {
  values: string[];
  activeValues: string[];
  setValues: (vals: string[]) => void;
  sortAsc: () => void;
  sortDesc: () => void;
  clearSort: () => void;
}) => {
  const [search, setSearch] = useState("");

  const filteredValues = values.filter(v =>
    v.toLowerCase().includes(search.toLowerCase())
  );

  const toggleValue = (value: string) => {
    if (activeValues.includes(value)) {
      setValues(activeValues.filter(v => v !== value));
    } else {
      setValues([...activeValues, value]);
    }
  };

  return (
    <div className="filter-menu">
      <div className="filter-section">
        <button onClick={sortAsc}>Sort A → Z</button>
        <button onClick={sortDesc}>Sort Z → A</button>
        <button onClick={clearSort}>Clear Sort</button>
      </div>

      <div className="filter-divider" />

      <input
        className="filter-search-input"
        placeholder="Search values…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="filter-value-list">
        {filteredValues.map(v => (
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
    </div>
  );
};

/**
 * -----------------------------
 * MASTER GRID
 * -----------------------------
 */
export const MasterGrid: React.FC = () => {
  const { rows, loading, error } = useMasterInventory();

  const [sort, setSort] = useState<{ col: string; dir: "asc" | "desc" | null }>({
    col: "",
    dir: null
  });

  // Column filters: { colName: [allowedValues] }
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  // Which column menu is open
  const [openCol, setOpenCol] = useState<string | null>(null);

  // Column widths
  const [colWidths, setColWidths] = useState<Record<string, number>>({});

  // Column refs for auto-resize
  const colRefs = useRef<Record<string, HTMLTableCellElement | null>>({});

  if (loading) {
    return (
      <div className="sheet-container">
        <div className="sheet-name">Master (loading…)</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sheet-container">
        <div className="sheet-name">Master (error)</div>
        {error}
      </div>
    );
  }

  /**
   * -----------------------------
   * DEFINE COLUMNS
   * -----------------------------
   * (All columns get filters)
   */
  const columns = [
    { key: "status", label: "Status", sticky: true },
    { key: "product_name", label: "Product Name", sticky: true },
    { key: "sku", label: "SKU" },
    { key: "vendor", label: "Vendor" },

    { key: "total_inventory_on_hand", label: "Total On Hand" },
    { key: "total_inventory_on_the_way", label: "On The Way" },
    { key: "incoming_total", label: "Incoming Total" },

    { key: "qty_coastal_cowgirl", label: "Qty CC" },
    { key: "qty_salty_tails", label: "Qty ST" },
    { key: "qty_central_valley", label: "Qty CV" },

    { key: "new_qty_coastal_cowgirl", label: "New Qty CC" },
    { key: "new_qty_salty_tails", label: "New Qty ST" },
    { key: "new_qty_central_valley", label: "New Qty CV" },

    { key: "reorder_point", label: "Reorder Point" },

    { key: "product_type", label: "Product Type" },
    { key: "product_category", label: "Product Category" },
    { key: "category", label: "Category" },
    { key: "reporting_category", label: "Reporting Category" },
    { key: "description", label: "Description" },
    { key: "sales_description", label: "Sales Description" },
    { key: "purchase_description", label: "Purchase Description" },
    { key: "tags", label: "Tags" },

    { key: "single_parent_or_variant", label: "Parent/Variant" },
    { key: "variant_name", label: "Variant Name" },
    { key: "variant_title", label: "Variant Title" },

    { key: "option1_name", label: "Option1 Name" },
    { key: "option1_value", label: "Option1 Value" },
    { key: "option2_name", label: "Option2 Name" },
    { key: "option2_value", label: "Option2 Value" },
    { key: "option3_name", label: "Option3 Name" },
    { key: "option3_value", label: "Option3 Value" },
    { key: "option4_name", label: "Option4 Name" },
    { key: "option4_value", label: "Option4 Value" },

    { key: "handle", label: "Handle" },
    { key: "permalink", label: "Permalink" },

    { key: "image_url", label: "Image" },
    { key: "variant_image_url", label: "Variant Image" },

    { key: "square_image_id", label: "Square Image ID" },

    { key: "price", label: "Price" },
    { key: "online_price", label: "Online Price" },
    { key: "cost", label: "Cost" },
    { key: "compare_at", label: "Compare At" },
    { key: "default_unit_cost", label: "Default Unit Cost" },
    { key: "income_account", label: "Income Account" },
    { key: "expense_account", label: "Expense Account" },
    { key: "inventory_asset_account", label: "Asset Account" },

    { key: "sales_tax_rate", label: "Tax Rate" },
    { key: "tax_code", label: "Tax Code" },
    { key: "taxable", label: "Taxable" },

    { key: "last_delivery_date", label: "Last Delivery" },
    { key: "weight_lb", label: "Weight (lb)" },

    { key: "shipping_enabled", label: "Shipping" },
    { key: "self_serve_ordering_enabled", label: "Self-Serve" },
    { key: "delivery_enabled", label: "Delivery" },
    { key: "pickup_enabled", label: "Pickup" },

    { key: "stock_alert_enabled_cc", label: "Alert CC" },
    { key: "stock_alert_count_cc", label: "Alert CC #" },
    { key: "stock_alert_enabled_st", label: "Alert ST" },
    { key: "stock_alert_count_st", label: "Alert ST #" },
    { key: "stock_alert_enabled_cv", label: "Alert CV" },
    { key: "stock_alert_count_cv", label: "Alert CV #" },

    { key: "total_quantity", label: "Total Qty" },
    { key: "current_qty_cc", label: "Current CC" },
    { key: "current_qty_st", label: "Current ST" },
    { key: "current_qty_cv", label: "Current CV" },
    { key: "quantity_as_of_date", label: "As Of" },

    { key: "parent_sku", label: "Parent SKU" },
    { key: "barcode", label: "Barcode" },
    { key: "gtin", label: "GTIN" },
    { key: "vendor_code", label: "Vendor Code" },
    { key: "sellable", label: "Sellable" },
    { key: "stockable", label: "Stockable" },
    { key: "contains_alcohol", label: "Alcohol?" },
    { key: "skip_pos_detail", label: "Skip POS" },

    { key: "shopify_product_id", label: "Shopify Prod ID" },
    { key: "shopify_variant_id", label: "Shopify Var ID" },
    { key: "variants_json", label: "Variants JSON" },
    { key: "square_object_id", label: "Square Obj ID" },
    { key: "square_variation_id", label: "Square Var ID" },
    { key: "stock_json", label: "Stock JSON" },
    { key: "quickbooks_id", label: "QuickBooks ID" },
    { key: "booker_id", label: "Booker ID" },
    { key: "seo_title", label: "SEO Title" },
    { key: "seo_description", label: "SEO Desc" },

    { key: "archived", label: "Archived" },
    { key: "archive_reason", label: "Archive Reason" },
    { key: "archived_timestamp", label: "Archived TS" },
    { key: "master_id", label: "Master ID" },
    { key: "date_added", label: "Date Added" },
    { key: "last_updated", label: "Last Updated" },
    { key: "last_synced_square", label: "Synced Square" },
    { key: "last_synced_qb", label: "Synced QB" },
    { key: "last_synced_booker", label: "Synced Booker" }
  ];

  /**
   * -----------------------------
   * PROCESS ROWS: FILTER + SORT
   * -----------------------------
   */
  const processed = useMemo(() => {
    let data = [...rows];

    // FILTERING
    for (const col of Object.keys(filters)) {
      const allowed = filters[col];
      if (!allowed.length) continue;
      data = data.filter(r =>
        allowed.includes(String((r as any)[col] ?? ""))
      );
    }

    // SORT
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

  /**
   * ----------------------------------------
   * COLUMN RESIZE (drag + double-click)
   * ----------------------------------------
   */
  const startResize = (colKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startWidth = colWidths[colKey] || colRefs.current[colKey]?.offsetWidth || 120;

    const handleMouseMove = (ev: MouseEvent) => {
      const diff = ev.clientX - startX;
      const newWidth = Math.max(60, startWidth + diff);
      setColWidths(w => ({ ...w, [colKey]: newWidth }));
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const autoFitColumn = (colKey: string) => {
    // header width
    const header = colRefs.current[colKey];
    if (!header) return;

    let maxWidth = header.scrollWidth + 30;

    // scan rows
    for (const row of processed) {
      const value = String((row as any)[colKey] ?? "");
      const span = document.createElement("span");
      span.style.visibility = "hidden";
      span.style.position = "absolute";
      span.style.fontSize = "14px";
      span.style.padding = "4px 6px";
      span.innerText = value;
      document.body.appendChild(span);
      maxWidth = Math.max(maxWidth, span.offsetWidth + 20);
      document.body.removeChild(span);
    }

    setColWidths(w => ({ ...w, [colKey]: Math.min(maxWidth, 800) }));
  };

  /**
   * -----------------------------
   * RENDER
   * -----------------------------
   */
  return (
    <div className="sheet-container fade-in">
      <div className="sheet-name">Master (Source of Truth · read-only)</div>

      <div className="sheet-table-wrapper wide-scroll">
        <table className="sheet-table no-shorten">
          <thead>
            <tr>
              {columns.map(col => {
                const width = colWidths[col.key] || "auto";

                return (
                  <th
                    key={col.key}
                    ref={el => (colRefs.current[col.key] = el)}
                    className={col.sticky ? "col-sticky" : ""}
                    style={{ width }}
                  >
                    <div className="header-cell">
                      <span>{col.label}</span>

                      <button
                        className="filter-button"
                        onClick={e => {
                          e.stopPropagation();
                          setOpenCol(openCol === col.key ? null : col.key);
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

                      {openCol === col.key && (
                        <ColumnFilterMenu
                          values={[
                            ...new Set(
                              rows.map(r =>
                                String((r as any)[col.key] ?? "")
                              )
                            )
                          ]}
                          activeValues={filters[col.key] || []}
                          setValues={vals =>
                            setFilters(prev => ({ ...prev, [col.key]: vals }))
                          }
                          sortAsc={() => {
                            setSort({ col: col.key, dir: "asc" });
                            setOpenCol(null);
                          }}
                          sortDesc={() => {
                            setSort({ col: col.key, dir: "desc" });
                            setOpenCol(null);
                          }}
                          clearSort={() => {
                            setSort({ col: "", dir: null });
                            setOpenCol(null);
                          }}
                        />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {processed.map(row => (
              <tr key={row.id}>
                {columns.map(col => {
                  let value = (row as any)[col.key];
                  const sticky = col.sticky ? "col-sticky" : "";

                  if (typeof value === "boolean") {
                    value = value ? "Yes" : "";
                  }

                  if (col.key === "image_url" || col.key === "variant_image_url") {
                    return (
                      <td key={col.key} className={sticky}>
                        {value ? (
                          <img src={value} alt="" className="mini-image" />
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  }

                  return (
                    <td key={col.key} className={sticky}>
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
