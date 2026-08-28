import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../../lib/db.js';
import { users } from '../../lib/schema.js';
import { lucia } from '../../lib/auth.js';
import { hashPassword, verifyPassword } from '../../lib/password.js';
import { eq } from 'drizzle-orm';
import { authenticate } from '../middleware/auth.js';

const auth = new Hono();

auth.post('/register', zValidator('json', z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['admin', 'super_admin']).optional()
})), async (c) => {
  try {
    const { email, password, name, role = 'admin' } = c.req.valid('json');

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (existingUser) {
      return c.json({ error: 'Email already registered' }, 400);
    }

    const userId = crypto.randomUUID();
    const hashedPassword = await hashPassword(password);

    await db.insert(users).values({
      id: userId,
      email,
      name,
      passwordHash: hashedPassword,
      role
    });

    return c.json({ message: 'User registered successfully', userId }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return c.json({ error: 'Failed to register user' }, 500);
  }
});

auth.post('/login', zValidator('json', z.object({
  email: z.string().email(),
  password: z.string().min(1)
})), async (c) => {
  try {
    const { email, password } = c.req.valid('json');

    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const validPassword = await verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    c.header('Set-Cookie', sessionCookie.serialize(), { append: true });

    return c.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Failed to login' }, 500);
  }
});

auth.post('/logout', async (c) => {
  try {
    const cookie = c.req.header('Cookie');
    const sessionId = cookie?.match(/auth_session=([^;]+)/)?.[1];

    if (sessionId) {
      await lucia.invalidateSession(sessionId);
    }

    c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize(), { append: true });
    return c.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({ error: 'Failed to logout' }, 500);
  }
});

auth.get('/me', authenticate, async (c) => {
  const user = c.get('user');
  return c.json({ user });
});

export default auth;
