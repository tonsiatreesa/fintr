import { hc } from "hono/client";

// Point to API Gateway instead of local routes
const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:4000";

export const client = hc(API_GATEWAY_URL);
