# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Laravel 10 publishing house API backend built with PHP 8.2+ featuring JWT authentication, file uploads, and a complete CRUD system for authors and books. The API serves as the backend for a French publishing platform called "Success Publishing".

## Development Commands

**Setup and Installation:**
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate
php artisan storage:link
```

**Development Server:**
```bash
php artisan serve
```

**Testing:**
```bash
# Run all tests
vendor/bin/phpunit

# Run specific test suite
vendor/bin/phpunit tests/Feature
vendor/bin/phpunit tests/Unit

# Run single test file
vendor/bin/phpunit tests/Feature/AuthTest.php
```

**Code Quality:**
```bash
# Laravel Pint (code formatting)
vendor/bin/pint

# Check code without fixing
vendor/bin/pint --test
```

**Database Operations:**
```bash
# Fresh migration with seeding
php artisan migrate:fresh --seed

# Create migration
php artisan make:migration create_table_name

# Create model with migration
php artisan make:model ModelName -m
```

## Architecture Overview

### Core Entities and Relationships
- **Users**: Admin authentication with JWT tokens
- **Authors**: Publishing house authors with photos, bio, and social links
- **Books**: Publications with covers, multiple authors via pivot table
- **Author-Book**: Many-to-many relationship with contribution roles and ordering

### API Structure
**Public Routes** (`/api/public/`):
- GET authors and books with filtering, search, pagination
- No authentication required

**Admin Routes** (`/api/admin/`):
- Full CRUD operations for authors and books
- File upload endpoints for photos/covers
- Author-book relationship management
- JWT authentication required

**Authentication** (`/api/auth/`):
- JWT-based authentication with refresh tokens
- Custom middlewares: `jwt.auth`, `jwt.refresh`

### Key Components

**Models:**
- All models use UUID slugs auto-generated from names/titles
- Soft deletes enabled for Author and Book models
- Pivot table includes contribution_role and contribution_order
- Accessors for full_name (Author) and URL generation for uploaded files

**Form Requests:**
- Separate Store/Update requests with validation rules
- ISBN format validation (10/13 digits)
- File upload validation (size limits, image types)
- Author relationship validation for books

**Resources:**
- Consistent JSON API responses with pagination metadata
- Authors sorted by contribution_order in book responses
- Collection classes with standardized pagination structure

**File Management:**
- Photos stored in `storage/app/public/authors/`
- Covers stored in `storage/app/public/books/`
- UUID-based filenames to prevent conflicts
- Automatic cleanup of old files on replacement

### Configuration Notes

**JWT Configuration:**
- Default guard set to 'api' (JWT)
- Custom JWT middlewares in `app/Http/Kernel.php`
- Token expiry and refresh handling

**CORS Setup:**
- Configured for specific frontend URL via `FRONTEND_URL` environment variable
- Allows GET/POST/PUT/DELETE methods
- Authorization and Content-Type headers permitted

**File Storage:**
- Public disk configured for file serving via `/storage` symlink
- Rate limiting: 60 req/min public, 120 req/min admin
- Upload size limits: 3MB photos, 5MB covers

### Database Schema Key Points
- Users table has `is_admin` boolean (default true)
- Authors have unique slugs, JSON socials field, soft deletes
- Books have enum status (draft/published), multiple ISBN fields
- Pivot table uses composite primary key (author_id, book_id)
- Indexes on frequently queried fields (slug, status, language, publication_date)

### Environment Variables
Essential variables beyond standard Laravel config:
- `FRONTEND_URL`: CORS configuration
- `JWT_SECRET`: Auto-generated JWT key
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`: Default admin user data