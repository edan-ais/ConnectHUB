import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Search,
  RefreshCw,
  Package,
  FileText,
  ClipboardList,
  BarChart3,
  Plus,
  ChevronDown,
  Filter,
  Check,
  AlertTriangle,
  X,
} from "lucide-react";
import { useMasterInventory } from "../../hooks/useMasterInventory";
import "../../styles/app.css";

type Row = {
  id: string | number;
  status?: string;
  product_name?: string;
  sku?: string;
  [key: string]: any;
};

type SortState = {
  column: string | null;
  direction: "asc" | "desc" | null;
};

type FilterMap = Record<string, string[]>;

type ColumnDef = {
  key: string;
  label: string;
  sticky?: boolean;
};

/**
 * MASTER GRID COLUMN DEFINITIONS
 */
const MASTER_COLUMNS: ColumnDef[] = [
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
  { key: "last_synced_booker", label: "Synced Booker" },
];

/**
 * SMALLER COLUMN SET FOR VALIDATION TABLE
 */
const VALIDATION_COLUMNS: ColumnDef[] = [
  { key: "sku", label: "SKU" },
  { key: "product_name", label: "Name" },
  { key: "product_category", label: "Category" },
  { key: "image_url", label: "Image" },
  { key: "description", label: "Description" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
];

/**
 * FILTER POPOVER USED BY BOTH MASTER + VALIDATION
 */
type FilterPopoverProps = {
  values: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  onClose: () => void;
};

const FilterPopover: React.FC<FilterPopoverProps> = ({
  values,
  selected,
  onChange,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (evt: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(evt.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [onClose]);

  const filtered = useMemo(
    () =>
      values.filter((v) =>
        v.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [values, query]
  );

  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((x) => x !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const selectAll = () => {
    onChange(values);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div
      ref={rootRef}
      className="filter-menu"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        className="filter-search-input"
        placeholder="Search values…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="filter-actions" style={{ marginTop: 4 }}>
        <button className="filter-action-btn" onClick={selectAll}>
          All
        </button>
        <button className="filter-action-btn" onClick={clearAll}>
          Clear
        </button>
      </div>
      <div className="filter-value-list">
        {filtered.map((val) => (
          <label key={val || "(blank)"} className="filter-checkbox-row">
            <input
              type="checkbox"
              checked={selected.includes(val)}
              onChange={() => toggle(val)}
            />
            <span>{val || "(blank)"}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

/**
 * MASTER SHEET VIEW (READ-ONLY GRID)
 */
type MasterSheetProps = {
  rows: Row[];
  globalSearch: string;
};

const MasterSheet: React.FC<MasterSheetProps> = ({ rows, globalSearch }) => {
  const [sort, setSort] = useState<SortState>({
    column: null,
    direction: null,
  });
  const [filters, setFilters] = useState<FilterMap>({});
  const [openFilterKey, setOpenFilterKey] = useState<string | null>(null);
  const [widths, setWidths] = useState<Record<string, number>>({});
  const headerRefs = useRef<Record<string, HTMLTableCellElement | null>>({});

  const filteredAndSorted = useMemo(() => {
    let data = [...rows];

    // GLOBAL SEARCH (name / sku / vendor)
    const q = globalSearch.trim().toLowerCase();
    if (q.length) {
      data = data.filter((row) => {
        const name = String(row.product_name ?? "").toLowerCase();
        const sku = String(row.sku ?? "").toLowerCase();
        const vendor = String(row.vendor ?? "").toLowerCase();
        return (
          name.includes(q) || sku.includes(q) || vendor.includes(q)
        );
      });
    }

    // COLUMN FILTERS
    for (const [colKey, allowed] of Object.entries(filters)) {
      if (!allowed || allowed.length === 0) continue; // no filter for this col
      data = data.filter((row) => {
        const raw = row[colKey];
        const val = String(raw ?? "");
        return allowed.includes(val);
      });
    }

    // SORT
    if (sort.column && sort.direction) {
      const { column, direction } = sort;
      data.sort((a, b) => {
        const aRaw = a[column!];
        const bRaw = b[column!];

        const aNum = Number(aRaw);
        const bNum = Number(bRaw);
        const bothNumeric =
          !Number.isNaN(aNum) && !Number.isNaN(bNum) && aRaw !== "" && bRaw !== "";

        if (bothNumeric) {
          if (aNum < bNum) return direction === "asc" ? -1 : 1;
          if (aNum > bNum) return direction === "asc" ? 1 : -1;
          return 0;
        }

        const aStr = String(aRaw ?? "").toLowerCase();
        const bStr = String(bRaw ?? "").toLowerCase();
        if (aStr < bStr) return direction === "asc" ? -1 : 1;
        if (aStr > bStr) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [rows, globalSearch, filters, sort]);

  const startResize = (colKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const originX = e.clientX;
    const startWidth =
      widths[colKey] ||
      headerRefs.current[colKey]?.offsetWidth ||
      140;

    const handleMove = (evt: MouseEvent) => {
      const delta = evt.clientX - originX;
      const nextWidth = Math.max(60, startWidth + delta);
      setWidths((prev) => ({ ...prev, [colKey]: nextWidth }));
    };

    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  const autoFit = (colKey: string) => {
    const headerCell = headerRefs.current[colKey];
    if (!headerCell) return;

    let best = headerCell.scrollWidth + 24;

    filteredAndSorted.forEach((row) => {
      const raw = row[colKey];
      const value = String(raw ?? "");
      if (!value) return;

      const span = document.createElement("span");
      span.style.visibility = "hidden";
      span.style.position = "absolute";
      span.style.whiteSpace = "nowrap";
      span.style.fontSize = "12px";
      span.innerText = value;
      document.body.appendChild(span);
      best = Math.max(best, span.offsetWidth + 20);
      document.body.removeChild(span);
    });

    setWidths((prev) => ({ ...prev, [colKey]: Math.min(best, 800) }));
  };

  const getUniqueValues = useCallback(
    (key: string) => {
      const values = filteredAndSorted.map((row) =>
        String(row[key] ?? "")
      );
      return Array.from(new Set(values));
    },
    [filteredAndSorted]
  );

  return (
    <div className="sheet-container fade-in">
      <div className="sheet-name">
        Master · Source of Truth (read-only)
      </div>
      <div className="sheet-table-wrapper wide-scroll">
        <table className="sheet-table sheet-table-master no-shorten">
          <thead>
            <tr>
              {MASTER_COLUMNS.map((col, index) => {
                const width = widths[col.key] ?? undefined;
                const isSorted =
                  sort.column === col.key && sort.direction;
                const activeFilters = filters[col.key] || [];
                const showFilterIcon =
                  col.key !== "image_url" &&
                  col.key !== "variant_image_url";

                return (
                  <th
                    key={col.key}
                    ref={(el) => {
                      headerRefs.current[col.key] = el;
                    }}
                    className={col.sticky ? "col-sticky" : ""}
                    style={{ width }}
                  >
                    <div className="header-cell">
                      <span>{col.label}</span>
                      {isSorted && (
                        <span
                          style={{
                            fontSize: 10,
                            marginLeft: 4,
                            opacity: 0.7,
                          }}
                        >
                          {sort.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                      {showFilterIcon && (
                        <button
                          className={
                            "filter-button" +
                            (activeFilters.length ? " active" : "")
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenFilterKey(
                              openFilterKey === col.key ? null : col.key
                            );
                          }}
                        >
                          <ChevronDown size={14} />
                        </button>
                      )}

                      <div
                        className="col-resize-handle"
                        onMouseDown={(e) => startResize(col.key, e)}
                        onDoubleClick={() => autoFit(col.key)}
                      />
                    </div>

                    {openFilterKey === col.key && showFilterIcon && (
                      <FilterPopover
                        values={getUniqueValues(col.key)}
                        selected={activeFilters}
                        onChange={(next) =>
                          setFilters((prev) => ({
                            ...prev,
                            [col.key]: next,
                          }))
                        }
                        onClose={() => setOpenFilterKey(null)}
                      />
                    )}

                    {openFilterKey === col.key && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 4,
                          gap: 4,
                        }}
                      >
                        <button
                          className="filter-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSort({
                              column: col.key,
                              direction: "asc",
                            });
                            setOpenFilterKey(null);
                          }}
                        >
                          A → Z
                        </button>
                        <button
                          className="filter-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSort({
                              column: col.key,
                              direction: "desc",
                            });
                            setOpenFilterKey(null);
                          }}
                        >
                          Z → A
                        </button>
                        <button
                          className="filter-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSort({
                              column: null,
                              direction: null,
                            });
                            setOpenFilterKey(null);
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 && (
              <tr>
                <td
                  colSpan={MASTER_COLUMNS.length}
                  className="empty-state"
                >
                  No products to display. Try clearing filters or search.
                </td>
              </tr>
            )}

            {filteredAndSorted.map((row) => (
              <tr key={row.id}>
                {MASTER_COLUMNS.map((col) => {
                  const stickyClass = col.sticky ? "col-sticky" : "";
                  const raw = row[col.key];

                  if (
                    col.key === "image_url" ||
                    col.key === "variant_image_url"
                  ) {
                    return (
                      <td key={col.key} className={stickyClass}>
                        {raw ? (
                          <img
                            src={String(raw)}
                            alt=""
                            className="mini-image"
                          />
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  }

                  if (typeof raw === "boolean") {
                    return (
                      <td key={col.key} className={stickyClass}>
                        {raw ? "Yes" : ""}
                      </td>
                    );
                  }

                  return (
                    <td key={col.key} className={stickyClass}>
                      {String(raw ?? "")}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * STATUS HELPERS
 */
const normalizeStatus = (row: Row): "approved" | "pending" | "missing" => {
  const raw = String(row.status ?? "").toLowerCase();
  if (raw === "approved") return "approved";
  if (raw === "pending") return "pending";

  // If we get here, synthesize a status from completeness
  const hasName = !!row.product_name;
  const hasSku = !!row.sku;
  const hasImage = !!row.image_url || !!row.variant_image_url;
  const hasDescription = !!row.description;

  if (hasName && hasSku && hasImage && hasDescription) return "pending";
  return "missing";
};

/**
 * VALIDATION VIEW (SIMPLE GRID)
 */
type ValidationViewProps = {
  rows: Row[];
  globalSearch: string;
};

const ValidationView: React.FC<ValidationViewProps> = ({
  rows,
  globalSearch,
}) => {
  const [filters, setFilters] = useState<FilterMap>({});
  const [openFilterKey, setOpenFilterKey] = useState<string | null>(
    null
  );

  const enriched = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        __status_normalized: normalizeStatus(row),
      })),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();

    let data = enriched.filter((row) =>
      row.__status_normalized !== "approved"
    );

    if (q.length) {
      data = data.filter((row) => {
        const name = String(row.product_name ?? "").toLowerCase();
        const sku = String(row.sku ?? "").toLowerCase();
        const category = String(row.product_category ?? "").toLowerCase();
        return (
          name.includes(q) ||
          sku.includes(q) ||
          category.includes(q)
        );
      });
    }

    for (const [key, allowed] of Object.entries(filters)) {
      if (!allowed || allowed.length === 0) continue;
      data = data.filter((row) => {
        const raw = row[key];
        const val = String(raw ?? "");
        return allowed.includes(val);
      });
    }

    return data;
  }, [enriched, globalSearch, filters]);

  const getUniqueValues = useCallback(
    (key: string) => {
      const values = filtered.map((row) => String(row[key] ?? ""));
      return Array.from(new Set(values));
    },
    [filtered]
  );

  const statusPillClass = (status: string) => {
    if (status === "approved") return "pill pill-green";
    if (status === "pending") return "pill pill-yellow";
    return "pill pill-red";
  };

  const statusIcon = (status: string) => {
    if (status === "approved") return <Check size={12} />;
    if (status === "pending") return <AlertTriangle size={12} />;
    return <X size={12} />;
  };

  return (
    <div className="sheet-container fade-in">
      <div className="sheet-name">Validation Queue</div>
      <div className="sheet-table-wrapper">
        <table className="sheet-table">
          <thead>
            <tr>
              {VALIDATION_COLUMNS.map((col) => {
                const active = filters[col.key] || [];
                const showFilter =
                  col.key !== "image_url" &&
                  col.key !== "variant_image_url";

                return (
                  <th key={col.key}>
                    <div className="th-content">
                      <span>{col.label}</span>
                      {showFilter && (
                        <button
                          className={
                            "filter-button" +
                            (active.length ? " active" : "")
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenFilterKey(
                              openFilterKey === col.key ? null : col.key
                            );
                          }}
                        >
                          <Filter size={12} />
                        </button>
                      )}
                    </div>
                    {openFilterKey === col.key && showFilter && (
                      <FilterPopover
                        values={getUniqueValues(col.key)}
                        selected={active}
                        onChange={(next) =>
                          setFilters((prev) => ({
                            ...prev,
                            [col.key]: next,
                          }))
                        }
                        onClose={() => setOpenFilterKey(null)}
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={VALIDATION_COLUMNS.length}
                  className="empty-state"
                >
                  Nothing to validate. 🎉
                </td>
              </tr>
            )}

            {filtered.map((row) => {
              const status = row.__status_normalized as
                | "approved"
                | "pending"
                | "missing";

              return (
                <tr
                  key={row.id}
                  className={`master-row row-status-${status}`}
                >
                  {VALIDATION_COLUMNS.map((col) => {
                    const raw = row[col.key];

                    if (col.key === "image_url") {
                      return (
                        <td key={col.key}>
                          {raw ? (
                            <img
                              src={String(raw)}
                              alt=""
                              className="mini-image"
                            />
                          ) : (
                            <div
                              className="mini-image"
                              style={{
                                background:
                                  "repeating-linear-gradient(-45deg, #e5e7eb, #e5e7eb 4px, #f9fafb 4px, #f9fafb 8px)",
                              }}
                            />
                          )}
                        </td>
                      );
                    }

                    if (col.key === "status") {
                      return (
                        <td key={col.key}>
                          <span className={statusPillClass(status)}>
                            {statusIcon(status)}
                            <span style={{ textTransform: "capitalize" }}>
                              {status}
                            </span>
                          </span>
                        </td>
                      );
                    }

                    if (col.key === "price") {
                      const num = Number(raw);
                      return (
                        <td key={col.key} className="cell-number">
                          {Number.isNaN(num) ? "" : num.toFixed(2)}
                        </td>
                      );
                    }

                    if (col.key === "description") {
                      return (
                        <td key={col.key} className="cell-wrap">
                          {String(raw ?? "") || "—"}
                        </td>
                      );
                    }

                    return (
                      <td key={col.key}>
                        {String(raw ?? "") || "—"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * INTAKE VIEW (UI ONLY; WIRES UP LOCALLY)
 */
type IntakeViewProps = {
  onCreateDraft: (draft: Partial<Row>) => void;
};

const IntakeView: React.FC<IntakeViewProps> = ({ onCreateDraft }) => {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim() && !name.trim()) return;

    onCreateDraft({
      id: `draft-${Date.now()}`,
      sku: sku.trim(),
      product_name: name.trim(),
      product_category: category.trim(),
      price: price ? Number(price) : null,
      description: description.trim(),
      status: "pending",
      is_draft: true,
    });

    setSku("");
    setName("");
    setCategory("");
    setPrice("");
    setDescription("");
  };

  return (
    <div className="sheet-container fade-in">
      <div className="sheet-name">Manual Intake</div>
      <form onSubmit={submit} className="intake-form">
        <h3 style={{ margin: "0 0 8px", fontSize: 14 }}>
          Add New Product (local draft)
        </h3>
        <div className="intake-grid">
          <label>
            SKU
            <input
              type="text"
              className="cell-input"
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 4,
                padding: 6,
              }}
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </label>
          <label>
            Product Name
            <input
              type="text"
              className="cell-input"
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 4,
                padding: 6,
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Category
            <input
              type="text"
              className="cell-input"
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 4,
                padding: 6,
              }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </label>
          <label>
            Price
            <input
              type="number"
              className="cell-input"
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 4,
                padding: 6,
              }}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min="0"
            />
          </label>
          <label className="intake-span-2">
            Description
            <textarea
              className="cell-input"
              rows={3}
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 4,
                padding: 6,
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
        <div className="intake-footer">
          <button type="submit" className="btn-primary">
            <Plus size={12} style={{ marginRight: 4 }} />
            Add Draft
          </button>
          <span style={{ fontSize: 11, color: "#6b7280" }}>
            This only creates a local draft row for now (no backend write).
          </span>
        </div>
      </form>
    </div>
  );
};

/**
 * REPORTS VIEW
 */
type ReportsViewProps = {
  rows: Row[];
};

const ReportsView: React.FC<ReportsViewProps> = ({ rows }) => {
  const stats = useMemo(() => {
    const total = rows.length;
    let approved = 0;
    let pending = 0;
    let missing = 0;

    rows.forEach((row) => {
      const status = normalizeStatus(row);
      if (status === "approved") approved += 1;
      else if (status === "pending") pending += 1;
      else missing += 1;
    });

    const completion =
      total === 0 ? 0 : Math.round((approved / total) * 100);

    return { total, approved, pending, missing, completion };
  }, [rows]);

  return (
    <div className="sheet-container fade-in">
      <div className="sheet-name">Inventory Health</div>
      <div className="report-grid">
        <div className="report-card">
          <div className="report-label">Total Products</div>
          <div className="report-value">{stats.total}</div>
        </div>
        <div className="report-card">
          <div className="report-label">Approved</div>
          <div className="report-value" style={{ color: "#16a34a" }}>
            {stats.approved}
          </div>
        </div>
        <div className="report-card">
          <div className="report-label">Pending Review</div>
          <div className="report-value" style={{ color: "#ca8a04" }}>
            {stats.pending}
          </div>
        </div>
        <div className="report-card">
          <div className="report-label">Missing Data</div>
          <div className="report-value" style={{ color: "#dc2626" }}>
            {stats.missing}
          </div>
        </div>
        <div className="report-card">
          <div className="report-label">Completion Rate</div>
          <div className="report-value">
            {stats.completion}
            %
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "0 10px 10px",
          fontSize: 11,
          color: "#6b7280",
        }}
      >
        Local snapshot only. Wire to your sync timestamps when ready.
      </div>
    </div>
  );
};

/**
 * TOP-LEVEL UNIFIED APP
 */
const TABS = ["master", "validate", "intake", "reports"] as const;
type TabId = (typeof TABS)[number];

const InventoryWorkspace: React.FC = () => {
  const { rows: masterRows, loading, error } = useMasterInventory();
  const [activeTab, setActiveTab] = useState<TabId>("master");
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState<Row[]>([]);

  const allRows = useMemo<Row[]>(
    () => [...masterRows, ...drafts],
    [masterRows, drafts]
  );

  const stats = useMemo(() => {
    const total = allRows.length;
    let approved = 0;
    let pending = 0;
    let missing = 0;

    allRows.forEach((row) => {
      const status = normalizeStatus(row);
      if (status === "approved") approved += 1;
      else if (status === "pending") pending += 1;
      else missing += 1;
    });

    return { total, approved, pending, missing };
  }, [allRows]);

  const handleCreateDraft = (draft: Partial<Row>) => {
    setDrafts((prev) => [...prev, draft as Row]);
  };

  if (loading) {
    return (
      <div className="app-root">
        <div className="topbar">
          <div className="topbar-left">
            <Package size={20} />
            <span className="topbar-title">Inventory Workspace</span>
          </div>
          <div className="topbar-center">
            <span className="pill pill-yellow">Loading…</span>
          </div>
          <div className="topbar-right" />
        </div>
        <div className="app-content">
          <div className="sheet-container">
            <div className="sheet-name">Master (loading…)</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-root">
        <div className="topbar">
          <div className="topbar-left">
            <Package size={20} />
            <span className="topbar-title">Inventory Workspace</span>
          </div>
          <div className="topbar-center">
            <span className="pill pill-red">Error</span>
          </div>
          <div className="topbar-right" />
        </div>
        <div className="app-content">
          <div className="sheet-container">
            <div className="sheet-name">Master (error)</div>
            <div
              style={{
                padding: 16,
                color: "#b91c1c",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      {/* TOP BAR */}
      <div className="topbar">
        <div className="topbar-left">
          <Package size={20} />
          <span className="topbar-title">
            Inventory Workspace
          </span>
        </div>
        <div className="topbar-center">
          <span className="pill pill-green">
            {stats.approved} Approved
          </span>
          <span className="pill pill-yellow">
            {stats.pending} Pending
          </span>
          <span className="pill pill-red">
            {stats.missing} Missing
          </span>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <Search size={14} style={{ opacity: 0.7 }} />
            <input
              className="topbar-search-input"
              placeholder="Search name, SKU, vendor…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-ghost">
            <RefreshCw size={14} />
            Sync
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="app-content">
        {activeTab === "master" && (
          <MasterSheet rows={allRows} globalSearch={search} />
        )}
        {activeTab === "validate" && (
          <ValidationView rows={allRows} globalSearch={search} />
        )}
        {activeTab === "intake" && (
          <IntakeView onCreateDraft={handleCreateDraft} />
        )}
        {activeTab === "reports" && (
          <ReportsView rows={allRows} />
        )}
      </div>

      {/* BOTTOM TAB BAR */}
      <div className="tabbar-bottom">
        <button
          className={
            "tabbar-item" +
            (activeTab === "master" ? " tabbar-item-active" : "")
          }
          onClick={() => setActiveTab("master")}
        >
          <FileText size={18} />
          Master
        </button>
        <button
          className={
            "tabbar-item" +
            (activeTab === "validate" ? " tabbar-item-active" : "")
          }
          onClick={() => setActiveTab("validate")}
        >
          <ClipboardList size={18} />
          Validate
        </button>
        <button
          className={
            "tabbar-item" +
            (activeTab === "intake" ? " tabbar-item-active" : "")
          }
          onClick={() => setActiveTab("intake")}
        >
          <Plus size={18} />
          Intake
        </button>
        <button
          className={
            "tabbar-item" +
            (activeTab === "reports" ? " tabbar-item-active" : "")
          }
          onClick={() => setActiveTab("reports")}
        >
          <BarChart3 size={18} />
          Reports
        </button>
      </div>
    </div>
  );
};

export default InventoryWorkspace;
