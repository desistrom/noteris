import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../../lib/db.js';
import { users, sessions } from '../../lib/schema.js';
import { lucia } from '../../lib/auth.js';
import { hashPassword, verifyPassword } from '../../lib/password.js';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';

const auth = new Hono();

// Register endpoint
auth.post('/register', zValidator('json', z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['admin', 'super_admin']).optional()
})), async (c) => {
  try {
    const { email, password, name, role = 'admin' } = c.req.valid('json');

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (existingUser) {
      return c.json({ error: 'Email already registered' }, 400);
    }

    const userId = generateIdFromEntropySize(15);
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

// Login endpoint
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

// Logout endpoint
auth.post('/logout', async (c) => {
  try {
    const sessionId = c.get('session');
    
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

// Get current user
auth.get('/me', async (c) => {
  try {
    const sessionId = c.get('session');
    
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

    return c.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Failed to get user' }, 500);
  }
});

export default auth;
