# Notaris App - Aplikasi Pemantauan Progres Akta Notaris

Aplikasi berbasis web untuk pemantauan progres dan pencatatan pembuatan/perubahan akta melalui notaris.

## Fitur Utama

- **Authentication**: Login/Register dengan Lucia Auth + Neon.tech
- **Role-based Access**: Admin dan Super Admin
- **Template Management**: Kelola template akta dengan field dinamis (Super Admin)
- **Akta CRUD**: Buat, lihat, update, hapus akta
- **Progress Tracking**: Monitor progres pembuatan akta per stage
- **Document Generation**: Template dokumen otomatis sesuai jenis akta

## Jenis Akta yang Didukung

### Pendirian Perusahaan
- Akta Pendirian PT
- Akta Pendirian Yayasan
- Akta Pendirian CV
- Akta Pendirian Koperasi
- Akta Perubahan Anggaran Dasar

### Transaksi Aset
- Akta Jual Beli Tanah
- Akta Jual Beli Properti
- Akta Jual Beli Kendaraan

### Perjanjian
- Perjanjian Kredit
- Perjanjian Sewa-menyewa
- Perjanjian Kerja Sama Bisnis
- Pengakuan Utang

### Waris dan Hibah
- Akta Hak Waris
- Akta Wasiat
- Akta Hibah

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Hono (Node.js)
- **Database**: Neon.tech (PostgreSQL)
- **ORM**: Drizzle ORM
- **Authentication**: Lucia Auth
- **Validation**: Zod

## Setup & Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd notaris-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` dan isi:
- `DATABASE_URL`: URL database dari Neon Console
- `SESSION_SECRET`: Random string minimal 32 karakter

### 4. Setup Database
```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Run migrations
npm run db:migrate
```

### 5. Run Development Server
```bash
npm run dev
```

Server akan berjalan di:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user baru |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### Templates (Super Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/templates` | Get semua templates |
| GET | `/api/templates/:id` | Get template by ID |
| GET | `/api/templates/type/:type` | Get template by type |
| POST | `/api/templates` | Create template |
| PUT | `/api/templates/:id` | Update template |
| DELETE | `/api/templates/:id` | Delete template |

### Aktas
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/aktas` | Get semua aktas (dengan pagination & filter) |
| GET | `/api/aktas/:id` | Get akta by ID |
| POST | `/api/aktas` | Create akta baru |
| PUT | `/api/aktas/:id` | Update akta |
| DELETE | `/api/aktas/:id` | Delete akta |
| POST | `/api/aktas/:id/progress` | Update progress stage |
| GET | `/api/aktas/:id/history` | Get progress history |

### Users (Super Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get semua users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

## Database Schema

### Tables
- `users` - User accounts (admin, super_admin)
- `sessions` - Session management untuk auth
- `akta_templates` - Template struktur akta
- `template_fields` - Field dinamis per template
- `aktas` - Data akta yang dibuat
- `progress_history` - History progress per akta

## Default Roles

- **super_admin**: Full access (kelola templates, users, aktas)
- **admin**: Manage aktas dan progress saja

### Akun Default (dari `npm run db:seed`)

Akun dibuat otomatis oleh `src/server/seed.js` jika tabel `users` kosong. Password diambil dari env `SEED_PASSWORD` atau default `password123`. Jalankan setelah setup database:

```bash
npm run db:seed
# atau dengan password custom: SEED_PASSWORD=rahasia123 npm run db:seed
```

| Role | Email | Password Default | Nama | Akses |
|------|-------|------------------|------|-------|
| super_admin | `admin@notaris.com` | `password123` / `$SEED_PASSWORD` | Super Admin | Full access: kelola templates, users, aktas |
| admin | `staff@notaris.com` | `password123` / `$SEED_PASSWORD` | Staff Admin | Kelola aktas & progress saja |

> **Catatan Keamanan:** Segera ganti password setelah login pertama, terutama di production. Jangan commit password asli ke repository.

Contoh login:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@notaris.com","password":"password123"}'
```

## Development Commands

```bash
npm run dev          # Run frontend + backend concurrently
npm run dev:client   # Run frontend only
npm run dev:server   # Run backend only
npm run build        # Build production bundle
npm run preview      # Preview production build
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

## License

MIT
