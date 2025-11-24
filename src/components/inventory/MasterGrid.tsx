import React from "react";
import { useMasterInventory } from "../../hooks/useMasterInventory";
import { MasterStatus } from "../../lib/types";
import "../../styles/app.css";

export const MasterGrid: React.FC = () => {
  const { rows, loading, error } = useMasterInventory();

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

  return (
    <div className="sheet-container fade-in">
      <div className="sheet-name">Master (Source of Truth · read-only)</div>

      <div className="sheet-table-wrapper">
        <table className="sheet-table sheet-table-master">
          {/* HEADER GROUPS */}
          <thead>
            <tr className="header-group-row">
              <th className="col-sticky" colSpan={2}>Core</th>
              <th colSpan={12}>Inventory</th>
              <th colSpan={8}>Classification</th>
              <th colSpan={8}>Variants</th>
              <th colSpan={6}>Shopify</th>
              <th colSpan={10}>Pricing & Accounts</th>
              <th colSpan={12}>Fulfillment</th>
              <th colSpan={10}>Identifiers</th>
              <th colSpan={10}>Integrations / SEO</th>
              <th colSpan={7}>Lifecycle</th>
            </tr>

            {/* COLUMN HEADERS */}
            <tr>
              <th className="col-sticky">Status</th>
              <th className="col-sticky">Product Name</th>

              <th>SKU</th>
              <th>Vendor</th>
              <th>Total On Hand</th>
              <th>Total On The Way</th>
              <th>Incoming Total</th>
              <th>Qty CC</th>
              <th>Qty ST</th>
              <th>Qty CV</th>
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

              <th>Parent/Variant</th>
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

              <th>Tax Rate</th>
              <th>Tax Code</th>
              <th>Taxable</th>

              <th>Last Delivery</th>
              <th>Weight (lb)</th>

              <th>Shipping</th>
              <th>Self-Serve</th>
              <th>Delivery</th>
              <th>Pickup</th>

              <th>Alert CC</th>
              <th>Alert CC Count</th>
              <th>Alert ST</th>
              <th>Alert ST Count</th>
              <th>Alert CV</th>
              <th>Alert CV Count</th>

              <th>Total Quantity</th>
              <th>Current CC</th>
              <th>Current ST</th>
              <th>Current CV</th>
              <th>As Of</th>

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
              <th>Reason</th>
              <th>Archived Timestamp</th>
              <th>Master ID</th>
              <th>Date Added</th>
              <th>Last Updated</th>
              <th>Synced Square</th>
              <th>Synced QB</th>
              <th>Synced Booker</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(row => (
              <tr key={row.id} className={`master-row row-status-${row.status.toLowerCase()}`}>
                <td className="col-sticky">{row.status}</td>
                <td className="col-sticky">
                  <div className="product-preview-cell">
                    <div className="product-preview-thumb">
                      {row.image_url ? (
                        <img src={row.image_url} alt={row.product_name} />
                      ) : (
                        <div className="product-preview-placeholder" />
                      )}
                    </div>
                    {row.product_name}
                  </div>
                </td>

                <td>{row.sku}</td>
                <td>{row.vendor}</td>
                <td>{row.total_inventory_on_hand}</td>
                <td>{row.total_inventory_on_the_way}</td>
                <td>{row.incoming_total}</td>
                <td>{row.qty_coastal_cowgirl}</td>
                <td>{row.qty_salty_tails}</td>
                <td>{row.qty_central_valley}</td>
                <td>{row.new_qty_coastal_cowgirl}</td>
                <td>{row.new_qty_salty_tails}</td>
                <td>{row.new_qty_central_valley}</td>
                <td>{row.reorder_point}</td>

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
                <td>{row.permalink}</td>
                <td>{row.image_url && <img src={row.image_url} className="mini-image" />}</td>
                <td>{row.variant_image_url && <img src={row.variant_image_url} className="mini-image" />}</td>
                <td>{row.square_image_id}</td>

                <td>{row.price}</td>
                <td>{row.online_price}</td>
                <td>{row.cost}</td>
                <td>{row.compare_at}</td>
                <td>{row.default_unit_cost}</td>
                <td>{row.income_account}</td>
                <td>{row.expense_account}</td>
                <td>{row.inventory_asset_account}</td>

                <td>{row.sales_tax_rate}</td>
                <td>{row.tax_code}</td>
                <td>{row.taxable ? "Yes" : "No"}</td>

                <td>{row.last_delivery_date}</td>
                <td>{row.weight_lb}</td>

                <td>{row.shipping_enabled ? "Yes" : "No"}</td>
                <td>{row.self_serve_ordering_enabled ? "Yes" : "No"}</td>
                <td>{row.delivery_enabled ? "Yes" : "No"}</td>
                <td>{row.pickup_enabled ? "Yes" : "No"}</td>

                <td>{row.stock_alert_enabled_cc ? "Yes" : "No"}</td>
                <td>{row.stock_alert_count_cc}</td>
                <td>{row.stock_alert_enabled_st ? "Yes" : "No"}</td>
                <td>{row.stock_alert_count_st}</td>
                <td>{row.stock_alert_enabled_cv ? "Yes" : "No"}</td>
                <td>{row.stock_alert_count_cv}</td>

                <td>{row.total_quantity}</td>
                <td>{row.current_qty_cc}</td>
                <td>{row.current_qty_st}</td>
                <td>{row.current_qty_cv}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
