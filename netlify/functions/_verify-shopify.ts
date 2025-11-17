// /netlify/functions/_verify-shopify.ts
import crypto from "crypto";

export function verifyShopifyWebhook(body: string, hmacHeader: string | undefined): boolean {
  if (!hmacHeader || !process.env.SHOPIFY_WEBHOOK_SECRET) {
    console.error("Missing Shopify secret or HMAC header");
    return false;
  }

  const generatedHash = crypto
    .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET)
    .update(body, "utf8")
    .digest("base64");

  return crypto.timingSafeEqual(Buffer.from(generatedHash), Buffer.from(hmacHeader));
}
