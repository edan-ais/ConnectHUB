// /netlify/functions/_merge.ts

export async function upsertProductFromShopify(shopProduct: any, supabase: any) {
  const base = shopProduct.variants?.[0] ?? {};

  const product = {
    shopify_id: shopProduct.id,
    sku: base.sku || null,
    name: shopProduct.title,
    description: shopProduct.body_html,
    image_url: shopProduct.image?.src ?? null,
    vendor: shopProduct.vendor,
    category: shopProduct.product_type,
    tags: shopProduct.tags ? shopProduct.tags.split(",") : [],
    updated_at: new Date().toISOString()
  };

  return await supabase.from("master_products").upsert(product, {
    onConflict: "shopify_id"
  });
}
