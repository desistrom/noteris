import { lucia } from '../../lib/auth.js';
import { db } from '../../lib/db.js';
import { users } from '../../lib/schema.js';
import { eq } from 'drizzle-orm';

export async function authenticate(c, next) {
  const cookie = c.req.header('Cookie');
  const sessionId = cookie?.match(/auth_session=([^;]+)/)?.[1];

  if (!sessionId) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  const session = await lucia.validateSession(sessionId);

  if (!session || !session.user) {
    return c.json({ error: 'Invalid session' }, 401);
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { passwordHash: false }
  });

  if (!user) {
    return c.json({ error: 'User not found' }, 401);
  }

  c.set('user', user);
  await next();
}

export function requireRole(...roles) {
  return async (c, next) => {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401);
    }
    if (!roles.includes(user.role)) {
      return c.json({ error: 'Forbidden: insufficient permissions' }, 403);
    }
    await next();
  };
}
