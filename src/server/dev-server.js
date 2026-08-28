import { serve } from '@hono/node-server';
import app from './index.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3001;

console.log(`Starting server on port ${port}...`);

serve({
  fetch: app.fetch,
  port: parseInt(port)
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
  console.log('API Endpoints:');
  console.log('  POST   /api/auth/register     - Register new user');
  console.log('  POST   /api/auth/login        - Login user');
  console.log('  POST   /api/auth/logout       - Logout user');
  console.log('  GET    /api/auth/me           - Get current user');
  console.log('  GET    /api/templates         - Get all templates');
  console.log('  GET    /api/templates/:id     - Get template by ID');
  console.log('  GET    /api/templates/type/:type - Get template by type');
  console.log('  POST   /api/templates         - Create template (super_admin)');
  console.log('  PUT    /api/templates/:id     - Update template (super_admin)');
  console.log('  DELETE /api/templates/:id     - Delete template (super_admin)');
  console.log('  GET    /api/aktas             - Get all aktas');
  console.log('  GET    /api/aktas/:id         - Get akta by ID');
  console.log('  POST   /api/aktas             - Create akta');
  console.log('  PUT    /api/aktas/:id         - Update akta');
  console.log('  DELETE /api/aktas/:id         - Delete akta');
  console.log('  POST   /api/aktas/:id/progress - Update progress');
  console.log('  GET    /api/aktas/:id/history - Get progress history');
  console.log('  GET    /api/users             - Get all users (super_admin)');
  console.log('  GET    /api/users/:id         - Get user by ID');
  console.log('  POST   /api/users             - Create user (super_admin)');
  console.log('  PUT    /api/users/:id         - Update user (super_admin)');
  console.log('  DELETE /api/users/:id         - Delete user (super_admin)');
});
