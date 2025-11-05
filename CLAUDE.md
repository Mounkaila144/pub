# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack publishing house platform for "Success Publishing" (French publishing house) consisting of:
- **Frontend**: Next.js 13.5.1 with TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend**: Laravel 10 API with JWT authentication (located in `pubbackend/`)
- **Hybrid Architecture**: Static public site + dynamic admin panel

## Development Commands

**Frontend (Next.js):**
```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production (static export)
npm run start            # Start production server
npm run lint             # Run ESLint
```

**Backend (Laravel):**
```bash
cd pubbackend
composer install         # Install PHP dependencies
php artisan serve        # Start API server (http://localhost:8000)
php artisan migrate      # Run database migrations
vendor/bin/phpunit       # Run tests
```

See `pubbackend/CLAUDE.md` for detailed Laravel backend documentation.

## Architecture Overview

### Dual Architecture Pattern
The application uses a hybrid approach:
1. **Public Pages**: Static export for SEO and performance (home page, book listings)
2. **Admin Panel**: Client-side dynamic routes with API integration (`app/(admin)/`)

This allows static deployment for public content while maintaining a full-featured admin dashboard.

### Frontend Stack
- **Next.js 13.5.1** with App Router
- **TypeScript** (strict mode)
- **TanStack Query (React Query)** for server state management
- **Axios** for API requests with interceptors
- **shadcn/ui** components built on Radix UI
- **Tailwind CSS** with CSS variables theming
- **Zod** for validation schemas
- **Sonner** for toast notifications

### Project Structure
```
/
├── app/
│   ├── (admin)/              # Admin panel (route group, no URL segment)
│   │   ├── layout.tsx        # Admin layout with AuthGuard
│   │   └── admin/            # Admin routes (/admin/*)
│   │       ├── page.tsx      # Dashboard with stats
│   │       ├── livres/       # Books management
│   │       ├── auteurs/      # Authors management
│   │       └── partenaires/  # Partners management
│   ├── login/                # Login page
│   ├── layout.tsx            # Root layout (fonts, providers)
│   ├── page.tsx              # Public home page
│   └── globals.css           # Global styles + CSS variables
├── components/
│   ├── ui/                   # shadcn/ui primitives (button, dialog, etc.)
│   ├── admin/                # Admin-specific components
│   ├── auth/                 # Authentication components (AuthGuard)
│   ├── providers/            # React providers (QueryProvider)
│   └── *.tsx                 # Public page sections (Header, Hero, etc.)
├── lib/
│   ├── api/                  # API client functions (axios instances)
│   │   ├── axios.ts          # Base axios config
│   │   ├── auth.ts           # Auth endpoints
│   │   ├── books.ts          # Books CRUD
│   │   ├── authors.ts        # Authors CRUD
│   │   └── partners.ts       # Partners CRUD
│   ├── hooks/                # React Query hooks (use-*)
│   ├── utils/                # Utility functions
│   │   ├── token.ts          # JWT token storage
│   │   └── currency.ts       # Currency formatting
│   ├── validations/          # Zod schemas
│   ├── query-client.ts       # TanStack Query config
│   └── utils.ts              # cn() utility
├── data/                     # Static JSON files (authors, books, etc.)
├── pubbackend/               # Laravel API backend
└── public/                   # Static assets
```

### Key Architectural Patterns

**Authentication Flow:**
1. Login page (`app/login/page.tsx`) authenticates via Laravel JWT API
2. Token stored in localStorage via `tokenStorage` utility (`lib/utils/token.ts`)
3. `AuthGuard` component wraps admin routes, validates token via `/auth/me` endpoint
4. Axios interceptors can add Authorization headers (currently commented out)

**Data Fetching Pattern:**
- TanStack Query for all API calls (5-minute stale time, 1 retry)
- Custom hooks in `lib/hooks/` wrap API calls (e.g., `use-books.ts`, `use-authors.ts`)
- API functions in `lib/api/` return typed responses
- Query client configured in `lib/query-client.ts`

**Admin Panel Structure:**
- Protected by `AuthGuard` in `app/(admin)/layout.tsx`
- Admin header with navigation and logout
- CRUD operations for books, authors, partners
- File uploads for book covers and author photos (compressed via `browser-image-compression`)
- Optimistic updates and cache invalidation via React Query

**Form Handling:**
- `react-hook-form` with Zod resolvers for validation
- Reusable form components from shadcn/ui
- Server-side validation from Laravel API
- Toast notifications via Sonner for feedback

**Image Handling:**
- Public site: External URLs (static export compatible)
- Admin panel: File uploads compressed client-side before sending to Laravel
- `lib/image-compression.ts` handles compression logic

### Design System
- **Fonts**: Playfair Display (serif headings) + Inter (sans-serif body)
- **Theme**: CSS variables in `app/globals.css` with dark mode support
- **Colors**: HSL-based semantic tokens (primary, secondary, accent, etc.)
- **Components**: All UI from shadcn/ui (Radix UI + Tailwind)
- **Custom styles**: `styles/ocean-theme.css` for additional theming

### Environment Configuration
Required environment variables (`.env`):
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

The API base URL points to the Laravel backend. Ensure the backend is running before starting the frontend development server.

### Path Aliases
TypeScript path mapping (`@/*` → `./`):
- `@/components` → `./components`
- `@/lib` → `./lib`
- `@/hooks` → `./hooks`
- `@/data` → `./data`
- `@/app` → `./app`

## Important Notes

**Static Export Limitations:**
- `next.config.js` has `output: 'export'` for public pages
- Admin routes use client-side rendering (`"use client"`)
- No Next.js Image optimization (images unoptimized)
- No server-side API routes

**Backend Integration:**
- Frontend expects Laravel API on `NEXT_PUBLIC_API_BASE_URL`
- See `pubbackend/CLAUDE.md` for API documentation
- CORS configured in Laravel for frontend origin

**Development Workflow:**
1. Start Laravel backend: `cd pubbackend && php artisan serve`
2. Start Next.js frontend: `npm run dev`
3. Access public site at `http://localhost:3000`
4. Access admin panel at `http://localhost:3000/admin` (requires login)

**Build Notes:**
- ESLint disabled during builds (`ignoreDuringBuilds: true`)
- Build produces static HTML for public pages
- Admin routes remain client-rendered SPAs
- French language content throughout