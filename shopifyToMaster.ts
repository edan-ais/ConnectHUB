// Types are trimmed for brevity – you can expand from Shopify's official types.
export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html?: string;
  vendor?: string;
  product_type?: string;
  tags?: string;
  options: { name: string; position: number }[];
  variants: ShopifyVariant[];
  image?: { src: string | null } | null;
  images: { id: number; src: string }[];
}

export interface ShopifyVariant {
  id: number;
  title: string;
  sku: string;
  barcode?: string;
  price: string;
  compare_at_price?: string | null;
  grams?: number;
  inventory_quantity: number;
  inventory_management?: string | null;
  inventory_policy?: string | null;
  option1?: string | null;
  option2?: string | null;
  option3?: string | null;
  image_id?: number | null;
}

export type MasterStatus = "MISSING_INFO" | "READY_FOR_APPROVAL" | "APPROVED";

export interface MasterRowInsert {
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

  shopify_product_id: number;
  shopify_variant_id: number;
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
}

const stripHtml = (html: string | undefined | null): string | null =>
  html ? html.replace(/<[^>]*>?/gm, "") : null;

const lbFromGrams = (grams?: number): number | null =>
  typeof grams === "number" ? grams / 453.59237 : null;

/**
 * Decide status based on missing fields & archived flag.
 * Master is view-only; approval is actually controlled elsewhere,
 * but we store the status for coloring.
 */
function computeStatus(row: {
  archived: boolean;
  description: string | null;
  product_name: string;
  price: number | null;
}): MasterStatus {
  if (row.archived) return "MISSING_INFO"; // could be special later
  if (!row.product_name || !row.description || row.price == null) {
    return "MISSING_INFO"; // red
  }
  // later: if approved flag set elsewhere, return APPROVED
  return "READY_FOR_APPROVAL"; // yellow by default
}

/**
 * Flatten a Shopify product into Master rows (one per variant).
 */
export function shopifyProductToMasterRows(
  product: ShopifyProduct
): MasterRowInsert[] {
  const baseImageUrl = product.image?.src || null;
  const tags = product.tags || null;

  const optionNameByPosition = new Map<number, string>();
  for (const opt of product.options || []) {
    optionNameByPosition.set(opt.position, opt.name);
  }

  return (product.variants || []).map(variant => {
    const variantImageUrl = (() => {
      if (!variant.image_id) return null;
      const match = product.images.find(img => img.id === variant.image_id);
      return match ? match.src : null;
    })();

    const description = stripHtml(product.body_html);

    // For now, all inventory is total_inventory_on_hand; location splits = 0.
    const totalInventoryOnHand = variant.inventory_quantity || 0;

    const baseRow: Omit<MasterRowInsert, "status"> = {
      product_name: product.title,
      sku: variant.sku || `${product.handle}-${variant.id}`,
      vendor: product.vendor || null,

      total_inventory_on_hand: totalInventoryOnHand,
      total_inventory_on_the_way: 0,
      incoming_total: 0,
      qty_coastal_cowgirl: 0,
      qty_salty_tails: 0,
      qty_central_valley: 0,
      new_qty_coastal_cowgirl: 0,
      new_qty_salty_tails: 0,
      new_qty_central_valley: 0,
      reorder_point: 0,

      product_type: product.product_type || null,
      product_category: product.product_type || null,
      category: null,
      reporting_category: null,

      description,
      sales_description: description,
      purchase_description: description,
      tags,

      single_parent_or_variant: "VARIANT",
      variant_name: variant.title === "Default Title" ? null : variant.title,
      variant_title: variant.title === "Default Title" ? null : variant.title,

      option1_name: optionNameByPosition.get(1) || null,
      option1_value:
        variant.option1 && variant.option1 !== "Default Title"
          ? variant.option1
          : null,
      option2_name: optionNameByPosition.get(2) || null,
      option2_value:
        variant.option2 && variant.option2 !== "Default Title"
          ? variant.option2
          : null,
      option3_name: optionNameByPosition.get(3) || null,
      option3_value:
        variant.option3 && variant.option3 !== "Default Title"
          ? variant.option3
          : null,
      option4_name: null,
      option4_value: null,

      handle: product.handle,
      permalink: null,
      image_url: baseImageUrl,
      variant_image_url: variantImageUrl,
      square_image_id: null,

      price: variant.price ? Number(variant.price) : null,
      online_price: variant.price ? Number(variant.price) : null,
      cost: null, // Shopify doesn't send cost by default
      compare_at: variant.compare_at_price
        ? Number(variant.compare_at_price)
        : null,
      default_unit_cost: null,

      income_account: null,
      expense_account: null,
      inventory_asset_account: null,

      sales_tax_rate: null,
      tax_code: null,
      taxable: null,

      last_delivery_date: null,
      weight_lb: lbFromGrams(variant.grams),

      shipping_enabled: product.options?.length > 0 ? true : true,
      self_serve_ordering_enabled: false,
      delivery_enabled: false,
      pickup_enabled: false,

      stock_alert_enabled_cc: false,
      stock_alert_count_cc: 0,
      stock_alert_enabled_st: false,
      stock_alert_count_st: 0,
      stock_alert_enabled_cv: false,
      stock_alert_count_cv: 0,

      total_quantity: totalInventoryOnHand,
      current_qty_cc: 0,
      current_qty_st: 0,
      current_qty_cv: 0,
      quantity_as_of_date: new Date().toISOString().slice(0, 10),

      parent_sku: null,
      barcode: variant.barcode || null,
      gtin: null,
      vendor_code: null,

      sellable: true,
      stockable: true,
      contains_alcohol: false,
      skip_pos_detail: false,

      shopify_product_id: product.id,
      shopify_variant_id: variant.id,
      variants_json: product.variants,
      square_object_id: null,
      square_variation_id: null,
      stock_json: null,
      quickbooks_id: null,
      booker_id: null,

      seo_title: null,
      seo_description: null,

      archived: false,
      archive_reason: null,
      archived_timestamp: null,

      master_id: null
    };

    const status = computeStatus({
      archived: baseRow.archived,
      description: baseRow.description,
      product_name: baseRow.product_name,
      price: baseRow.price
    });

    return {
      status,
      ...baseRow
    };
  });
}
