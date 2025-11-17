// /netlify/functions/shopify-inventory-update.ts
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

  console.log("📦 INVENTORY UPDATE webhook received");

  const variantId = payload.inventory_item_id;
  const newQty = payload.available;

  // 1. Find product in Supabase
  const { data: product } = await supabase
    .from("master_products")
    .select("*")
    .eq("shopify_id", payload.product_id)
    .single();

  if (!product) {
    console.warn("No product found for inventory update");
    return { statusCode: 200, body: "ignored" };
  }

  const oldNewInventory = product.new_inventory;
  const oldOnHand = product.on_hand_inventory;

  let newNewInventory = oldNewInventory;
  let newOnHand = oldOnHand;

  if (newQty > oldNewInventory + oldOnHand) {
    // increase = new inventory purchased
    const delta = newQty - (oldNewInventory + oldOnHand);
    newNewInventory = oldNewInventory + delta;

    await supabase.from("inventory_events").insert({
      product_id: product.id,
      type: "purchase",
      quantity: delta,
      source: "Shopify"
    });
  }

  if (newQty === oldOnHand && oldNewInventory > 0) {
    // shipment received
    newOnHand = oldOnHand + oldNewInventory;
    newNewInventory = 0;

    await supabase.from("inventory_events").insert({
      product_id: product.id,
      type: "receive",
      quantity: oldNewInventory,
      source: "Shopify"
    });
  }

  // 2. Update inventory
  await supabase
    .from("master_products")
    .update({
      new_inventory: newNewInventory,
      on_hand_inventory: newOnHand,
      updated_at: new Date().toISOString()
    })
    .eq("id", product.id);

  return { statusCode: 200, body: "ok" };
};
