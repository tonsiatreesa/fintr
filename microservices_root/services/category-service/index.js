const { Hono } = require("hono");
const { serve } = require("@hono/node-server");

const app = new Hono();

// Health check
app.get("/health", (c) => {
  return c.json({ 
    status: "ok", 
    service: "category-service",
    timestamp: new Date().toISOString()
  });
});

// Mock endpoints for testing
app.get("/", (c) => {
  return c.json({ 
    data: [
      { id: "1", name: "Food & Dining" },
      { id: "2", name: "Shopping" },
      { id: "3", name: "Transportation" }
    ],
    message: "Category service is running" 
  });
});

const port = process.env.PORT || 4004;

console.log(`Category Service running on port ${port}`);
serve({
  fetch: app.fetch,
  port,
});

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
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(eq(categories.userId, auth.userId));

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
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(
        and(
          eq(categories.userId, auth.userId),
          eq(categories.id, id)
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
  zValidator("json", insertCategorySchema.pick({
    name: true,
  })),
  async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [data] = await db.insert(categories).values({
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
      .delete(categories)
      .where(
        and(
          eq(categories.userId, auth.userId),
          inArray(categories.id, values.ids)
        )
      )
      .returning({
        id: categories.id,
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
    insertCategorySchema.pick({
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
      .update(categories)
      .set(values)
      .where(
        and(
          eq(categories.userId, auth.userId),
          eq(categories.id, id),
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
      .delete(categories)
      .where(
        and(
          eq(categories.userId, auth.userId),
          eq(categories.id, id),
        ),
      )
      .returning({
        id: categories.id,
      });

    if (!data) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json({ data });
  },
);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "category-service" });
});

const port = process.env.PORT || 4004;

console.log(`Category Service running on port ${port}`);
serve({
  fetch: app.fetch,
  port,
});
