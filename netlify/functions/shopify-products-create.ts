// /netlify/functions/shopify-products-create.ts
import type { Handler } from "@netlify/functions";
import { supabase } from "./_supabase-client";
import { verifyShopifyWebhook } from "./_verify-shopify";
import { upsertProductFromShopify } from "./_merge";

export const handler: Handler = async (event) => {
  const hmac = event.headers["x-shopify-hmac-sha256"];
  const body = event.body || "";

  if (!verifyShopifyWebhook(body, hmac)) {
    return { statusCode: 401, body: "Invalid Signature" };
  }

  const payload = JSON.parse(body);

  console.log("🟢 PRODUCT CREATE:", payload.id);

  const { error } = await upsertProductFromShopify(payload, supabase);
  if (error) console.error("Upsert error:", error);

  return { statusCode: 200, body: "ok" };
};
