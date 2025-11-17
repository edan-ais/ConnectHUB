// /netlify/functions/shopify-order-create.ts
import type { Handler } from "@netlify/functions";
import { supabase } from "./_supabase-client";
import { verifyShopifyWebhook } from "./_verify-shopify";

export const handler: Handler = async (event) => {
  const hmac = event.headers["x-shopify-hmac-sha256"];
  const body = event.body || "";

  if (!verifyShopifyWebhook(body, hmac)) {
    return { statusCode: 401, body: "Invalid Signature" };
  }

  const payload = JSON.parse(body);

  console.log("🛒 ORDER CREATE:", payload.id);

  for (const line of payload.line_items) {
    const sku = line.sku;
    const qty = line.quantity;

    // Find product by SKU
    const { data: product } = await supabase
      .from("master_products")
      .select("*")
      .eq("sku", sku)
      .single();

    if (!product) continue;

    const newOnHand = Math.max(0, product.on_hand_inventory - qty);

    await supabase
      .from("master_products")
      .update({
        on_hand_inventory: newOnHand,
        updated_at: new Date().toISOString()
      })
      .eq("id", product.id);

    await supabase.from("inventory_events").insert({
      product_id: product.id,
      type: "sale",
      quantity: qty,
      source: "Shopify"
    });
  }

  return { statusCode: 200, body: "ok" };
};
