import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../../lib/db.js';
import { users } from '../../lib/schema.js';
import { eq } from 'drizzle-orm';
import { hashPassword } from '../../lib/password.js';
import { generateIdFromEntropySize } from 'lucia';

const usersRouter = new Hono();

// Get all users (super_admin only)
usersRouter.get('/', async (c) => {
  try {
    const allUsers = await db.query.users.findMany({
      columns: { passwordHash: false },
      orderBy: (users, { asc }) => [asc(users.createdAt)]
    });

    return c.json({ users: allUsers });
  } catch (error) {
    console.error('Get users error:', error);
    return c.json({ error: 'Failed to get users' }, 500);
  }
});

// Get user by ID
usersRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: { passwordHash: false }
    });

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Failed to get user' }, 500);
  }
});

// Create new user (super_admin only)
usersRouter.post('/', zValidator('json', z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['admin', 'super_admin'])
})), async (c) => {
  try {
    const { email, password, name, role } = c.req.valid('json');

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

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { passwordHash: false }
    });

    return c.json({ message: 'User created successfully', user }, 201);
  } catch (error) {
    console.error('Create user error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Update user (super_admin only)
usersRouter.put('/:id', zValidator('json', z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'super_admin']).optional(),
  password: z.string().min(6).optional()
})), async (c) => {
  try {
    const id = c.req.param('id');
    const data = c.req.valid('json');

    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, id)
    });

    if (!existingUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    const updateData = { ...data };
    
    // Hash password if provided
    if (data.password) {
      updateData.passwordHash = await hashPassword(data.password);
      delete updateData.password;
    }

    await db.update(users)
      .set(updateData)
      .where(eq(users.id, id));

    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: { passwordHash: false }
    });

    return c.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Update user error:', error);
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

// Delete user (super_admin only)
usersRouter.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, id)
    });

    if (!existingUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Prevent deleting super_admin if you're the only one
    if (existingUser.role === 'super_admin') {
      const superAdmins = await db.query.users.findMany({
        where: eq(users.role, 'super_admin')
      });
      
      if (superAdmins.length <= 1) {
        return c.json({ error: 'Cannot delete the last super admin' }, 400);
      }
    }

    await db.delete(users).where(eq(users.id, id));

    return c.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

export default usersRouter;
