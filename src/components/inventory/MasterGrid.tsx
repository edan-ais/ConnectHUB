import React, { useState, useMemo } from "react";
import { useMasterInventory } from "../../hooks/useMasterInventory";
import "../../styles/app.css";

/**
 * Helper: render image thumb if present
 */
const Thumb = ({ url }: { url?: string | null }) =>
  url ? <img src={url} className="mini-image" /> : null;

/**
 * Final MasterGrid Component
 * - Supabase-backed
 * - Read-only
 * - Global Search + Per-column Search
 * - Frozen columns
 * - Column groups
 */
export const MasterGrid: React.FC = () => {
  const { rows, loading, error } = useMasterInventory();

  // -------------------------------
  // 1) Global Search (from Zustand)
  // -------------------------------
  const [globalSearch, setGlobalSearch] = useState("");

  // ----------------------------------------
  // 2) Per-column search fields (local state)
  // ----------------------------------------
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>(
    {}
  );

  const setFilter = (col: string, value: string) => {
    setColumnFilters(prev => ({ ...prev, [col]: value }));
  };

  // ----------------------------------------
  // 3) Filtered rows (global + columns)
  // ----------------------------------------
  const filteredRows = useMemo(() => {
    return rows.filter(row => {
      // GLOBAL SEARCH
      if (globalSearch) {
        const g = globalSearch.toLowerCase();
        const match =
          row.product_name?.toLowerCase().includes(g) ||
          row.sku?.toLowerCase().includes(g) ||
          row.vendor?.toLowerCase().includes(g) ||
          row.category?.toLowerCase().includes(g) ||
          (row.description || "").toLowerCase().includes(g);
        if (!match) return false;
      }

      // COLUMN FILTERS
      for (const [col, value] of Object.entries(columnFilters)) {
        if (!value) continue;
        const v = value.toLowerCase();
        const cell = (row as any)[col];
        if (!String(cell || "").toLowerCase().includes(v)) return false;
      }

      return true;
    });
  }, [rows, globalSearch, columnFilters]);

  // -------------------------------
  // Render states
  // -------------------------------
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

  // ----------------------------------------------------
  // MASTER COLUMN DEFINITIONS (for headers + filters)
  // ----------------------------------------------------
  const columns = [
    { key: "status", label: "Status", sticky: true },
    { key: "product_name", label: "Product Name", sticky: true },
    { key: "sku", label: "SKU" },
    { key: "vendor", label: "Vendor" },
    { key: "total_inventory_on_hand", label: "Total On Hand" },
    { key: "total_inventory_on_the_way", label: "Total On The Way" },
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
    { key: "inventory_asset_account", label: "Inventory Asset Account" },

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
    { key: "stock_alert_count_cc", label: "Alert CC Count" },
    { key: "stock_alert_enabled_st", label: "Alert ST" },
    { key: "stock_alert_count_st", label: "Alert ST Count" },
    { key: "stock_alert_enabled_cv", label: "Alert CV" },
    { key: "stock_alert_count_cv", label: "Alert CV Count" },

    { key: "total_quantity", label: "Total Quantity" },
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
    { key: "contains_alcohol", label: "Contains Alcohol" },
    { key: "skip_pos_detail", label: "Skip POS Detail" },

    { key: "shopify_product_id", label: "Shopify Product ID" },
    { key: "shopify_variant_id", label: "Shopify Variant ID" },
    { key: "variants_json", label: "Variants JSON" },
    { key: "square_object_id", label: "Square Object ID" },
    { key: "square_variation_id", label: "Square Variation ID" },
    { key: "stock_json", label: "Stock JSON" },
    { key: "quickbooks_id", label: "QuickBooks ID" },
    { key: "booker_id", label: "Booker ID" },
    { key: "seo_title", label: "SEO Title" },
    { key: "seo_description", label: "SEO Description" },

    { key: "archived", label: "Archived" },
    { key: "archive_reason", label: "Reason" },
    { key: "archived_timestamp", label: "Archived Timestamp" },
    { key: "master_id", label: "Master ID" },
    { key: "date_added", label: "Date Added" },
    { key: "last_updated", label: "Last Updated" },
    { key: "last_synced_square", label: "Synced Square" },
    { key: "last_synced_qb", label: "Synced QB" },
    { key: "last_synced_booker", label: "Synced Booker" }
  ];

  return (
    <div className="sheet-container fade-in">
      <div className="sheet-name">
        Master (Source of Truth · read-only)
      </div>

      {/* --------------------------- */}
      {/* GLOBAL SEARCH BAR           */}
      {/* --------------------------- */}
      <div className="global-search-bar">
        <input
          type="text"
          placeholder="Search all columns…"
          value={globalSearch}
          onChange={e => setGlobalSearch(e.target.value)}
        />
      </div>

      <div className="sheet-table-wrapper">
        <table className="sheet-table sheet-table-master">
          <thead>
            {/* Column headers */}
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={col.sticky ? "col-sticky" : ""}
                >
                  {col.label}
                </th>
              ))}
            </tr>

            {/* Column search filters */}
            <tr className="column-filter-row">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={col.sticky ? "col-sticky" : ""}
                >
                  <input
                    className="column-filter-input"
                    placeholder="Filter…"
                    value={columnFilters[col.key] || ""}
                    onChange={e => setFilter(col.key, e.target.value)}
                  />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredRows.map(row => (
              <tr key={row.id} className={`master-row status-${row.status}`}>
                {columns.map(col => {
                  const value = (row as any)[col.key];

                  // special render: images
                  if (col.key === "image_url") return <td key={col.key}><Thumb url={value} /></td>;
                  if (col.key === "variant_image_url") return <td key={col.key}><Thumb url={value} /></td>;

                  // boolean fields
                  if (typeof value === "boolean") {
                    return <td key={col.key}>{value ? "Yes" : ""}</td>;
                  }

                  // default
                  return <td key={col.key}>{String(value || "")}</td>;
                })}
              </tr>
            ))}

            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center", padding: 20 }}>
                  No products match your search.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};


