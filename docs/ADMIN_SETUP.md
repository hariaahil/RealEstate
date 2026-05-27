# Admin Setup (Manual, Secure)

Admins are **never** created via public signup. All users default to `customer`.

## Promote existing user to admin
```sql
update public.users
set role = 'admin'
where email = 'admin@example.com';
```

## Users table and role model
```sql
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique,
  phone text,
  avatar text,
  role text not null default 'customer' check (role in ('customer','agent','admin')),
  status text not null default 'active' check (status in ('active','blocked')),
  created_at timestamptz not null default now()
);
```

## Security rules
- Never expose admin signup routes.
- Never allow frontend role updates.
- Only server/admin flows may assign agent/admin role.
