import React, { useState, useMemo } from "react";
import { useMasterInventory } from "../../hooks/useMasterInventory";
import { ChevronDown } from "lucide-react";
import "../../styles/app.css";

// Dropdown filter for each column
interface ColumnFilterMenuProps {
  columnKey: string;
  values: string[];
  activeValues: string[];
  onChange: (vals: string[]) => void;
  onSortAsc: () => void;
  onSortDesc: () => void;
  clearSort: () => void;
}
const ColumnFilterMenu: React.FC<ColumnFilterMenuProps> = ({
  columnKey,
  values,
  activeValues,
  onChange,
  onSortAsc,
  onSortDesc,
  clearSort
}) => {
  const [search, setSearch] = useState("");

  const filteredValues = values.filter(v =>
    v.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (val: string) => {
    if (activeValues.includes(val)) {
      onChange(activeValues.filter(v => v !== val));
    } else {
      onChange([...activeValues, val]);
    }
  };

  return (
    <div className="filter-menu">
      <div className="filter-section">
        <button onClick={onSortAsc}>Sort A → Z</button>
        <button onClick={onSortDesc}>Sort Z → A</button>
        <button onClick={clearSort}>Clear Sort</button>
      </div>

      <div className="filter-divider" />

      <div className="filter-section">
        <input
          type="text"
          placeholder="Search values…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="filter-search-input"
        />

        <div className="filter-value-list">
          {filteredValues.map(val => (
            <label key={val} className="filter-checkbox-row">
              <input
                type="checkbox"
                checked={activeValues.includes(val)}
                onChange={() => toggle(val)}
              />
              {val || "(blank)"}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export const MasterGrid: React.FC = () => {
  const { rows, loading, error } = useMasterInventory();

  // Global search bar is in TopBar, pulled from Zustand
  const [sortBy, setSortBy] = useState<{ col: string; dir: "asc" | "desc" | null }>({
    col: "",
    dir: null
  });

  // Active value filters per column
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});

  // Which column dropdown is currently open
  const [openFilter, setOpenFilter] = useState<string | null>(null);

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

  // --------------------------
  // COLUMN DEFINITIONS
  // --------------------------
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

    // Pricing, Accounts, Fulfillment, Identifiers, Integrations, Lifecycle...
    // (Rest of columns are unchanged; same as previous version)
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

  // -------------------------
  // FILTER + SORT ENGINE
  // -------------------------
  const processedRows = useMemo(() => {
    let output = [...rows];

    // FILTERS (checkbox unique values)
    for (const key of Object.keys(filters)) {
      const allowed = filters[key];
      if (allowed.length === 0) continue;

      output = output.filter(row => {
        const v = String((row as any)[key] ?? "");
        return allowed.includes(v);
      });
    }

    // SORT
    if (sortBy.dir) {
      output.sort((a, b) => {
        const A = String((a as any)[sortBy.col] ?? "").toLowerCase();
        const B = String((b as any)[sortBy.col] ?? "").toLowerCase();
        if (A < B) return sortBy.dir === "asc" ? -1 : 1;
        if (A > B) return sortBy.dir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return output;
  }, [rows, filters, sortBy]);

  // -----------------------------------
  // Render table
  // -----------------------------------
  return (
    <div className="sheet-container fade-in">
      <div className="sheet-name">Master (Source of Truth · read-only)</div>

      <div className="sheet-table-wrapper wide-scroll">
        <table className="sheet-table sheet-table-master no-shorten">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} className={col.sticky ? "col-sticky" : ""}>
                  <div className="header-cell">
                    <span>{col.label}</span>
                    <button
                      className="filter-button"
                      onClick={() =>
                        setOpenFilter(openFilter === col.key ? null : col.key)
                      }
                    >
                      <ChevronDown size={14} />
                    </button>

                    {openFilter === col.key && (
                      <ColumnFilterMenu
                        columnKey={col.key}
                        values={[
                          ...new Set(
                            rows.map(r => String((r as any)[col.key] ?? ""))
                          )
                        ]}
                        activeValues={filters[col.key] || []}
                        onChange={vals =>
                          setFilters(prev => ({ ...prev, [col.key]: vals }))
                        }
                        onSortAsc={() => {
                          setSortBy({ col: col.key, dir: "asc" });
                          setOpenFilter(null);
                        }}
                        onSortDesc={() => {
                          setSortBy({ col: col.key, dir: "desc" });
                          setOpenFilter(null);
                        }}
                        clearSort={() => {
                          setSortBy({ col: "", dir: null });
                          setOpenFilter(null);
                        }}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {processedRows.map(row => (
              <tr key={row.id} className={`master-row row-${row.status}`}>
                {columns.map(col => {
                  const v = (row as any)[col.key];
                  const stickyClass = col.sticky ? "col-sticky" : "";

                  if (col.key === "image_url" || col.key === "variant_image_url") {
                    return (
                      <td key={col.key} className={stickyClass}>
                        {v ? <img src={v} className="mini-image" /> : ""}
                      </td>
                    );
                  }

                  if (typeof v === "boolean") {
                    return (
                      <td key={col.key} className={stickyClass}>
                        {v ? "Yes" : ""}
                      </td>
                    );
                  }

                  return (
                    <td key={col.key} className={stickyClass}>
                      {String(v ?? "")}
                    </td>
                  );
                })}
              </tr>
            ))}

            {processedRows.length === 0 && (
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
