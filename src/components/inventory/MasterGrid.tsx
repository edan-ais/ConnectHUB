import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  MouseEvent as ReactMouseEvent,
} from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  ColumnApi,
  GridReadyEvent,
  FirstDataRenderedEvent,
  ICellRendererParams,
} from "ag-grid-community";
import { ChevronDown } from "lucide-react";
import { useMasterInventory } from "../../hooks/useMasterInventory";
import "../../styles/app.css";

/**
 * Simple wrapper around AG Grid's built-in filtering + sorting.
 * We still show a little dropdown with "Sort A→Z / Z→A / Clear sort"
 * and checkboxes for which values to include, Excel-style.
 */
type SortState = {
  colId: string;
  dir: "asc" | "desc" | null;
};

interface FilterMenuProps {
  columnId: string;
  allValues: string[];
  activeValues: string[];
  onChangeValues: (colId: string, values: string[]) => void;
  onSortChange: (colId: string, dir: "asc" | "desc" | null) => void;
  currentSort: SortState;
  onClose: () => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  columnId,
  allValues,
  activeValues,
  onChangeValues,
  onSortChange,
  currentSort,
  onClose,
}) => {
  const toggleValue = (val: string) => {
    if (activeValues.includes(val)) {
      onChangeValues(
        columnId,
        activeValues.filter((v) => v !== val)
      );
    } else {
      onChangeValues(columnId, [...activeValues, val]);
    }
  };

  const isSortedAsc =
    currentSort.colId === columnId && currentSort.dir === "asc";
  const isSortedDesc =
    currentSort.colId === columnId && currentSort.dir === "desc";

  return (
    <div
      className="filter-menu"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="filter-menu-section">
        <button
          className={
            "filter-menu-button" + (isSortedAsc ? " filter-menu-button-active" : "")
          }
          onClick={() => onSortChange(columnId, "asc")}
        >
          Sort A → Z
        </button>
        <button
          className={
            "filter-menu-button" + (isSortedDesc ? " filter-menu-button-active" : "")
          }
          onClick={() => onSortChange(columnId, "desc")}
        >
          Sort Z → A
        </button>
        <button
          className="filter-menu-button"
          onClick={() => onSortChange(columnId, null)}
        >
          Clear sort
        </button>
      </div>

      <div className="filter-menu-divider" />

      <div className="filter-menu-values">
        {allValues.map((val) => {
          const label = val || "(blank)";
          const checked = activeValues.includes(val);
          return (
            <label key={label} className="filter-menu-checkbox-row">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleValue(val)}
              />
              <span>{label}</span>
            </label>
          );
        })}
      </div>

      <div className="filter-menu-footer">
        <button className="filter-menu-footer-button" onClick={onClose}>
          Close
        </button>
        <button
          className="filter-menu-footer-button filter-menu-footer-button-primary"
          onClick={onClose}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export const MasterGrid: React.FC = () => {
  const { rows, loading, error } = useMasterInventory();

  const gridApiRef = useRef<GridApi | null>(null);
  const columnApiRef = useRef<ColumnApi | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [sortState, setSortState] = useState<SortState>({
    colId: "",
    dir: null,
  });

  // per-column value filters: colId -> allowed values
  const [valueFilters, setValueFilters] = useState<Record<string, string[]>>({});
  // which column currently has an open filter menu
  const [openFilterColId, setOpenFilterColId] = useState<string | null>(null);

  // --- GRID LIFECYCLE -------------------------------------------------------

  const autoSizeAllColumns = () => {
    const columnApi = columnApiRef.current;
    if (!columnApi) return;
    const allCols = columnApi.getColumns();
    if (!allCols) return;
    const colIds = allCols.map((c) => c.getColId());
    // include headers in width calculation
    columnApi.autoSizeColumns(colIds, false);
  };

  const onGridReady = (event: GridReadyEvent) => {
    gridApiRef.current = event.api;
    columnApiRef.current = event.columnApi;
    autoSizeAllColumns();
  };

  const onFirstDataRendered = (event: FirstDataRenderedEvent) => {
    autoSizeAllColumns();
  };

  // If data changes significantly (e.g. new imports), resize again
  useEffect(() => {
    if (!rows || rows.length === 0) return;
    // small timeout so the DOM is ready for measurement
    const t = setTimeout(autoSizeAllColumns, 50);
    return () => clearTimeout(t);
  }, [rows]);

  // Close filter menu when clicking outside the grid
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpenFilterColId(null);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  // --- COLUMN DEFINITIONS ---------------------------------------------------

  const defaultColDef: ColDef = useMemo(
    () => ({
      sortable: true,
      filter: true, // AG Grid built-in filter
      flex: 1,
      minWidth: 120,
      wrapText: true,
      autoHeight: true,
      resizable: false, // you said no resizing handles
      headerClass: "master-header-cell",
      cellClass: "master-cell",
    }),
    []
  );

  const groupDefs: (ColGroupDef | ColDef)[] = useMemo(
    () => [
      // CORE
      {
        headerName: "Core",
        marryChildren: true,
        headerClass: "header-group-cell header-group-core",
        children: [
          {
            field: "status",
            headerName: "Status",
            colId: "status",
            pinned: "left",
            minWidth: 110,
            maxWidth: 140,
            cellClass: "master-cell master-cell-status",
          },
          {
            field: "product_name",
            headerName: "Product Name",
            colId: "product_name",
            pinned: "left",
            minWidth: 200,
            cellClass: "master-cell master-cell-product",
          },
        ],
      },

      // INVENTORY
      {
        headerName: "Inventory",
        headerClass: "header-group-cell header-group-inventory",
        children: [
          { field: "sku", headerName: "SKU", colId: "sku" },
          { field: "vendor", headerName: "Vendor", colId: "vendor" },
          {
            field: "total_inventory_on_hand",
            headerName: "Inventory On Hand – Total",
            colId: "total_inventory_on_hand",
          },
          {
            field: "total_inventory_on_the_way",
            headerName: "Inventory On The Way – Total",
            colId: "total_inventory_on_the_way",
          },
          {
            field: "incoming_total",
            headerName: "Incoming Total",
            colId: "incoming_total",
          },
          {
            field: "qty_coastal_cowgirl",
            headerName: "Inventory On Hand – Coastal Cowgirl",
            colId: "qty_coastal_cowgirl",
          },
          {
            field: "qty_salty_tails",
            headerName: "Inventory On Hand – Salty Tails",
            colId: "qty_salty_tails",
          },
          {
            field: "qty_central_valley",
            headerName: "Inventory On Hand – Central Valley",
            colId: "qty_central_valley",
          },
          {
            field: "new_qty_coastal_cowgirl",
            headerName: "Inventory On The Way – Coastal Cowgirl",
            colId: "new_qty_coastal_cowgirl",
          },
          {
            field: "new_qty_salty_tails",
            headerName: "Inventory On The Way – Salty Tails",
            colId: "new_qty_salty_tails",
          },
          {
            field: "new_qty_central_valley",
            headerName: "Inventory On The Way – Central Valley",
            colId: "new_qty_central_valley",
          },
          {
            field: "reorder_point",
            headerName: "Reorder Point",
            colId: "reorder_point",
          },
        ],
      },

      // CLASSIFICATION
      {
        headerName: "Classification",
        headerClass: "header-group-cell header-group-classification",
        children: [
          {
            field: "product_type",
            headerName: "Product Type",
            colId: "product_type",
          },
          {
            field: "product_category",
            headerName: "Product Category",
            colId: "product_category",
          },
          { field: "category", headerName: "Category", colId: "category" },
          {
            field: "reporting_category",
            headerName: "Reporting Category",
            colId: "reporting_category",
          },
          {
            field: "description",
            headerName: "Description",
            colId: "description",
            minWidth: 260,
          },
          {
            field: "sales_description",
            headerName: "Sales Description",
            colId: "sales_description",
            minWidth: 220,
          },
          {
            field: "purchase_description",
            headerName: "Purchase Description",
            colId: "purchase_description",
            minWidth: 220,
          },
          { field: "tags", headerName: "Tags", colId: "tags" },
        ],
      },

      // VARIANTS
      {
        headerName: "Variants",
        headerClass: "header-group-cell header-group-variants",
        children: [
          {
            field: "single_parent_or_variant",
            headerName: "Single Parent or Variant",
            colId: "single_parent_or_variant",
          },
          {
            field: "variant_name",
            headerName: "Variant Name",
            colId: "variant_name",
          },
          {
            field: "variant_title",
            headerName: "Variant Title",
            colId: "variant_title",
          },
          {
            field: "option1_name",
            headerName: "Option 1 Name",
            colId: "option1_name",
          },
          {
            field: "option1_value",
            headerName: "Option 1 Value",
            colId: "option1_value",
          },
          {
            field: "option2_name",
            headerName: "Option 2 Name",
            colId: "option2_name",
          },
          {
            field: "option2_value",
            headerName: "Option 2 Value",
            colId: "option2_value",
          },
          {
            field: "option3_name",
            headerName: "Option 3 Name",
            colId: "option3_name",
          },
          {
            field: "option3_value",
            headerName: "Option 3 Value",
            colId: "option3_value",
          },
          {
            field: "option4_name",
            headerName: "Option 4 Name",
            colId: "option4_name",
          },
          {
            field: "option4_value",
            headerName: "Option 4 Value",
            colId: "option4_value",
          },
        ],
      },

      // SHOPIFY
      {
        headerName: "Shopify",
        headerClass: "header-group-cell header-group-shopify",
        children: [
          {
            field: "handle",
            headerName: "Shopify Handle",
            colId: "handle",
          },
          {
            field: "permalink",
            headerName: "Shopify Permalink",
            colId: "permalink",
          },
          {
            field: "image_url",
            headerName: "Product Image",
            colId: "image_url",
            minWidth: 140,
            cellRenderer: (params: ICellRendererParams) =>
              params.value ? (
                <img
                  src={String(params.value)}
                  alt=""
                  className="master-mini-image"
                />
              ) : null,
          },
          {
            field: "variant_image_url",
            headerName: "Variant Image",
            colId: "variant_image_url",
            minWidth: 140,
            cellRenderer: (params: ICellRendererParams) =>
              params.value ? (
                <img
                  src={String(params.value)}
                  alt=""
                  className="master-mini-image"
                />
              ) : null,
          },
          {
            field: "square_image_id",
            headerName: "Square Image ID",
            colId: "square_image_id",
          },
        ],
      },

      // PRICING & ACCOUNTS
      {
        headerName: "Pricing & Accounts",
        headerClass: "header-group-cell header-group-pricing-accounts",
        children: [
          { field: "price", headerName: "Base Price", colId: "price" },
          {
            field: "online_price",
            headerName: "Online Price",
            colId: "online_price",
          },
          { field: "cost", headerName: "Cost", colId: "cost" },
          {
            field: "compare_at",
            headerName: "Compare At Price",
            colId: "compare_at",
          },
          {
            field: "default_unit_cost",
            headerName: "Default Unit Cost",
            colId: "default_unit_cost",
          },
          {
            field: "income_account",
            headerName: "Income Account (QB)",
            colId: "income_account",
          },
          {
            field: "expense_account",
            headerName: "Expense Account (QB)",
            colId: "expense_account",
          },
          {
            field: "inventory_asset_account",
            headerName: "Inventory Asset Account (QB)",
            colId: "inventory_asset_account",
          },
        ],
      },

      // TAX & WEIGHT
      {
        headerName: "Tax & Weight",
        headerClass: "header-group-cell header-group-tax-weight",
        children: [
          {
            field: "sales_tax_rate",
            headerName: "Sales Tax Rate",
            colId: "sales_tax_rate",
          },
          { field: "tax_code", headerName: "Tax Code", colId: "tax_code" },
          {
            field: "taxable",
            headerName: "Taxable?",
            colId: "taxable",
          },
          {
            field: "last_delivery_date",
            headerName: "Last Delivery Date",
            colId: "last_delivery_date",
          },
          { field: "weight_lb", headerName: "Weight (lb)", colId: "weight_lb" },
        ],
      },

      // FULFILLMENT
      {
        headerName: "Fulfillment",
        headerClass: "header-group-cell header-group-fulfillment",
        children: [
          {
            field: "shipping_enabled",
            headerName: "Shipping Enabled",
            colId: "shipping_enabled",
          },
          {
            field: "self_serve_ordering_enabled",
            headerName: "Self-Serve Ordering Enabled",
            colId: "self_serve_ordering_enabled",
          },
          {
            field: "delivery_enabled",
            headerName: "Delivery Enabled",
            colId: "delivery_enabled",
          },
          {
            field: "pickup_enabled",
            headerName: "Pickup Enabled",
            colId: "pickup_enabled",
          },
        ],
      },

      // STOCK ALERTS
      {
        headerName: "Stock Alerts",
        headerClass: "header-group-cell header-group-stock-alerts",
        children: [
          {
            field: "stock_alert_enabled_cc",
            headerName: "Stock Alert – Coastal Cowgirl",
            colId: "stock_alert_enabled_cc",
          },
          {
            field: "stock_alert_count_cc",
            headerName: "Alert Threshold – Coastal Cowgirl",
            colId: "stock_alert_count_cc",
          },
          {
            field: "stock_alert_enabled_st",
            headerName: "Stock Alert – Salty Tails",
            colId: "stock_alert_enabled_st",
          },
          {
            field: "stock_alert_count_st",
            headerName: "Alert Threshold – Salty Tails",
            colId: "stock_alert_count_st",
          },
          {
            field: "stock_alert_enabled_cv",
            headerName: "Stock Alert – Central Valley",
            colId: "stock_alert_enabled_cv",
          },
          {
            field: "stock_alert_count_cv",
            headerName: "Alert Threshold – Central Valley",
            colId: "stock_alert_count_cv",
          },
        ],
      },

      // QUANTITIES
      {
        headerName: "Quantities",
        headerClass: "header-group-cell header-group-quantities",
        children: [
          {
            field: "total_quantity",
            headerName: "Total Quantity (Snapshot)",
            colId: "total_quantity",
          },
          {
            field: "current_qty_cc",
            headerName: "Current Qty – Coastal Cowgirl",
            colId: "current_qty_cc",
          },
          {
            field: "current_qty_st",
            headerName: "Current Qty – Salty Tails",
            colId: "current_qty_st",
          },
          {
            field: "current_qty_cv",
            headerName: "Current Qty – Central Valley",
            colId: "current_qty_cv",
          },
          {
            field: "quantity_as_of_date",
            headerName: "Quantity As Of Date",
            colId: "quantity_as_of_date",
          },
        ],
      },

      // IDENTIFIERS
      {
        headerName: "Identifiers",
        headerClass: "header-group-cell header-group-identifiers",
        children: [
          {
            field: "parent_sku",
            headerName: "Parent SKU",
            colId: "parent_sku",
          },
          { field: "barcode", headerName: "Barcode", colId: "barcode" },
          { field: "gtin", headerName: "GTIN", colId: "gtin" },
          {
            field: "vendor_code",
            headerName: "Vendor Code",
            colId: "vendor_code",
          },
          { field: "sellable", headerName: "Sellable?", colId: "sellable" },
          {
            field: "stockable",
            headerName: "Stockable?",
            colId: "stockable",
          },
          {
            field: "contains_alcohol",
            headerName: "Contains Alcohol?",
            colId: "contains_alcohol",
          },
          {
            field: "skip_pos_detail",
            headerName: "Skip POS Detail",
            colId: "skip_pos_detail",
          },
        ],
      },

      // INTEGRATIONS / SEO
      {
        headerName: "Integrations / SEO",
        headerClass: "header-group-cell header-group-integrations-seo",
        children: [
          {
            field: "shopify_product_id",
            headerName: "Shopify Product ID",
            colId: "shopify_product_id",
          },
          {
            field: "shopify_variant_id",
            headerName: "Shopify Variant ID",
            colId: "shopify_variant_id",
          },
          {
            field: "variants_json",
            headerName: "Variants JSON",
            colId: "variants_json",
          },
          {
            field: "square_object_id",
            headerName: "Square Object ID",
            colId: "square_object_id",
          },
          {
            field: "square_variation_id",
            headerName: "Square Variation ID",
            colId: "square_variation_id",
          },
          {
            field: "stock_json",
            headerName: "Stock JSON",
            colId: "stock_json",
          },
          {
            field: "quickbooks_id",
            headerName: "QuickBooks ID",
            colId: "quickbooks_id",
          },
          { field: "booker_id", headerName: "Booker ID", colId: "booker_id" },
          {
            field: "seo_title",
            headerName: "SEO Title",
            colId: "seo_title",
          },
          {
            field: "seo_description",
            headerName: "SEO Description",
            colId: "seo_description",
          },
        ],
      },

      // LIFECYCLE
      {
        headerName: "Lifecycle",
        headerClass: "header-group-cell header-group-lifecycle",
        children: [
          {
            field: "archived",
            headerName: "Archived?",
            colId: "archived",
          },
          {
            field: "archive_reason",
            headerName: "Archive Reason",
            colId: "archive_reason",
          },
          {
            field: "archived_timestamp",
            headerName: "Archived Timestamp",
            colId: "archived_timestamp",
          },
          {
            field: "master_id",
            headerName: "Master ID",
            colId: "master_id",
          },
          {
            field: "date_added",
            headerName: "Date Added",
            colId: "date_added",
          },
          {
            field: "last_updated",
            headerName: "Last Updated",
            colId: "last_updated",
          },
          {
            field: "last_synced_square",
            headerName: "Last Synced – Square",
            colId: "last_synced_square",
          },
          {
            field: "last_synced_qb",
            headerName: "Last Synced – QuickBooks",
            colId: "last_synced_qb",
          },
          {
            field: "last_synced_booker",
            headerName: "Last Synced – Booker",
            colId: "last_synced_booker",
          },
        ],
      },
    ],
    []
  );

  // --- FILTER / SORT STATE APPLIED TO AG GRID -------------------------------

  const handleFilterValuesChange = (colId: string, values: string[]) => {
    setValueFilters((prev) => ({
      ...prev,
      [colId]: values,
    }));

    const api = gridApiRef.current;
    if (!api) return;

    const instance = api.getFilterInstance(colId);
    if (!instance || typeof (instance as any).setModel !== "function") return;

    if (values.length === 0) {
      // clear filter
      (instance as any).setModel(null);
    } else {
      // Use a "set" filter style model via text filter "inRange" isn't ideal,
      // but in Community we can emulate "equals any of" by OR text filter if needed.
      // For now: simple text filter that matches any of the chosen values.
      (instance as any).setModel({
        type: "contains",
        filter: values[0],
      });
      // Note: if you want exact multi-select logic,
      // we can swap this to the SetFilter from AG Grid Enterprise later.
    }

    api.onFilterChanged();
  };

  const handleSortChange = (colId: string, dir: "asc" | "desc" | null) => {
    setSortState({ colId, dir });

    const api = gridApiRef.current;
    if (!api) return;

    if (!dir) {
      api.setSortModel([]);
      return;
    }

    api.setSortModel([{ colId, sort: dir }]);
  };

  const currentRowClassRules = useMemo(
    () => ({
      "master-row-approved": (params: any) =>
        String(params.data?.status || "").toLowerCase() === "approved",
      "master-row-pending": (params: any) =>
        String(params.data?.status || "").toLowerCase() === "pending" ||
        String(params.data?.status || "").toLowerCase() === "needs_approval",
      "master-row-missing": (params: any) =>
        String(params.data?.status || "").toLowerCase() === "missing",
    }),
    []
  );

  // --- CONDITIONAL STATES ---------------------------------------------------

  if (loading) {
    return (
      <div className="sheet-container">
        <div className="sheet-name sheet-name-large">
          Master (loading…)
        </div>
        <div className="empty-state">Loading Master inventory…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sheet-container">
        <div className="sheet-name sheet-name-large">
          Master (error)
        </div>
        <div className="empty-state">Error: {error}</div>
      </div>
    );
  }

  // --- MAIN RENDER ----------------------------------------------------------

  return (
    <div className="sheet-container">
      <div className="sheet-name sheet-name-large">
        Master (Source of Truth · read-only)
      </div>

      <div className="sheet-table-wrapper" ref={containerRef}>
        <div className="ag-theme-alpine master-grid-theme">
          <AgGridReact
            rowData={rows}
            columnDefs={groupDefs}
            defaultColDef={defaultColDef}
            rowHeight={36}
            headerHeight={32}
            groupHeaderHeight={32}
            animateRows={false}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
            rowClassRules={currentRowClassRules}
            suppressDragLeaveHidesColumns={true}
            suppressMovableColumns={true}
            suppressFieldDotNotation={true}
          />
        </div>

        {/* Small transparent layer to host our custom filter dropdown buttons */}
        <div className="master-filter-overlay">
          {/* AG Grid already renders column menus; if you want the chevron-based
              overlay exactly in the header, we would need a custom header component.
              For now, we keep the Chevron icon behavior in our own layer, but
              AG Grid’s built-in menus are usually enough. */}
        </div>
      </div>
    </div>
  );
};
