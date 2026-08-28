import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import auth from './routes/auth.js';
import templates from './routes/templates.js';
import aktas from './routes/aktas.js';
import usersRouter from './routes/users.js';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use('*', secureHeaders());

// Session middleware helper
app.use('/api/*', async (c, next) => {
  const cookie = c.req.header('Cookie');
  if (cookie) {
    const sessionMatch = cookie.match(/auth_session=([^;]+)/);
    if (sessionMatch && sessionMatch[1]) {
      c.set('session', sessionMatch[1]);
    }
  }
  await next();
});

// Routes
app.route('/api/auth', auth);
app.route('/api/templates', templates);
app.route('/api/aktas', aktas);
app.route('/api/users', usersRouter);

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({ error: err.message || 'Internal server error' }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

export default app;
