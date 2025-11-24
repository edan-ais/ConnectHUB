import React from "react";
import { useInventoryStore } from "../../state/inventoryStore";
import { MasterStatus } from "../../lib/types"; // we’ll define below
import "./app.css"; // optional extra styles or just use app.css

export interface MasterRow {
  id?: string;
  status: MasterStatus;
  product_name: string;
  sku: string;
  vendor: string | null;
  total_inventory_on_hand: number;
  total_inventory_on_the_way: number;
  incoming_total: number;
  qty_coastal_cowgirl: number;
  qty_salty_tails: number;
  qty_central_valley: number;
  new_qty_coastal_cowgirl: number;
  new_qty_salty_tails: number;
  new_qty_central_valley: number;
  reorder_point: number;
  product_type: string | null;
  product_category: string | null;
  category: string | null;
  reporting_category: string | null;
  description: string | null;
  sales_description: string | null;
  purchase_description: string | null;
  tags: string | null;
  single_parent_or_variant: string | null;
  variant_name: string | null;
  variant_title: string | null;
  option1_name: string | null;
  option1_value: string | null;
  option2_name: string | null;
  option2_value: string | null;
  option3_name: string | null;
  option3_value: string | null;
  option4_name: string | null;
  option4_value: string | null;
  handle: string | null;
  permalink: string | null;
  image_url: string | null;
  variant_image_url: string | null;
  square_image_id: string | null;
  price: number | null;
  online_price: number | null;
  cost: number | null;
  compare_at: number | null;
  default_unit_cost: number | null;
  income_account: string | null;
  expense_account: string | null;
  inventory_asset_account: string | null;
  sales_tax_rate: number | null;
  tax_code: string | null;
  taxable: boolean | null;
  last_delivery_date: string | null;
  weight_lb: number | null;
  shipping_enabled: boolean | null;
  self_serve_ordering_enabled: boolean | null;
  delivery_enabled: boolean | null;
  pickup_enabled: boolean | null;
  stock_alert_enabled_cc: boolean | null;
  stock_alert_count_cc: number | null;
  stock_alert_enabled_st: boolean | null;
  stock_alert_count_st: number | null;
  stock_alert_enabled_cv: boolean | null;
  stock_alert_count_cv: number | null;
  total_quantity: number;
  current_qty_cc: number;
  current_qty_st: number;
  current_qty_cv: number;
  quantity_as_of_date: string | null;
  parent_sku: string | null;
  barcode: string | null;
  gtin: string | null;
  vendor_code: string | null;
  sellable: boolean | null;
  stockable: boolean | null;
  contains_alcohol: boolean | null;
  skip_pos_detail: boolean | null;
  shopify_product_id: number | null;
  shopify_variant_id: number | null;
  variants_json: any;
  square_object_id: string | null;
  square_variation_id: string | null;
  stock_json: any;
  quickbooks_id: string | null;
  booker_id: string | null;
  seo_title: string | null;
  seo_description: string | null;
  archived: boolean;
  archive_reason: string | null;
  archived_timestamp: string | null;
  master_id: string | null;
  date_added: string | null;
  last_updated: string | null;
  last_synced_square: string | null;
  last_synced_qb: string | null;
  last_synced_booker: string | null;
}

// Simple demo data until Supabase is wired
const demoRows: MasterRow[] = [];

function rowClass(status: MasterStatus): string {
  switch (status) {
    case "APPROVED":
      return "row-status-approved";
    case "READY_FOR_APPROVAL":
      return "row-status-pending";
    case "MISSING_INFO":
    default:
      return "row-status-missing";
  }
}

