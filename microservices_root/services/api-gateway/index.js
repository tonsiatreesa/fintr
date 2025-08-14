const { Hono } = require("hono");
const { serve } = require("@hono/node-server");

const app = new Hono();

// Service URLs - these would be environment variables in production
const ACCOUNT_SERVICE_URL = process.env.ACCOUNT_SERVICE_URL || "http://account-service:4002";
const TRANSACTION_SERVICE_URL = process.env.TRANSACTION_SERVICE_URL || "http://transaction-service:4003";
const CATEGORY_SERVICE_URL = process.env.CATEGORY_SERVICE_URL || "http://category-service:4004";
const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || "http://analytics-service:4005";
const PLAID_SERVICE_URL = process.env.PLAID_SERVICE_URL || "http://plaid-service:4006";
const SUBSCRIPTION_SERVICE_URL = process.env.SUBSCRIPTION_SERVICE_URL || "http://subscription-service:4007";

// Proxy function to forward requests to microservices
async function proxyRequest(c, serviceUrl, path) {
  try {
    const url = `${serviceUrl}${path}`;
    const method = c.req.method;
    const headers = {};
    
    // Forward auth headers
    const authHeader = c.req.header("authorization");
    if (authHeader) {
      headers["authorization"] = authHeader;
    }
    
    const body = method !== "GET" ? await c.req.text() : undefined;
    
    const response = await fetch(url, {
      method,
      headers: {
        ...headers,
        "content-type": "application/json",
      },
      body,
    });
    
    const responseData = await response.text();
    
    return c.text(responseData, response.status, {
      "content-type": "application/json",
    });
  } catch (error) {
    console.error(`Proxy error for ${serviceUrl}${path}:`, error);
    return c.json({ error: "Service unavailable" }, 503);
  }
}

// Route definitions
app.all("/api/accounts/*", async (c) => {
  const path = c.req.path.replace("/api/accounts", "");
  return proxyRequest(c, ACCOUNT_SERVICE_URL, path);
});

app.all("/api/transactions/*", async (c) => {
  const path = c.req.path.replace("/api/transactions", "");
  return proxyRequest(c, TRANSACTION_SERVICE_URL, path);
});

app.all("/api/categories/*", async (c) => {
  const path = c.req.path.replace("/api/categories", "");
  return proxyRequest(c, CATEGORY_SERVICE_URL, path);
});

app.all("/api/summary/*", async (c) => {
  const path = c.req.path.replace("/api/summary", "");
  return proxyRequest(c, ANALYTICS_SERVICE_URL, path);
});

app.all("/api/plaid/*", async (c) => {
  const path = c.req.path.replace("/api/plaid", "");
  return proxyRequest(c, PLAID_SERVICE_URL, path);
});

app.all("/api/subscriptions/*", async (c) => {
  const path = c.req.path.replace("/api/subscriptions", "");
  return proxyRequest(c, SUBSCRIPTION_SERVICE_URL, path);
});

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "api-gateway" });
});

const port = process.env.PORT || 4000;

console.log(`API Gateway running on port ${port}`);
serve({
  fetch: app.fetch,
  port,
});
