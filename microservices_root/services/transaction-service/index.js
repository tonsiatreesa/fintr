const { Hono } = require('hono');
const { serve } = require('@hono/node-server');

const app = new Hono();

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'transaction-service',
    timestamp: new Date().toISOString()
  });
});

// Mock transactions endpoints
app.get('/api/transactions', (c) => {
  return c.json({
    data: [
      { id: '1', amount: -100, payee: 'Test Store', category: 'Food', date: '2024-01-01' },
      { id: '2', amount: -50, payee: 'Gas Station', category: 'Transportation', date: '2024-01-02' }
    ]
  });
});

app.post('/api/transactions', (c) => {
  return c.json({ message: 'Transaction created', id: 'new-transaction-id' });
});

const port = process.env.PORT || 4003;

console.log(`Transaction service starting on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