export const MasterGrid: React.FC = () => {
  const searchQuery = useInventoryStore(s => s.searchQuery);

  // For now, use demoRows; eventually fetch from Supabase.
  const rows = demoRows;

  const filtered = rows.filter(row => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      row.product_name.toLowerCase().includes(q) ||
      row.sku.toLowerCase().includes(q) ||
      (row.vendor || "").toLowerCase().includes(q) ||
      (row.category || "").toLowerCase().includes(q) ||
      (row.tags || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="sheet-container fade-in">
      <div className="sheet-name">Master (Source of Truth · read-only)</div>
      <div className="sheet-table-wrapper">
        <table className="sheet-table sheet-table-master">
          <thead>
            {/* Grouped header row */}
            <tr className="header-group-row">
              <th className="col-sticky col-status-group" colSpan={2}>
                Core
              </th>
              <th colSpan={12}>Inventory</th>
              <th colSpan={8}>Classification</th>
              <th colSpan={8}>Options & Variants</th>
              <th colSpan={6}>Shopify</th>
              <th colSpan={10}>Pricing & Accounts</th>
              <th colSpan={12}>Fulfillment & Alerts</th>
              <th colSpan={10}>Identifiers</th>
              <th colSpan={10}>Integrations & SEO</th>
              <th colSpan={7}>Lifecycle & Sync</th>
            </tr>
            {/* Actual column headers */}
            <tr>
              <th className="col-sticky">Status</th>
              <th className="col-sticky">Product Name</th>

              <th>SKU</th>
              <th>Vendor</th>
              <th>Total On Hand</th>
              <th>Total On The Way</th>
              <th>Incoming Total</th>
              <th>Qty Coastal Cowgirl</th>
              <th>Qty Salty Tails</th>
              <th>Qty Central Valley</th>
              <th>New Qty CC</th>
              <th>New Qty ST</th>
              <th>New Qty CV</th>
              <th>Reorder Point</th>

              <th>Product Type</th>
              <th>Product Category</th>
              <th>Category</th>
              <th>Reporting Category</th>
              <th>Description</th>
              <th>Sales Description</th>
              <th>Purchase Description</th>
              <th>Tags</th>

              <th>Parent / Variant</th>
              <th>Variant Name</th>
              <th>Variant Title</th>
              <th>Option1 Name</th>
              <th>Option1 Value</th>
              <th>Option2 Name</th>
              <th>Option2 Value</th>
              <th>Option3 Name</th>
              <th>Option3 Value</th>
              <th>Option4 Name</th>
              <th>Option4 Value</th>

              <th>Handle</th>
              <th>Permalink</th>
              <th>Image</th>
              <th>Variant Image</th>
              <th>Square Image ID</th>

              <th>Price</th>
              <th>Online Price</th>
              <th>Cost</th>
              <th>Compare At</th>
              <th>Default Unit Cost</th>
              <th>Income Account</th>
              <th>Expense Account</th>
              <th>Inventory Asset Account</th>

              <th>Sales Tax Rate</th>
              <th>Tax Code</th>
              <th>Taxable</th>

              <th>Last Delivery Date</th>
              <th>Weight (lb)</th>

              <th>Shipping Enabled</th>
              <th>Self-Serve Ordering</th>
              <th>Delivery Enabled</th>
              <th>Pickup Enabled</th>

              <th>CC Alert Enabled</th>
              <th>CC Alert Count</th>
              <th>ST Alert Enabled</th>
              <th>ST Alert Count</th>
              <th>CV Alert Enabled</th>
              <th>CV Alert Count</th>

              <th>Total Quantity</th>
              <th>Current Qty CC</th>
              <th>Current Qty ST</th>
              <th>Current Qty CV</th>
              <th>Quantity As Of</th>

              <th>Parent SKU</th>
              <th>Barcode</th>
              <th>GTIN</th>
              <th>Vendor Code</th>
              <th>Sellable</th>
              <th>Stockable</th>
              <th>Contains Alcohol</th>
              <th>Skip POS Detail</th>

              <th>Shopify Product ID</th>
              <th>Shopify Variant ID</th>
              <th>Variants JSON</th>
              <th>Square Object ID</th>
              <th>Square Variation ID</th>
              <th>Stock JSON</th>
              <th>QuickBooks ID</th>
              <th>Booker ID</th>
              <th>SEO Title</th>
              <th>SEO Description</th>

              <th>Archived</th>
              <th>Archive Reason</th>
              <th>Archived Timestamp</th>
              <th>Master ID</th>
              <th>Date Added</th>
              <th>Last Updated</th>
              <th>Last Synced Square</th>
              <th>Last Synced QB</th>
              <th>Last Synced Booker</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={120} style={{ textAlign: "center", padding: "20px" }}>
                  No products match your search.
                </td>
              </tr>
            ) : (
              filtered.map(row => (
                <tr
                  key={row.id || `${row.shopify_variant_id}-${row.sku}`}
                  className={`master-row ${rowClass(row.status)}`}
                >
                  <td className="col-sticky">
                    {row.status === "APPROVED"
                      ? "Approved"
                      : row.status === "READY_FOR_APPROVAL"
                      ? "Ready"
                      : "Missing Info"}
                  </td>
                  <td className="col-sticky">
                    <div className="product-preview-cell">
                      <div className="product-preview-thumb">
                        {row.image_url ? (
                          <img src={row.image_url} alt={row.product_name} />
                        ) : (
                          <div className="product-preview-placeholder" />
                        )}
                      </div>
                      <span className="product-preview-name">
                        {row.product_name}
                      </span>
                    </div>
                  </td>

                  <td>{row.sku}</td>
                  <td>{row.vendor}</td>
                  <td className="cell-number">{row.total_inventory_on_hand}</td>
                  <td className="cell-number">{row.total_inventory_on_the_way}</td>
                  <td className="cell-number">{row.incoming_total}</td>
                  <td className="cell-number">{row.qty_coastal_cowgirl}</td>
                  <td className="cell-number">{row.qty_salty_tails}</td>
                  <td className="cell-number">{row.qty_central_valley}</td>
                  <td className="cell-number">{row.new_qty_coastal_cowgirl}</td>
                  <td className="cell-number">{row.new_qty_salty_tails}</td>
                  <td className="cell-number">{row.new_qty_central_valley}</td>
                  <td className="cell-number">{row.reorder_point}</td>

                  <td>{row.product_type}</td>
                  <td>{row.product_category}</td>
                  <td>{row.category}</td>
                  <td>{row.reporting_category}</td>
                  <td className="cell-wrap">{row.description}</td>
                  <td className="cell-wrap">{row.sales_description}</td>
                  <td className="cell-wrap">{row.purchase_description}</td>
                  <td className="cell-wrap">{row.tags}</td>

                  <td>{row.single_parent_or_variant}</td>
                  <td>{row.variant_name}</td>
                  <td>{row.variant_title}</td>
                  <td>{row.option1_name}</td>
                  <td>{row.option1_value}</td>
                  <td>{row.option2_name}</td>
                  <td>{row.option2_value}</td>
                  <td>{row.option3_name}</td>
                  <td>{row.option3_value}</td>
                  <td>{row.option4_name}</td>
                  <td>{row.option4_value}</td>

                  <td>{row.handle}</td>
                  <td className="cell-wrap">{row.permalink}</td>
                  <td>
                    {row.image_url && (
                      <img
                        src={row.image_url}
                        alt=""
                        className="mini-image"
                      />
                    )}
                  </td>
                  <td>
                    {row.variant_image_url && (
                      <img
                        src={row.variant_image_url}
                        alt=""
                        className="mini-image"
                      />
                    )}
                  </td>
                  <td>{row.square_image_id}</td>

                  <td className="cell-number">{row.price}</td>
                  <td className="cell-number">{row.online_price}</td>
                  <td className="cell-number">{row.cost}</td>
                  <td className="cell-number">{row.compare_at}</td>
                  <td className="cell-number">{row.default_unit_cost}</td>
                  <td>{row.income_account}</td>
                  <td>{row.expense_account}</td>
                  <td>{row.inventory_asset_account}</td>

                  <td className="cell-number">{row.sales_tax_rate}</td>
                  <td>{row.tax_code}</td>
                  <td>{row.taxable ? "Yes" : "No"}</td>

                  <td>{row.last_delivery_date}</td>
                  <td className="cell-number">{row.weight_lb}</td>

                  <td>{row.shipping_enabled ? "Yes" : "No"}</td>
                  <td>{row.self_serve_ordering_enabled ? "Yes" : "No"}</td>
                  <td>{row.delivery_enabled ? "Yes" : "No"}</td>
                  <td>{row.pickup_enabled ? "Yes" : "No"}</td>

                  <td>{row.stock_alert_enabled_cc ? "Yes" : "No"}</td>
                  <td className="cell-number">{row.stock_alert_count_cc}</td>
                  <td>{row.stock_alert_enabled_st ? "Yes" : "No"}</td>
                  <td className="cell-number">{row.stock_alert_count_st}</td>
                  <td>{row.stock_alert_enabled_cv ? "Yes" : "No"}</td>
                  <td className="cell-number">{row.stock_alert_count_cv}</td>

                  <td className="cell-number">{row.total_quantity}</td>
                  <td className="cell-number">{row.current_qty_cc}</td>
                  <td className="cell-number">{row.current_qty_st}</td>
                  <td className="cell-number">{row.current_qty_cv}</td>
                  <td>{row.quantity_as_of_date}</td>

                  <td>{row.parent_sku}</td>
                  <td>{row.barcode}</td>
                  <td>{row.gtin}</td>
                  <td>{row.vendor_code}</td>
                  <td>{row.sellable ? "Yes" : "No"}</td>
                  <td>{row.stockable ? "Yes" : "No"}</td>
                  <td>{row.contains_alcohol ? "Yes" : "No"}</td>
                  <td>{row.skip_pos_detail ? "Yes" : "No"}</td>

                  <td>{row.shopify_product_id}</td>
                  <td>{row.shopify_variant_id}</td>
                  <td className="cell-wrap">JSON</td>
                  <td>{row.square_object_id}</td>
                  <td>{row.square_variation_id}</td>
                  <td className="cell-wrap">JSON</td>
                  <td>{row.quickbooks_id}</td>
                  <td>{row.booker_id}</td>
                  <td className="cell-wrap">{row.seo_title}</td>
                  <td className="cell-wrap">{row.seo_description}</td>

                  <td>{row.archived ? "Yes" : "No"}</td>
                  <td>{row.archive_reason}</td>
                  <td>{row.archived_timestamp}</td>
                  <td>{row.master_id}</td>
                  <td>{row.date_added}</td>
                  <td>{row.last_updated}</td>
                  <td>{row.last_synced_square}</td>
                  <td>{row.last_synced_qb}</td>
                  <td>{row.last_synced_booker}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
