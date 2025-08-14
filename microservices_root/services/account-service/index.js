const { Hono } = require("hono");
const { serve } = require("@hono/node-server");
const { z } = require("zod");
const { and, eq, inArray } = require("drizzle-orm");
const { createId } = require("@paralleldrive/cuid2");
const { zValidator } = require("@hono/zod-validator");
const { clerkMiddleware, getAuth } = require("@hono/clerk-auth");

// Import database dependencies
const { drizzle } = require("drizzle-orm/neon-http");
const { neon } = require("@neondatabase/serverless");
const { createInsertSchema } = require("drizzle-zod");
const { 
  integer, 
  pgTable, 
  text, 
  timestamp,
} = require("drizzle-orm/pg-core");

// Database schema (inline for now)
const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

const insertAccountSchema = createInsertSchema(accounts);

// Database connection
const sql = neon(process.env.DATABASE_URL || "postgres://postgres:postgres@postgres:5432/fintr");
const db = drizzle(sql);

const app = new Hono();

app.get(
  "/",
  clerkMiddleware(),
  async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));

    return c.json({ data });
})

app.get(
  "/:id",
  zValidator("param", z.object({
    id: z.string().optional(),
  })),
  clerkMiddleware(),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    if (!id) {
      return c.json({ error: "Missing id" }, 400);
    }
    
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [data] = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(
        and(
          eq(accounts.userId, auth.userId),
          eq(accounts.id, id)
        ),
      );
    
    if (!data) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json({ data });
  }
)

app.post(
  "/",
  clerkMiddleware(),
  zValidator("json", insertAccountSchema.pick({
    name: true,
  })),
  async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [data] = await db.insert(accounts).values({
      id: createId(),
      userId: auth.userId,
      ...values,
    }).returning();

    return c.json({ data });
})

app.post(
  "/bulk-delete",
  clerkMiddleware(),
  zValidator(
    "json",
    z.object({
      ids: z.array(z.string()),
    }),
  ),
  async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db
      .delete(accounts)
      .where(
        and(
          eq(accounts.userId, auth.userId),
          inArray(accounts.id, values.ids)
        )
      )
      .returning({
        id: accounts.id,
      });

    return c.json({ data });
  },
)

app.patch(
  "/:id",
  clerkMiddleware(),
  zValidator(
    "param",
    z.object({
      id: z.string().optional(),
    }),
  ),
  zValidator(
    "json",
    insertAccountSchema.pick({
      name: true,
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");
    const values = c.req.valid("json");

    if (!id) {
      return c.json({ error: "Missing id" }, 400);
    }

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [data] = await db
      .update(accounts)
      .set(values)
      .where(
        and(
          eq(accounts.userId, auth.userId),
          eq(accounts.id, id),
        ),
      )
      .returning();

    if (!data) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json({ data });
  },
)

app.delete(
  "/:id",
  clerkMiddleware(),
  zValidator(
    "param",
    z.object({
      id: z.string().optional(),
    }),
  ),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    if (!id) {
      return c.json({ error: "Missing id" }, 400);
    }

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [data] = await db
      .delete(accounts)
      .where(
        and(
          eq(accounts.userId, auth.userId),
          eq(accounts.id, id),
        ),
      )
      .returning({
        id: accounts.id,
      });

    if (!data) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json({ data });
  },
);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "account-service" });
});

const port = process.env.PORT || 4002;

console.log(`Account Service running on port ${port}`);
serve({
  fetch: app.fetch,
  port,
});
