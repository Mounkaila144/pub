# Laravel 10 API with JWT Authentication

## Installation

1. Install dependencies
```bash
composer install
```

2. Copy environment file
```bash
cp .env.example .env
```

3. Generate application key
```bash
php artisan key:generate
```

4. Generate JWT secret
```bash
php artisan jwt:secret
```

5. Configure database in `.env` file
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

6. Run migrations
```bash
php artisan migrate
```

7. Link storage
```bash
php artisan storage:link
```

## Development

Start the development server:
```bash
php artisan serve
```

## Configuration

- JWT authentication is configured with `php-open-source-saver/jwt-auth`
- CORS is configured to allow requests from `FRONTEND_URL` environment variable
- Middlewares available: `jwt.auth`, `jwt.refresh`
- Default guard is set to `api` (JWT)

## File Uploads

The application handles file uploads for:
- Author photos (stored in `storage/app/public/authors/`)
- Book covers (stored in `storage/app/public/books/`)

Upload limits:
- Author photos: 3MB max
- Book covers: 5MB max

Supported formats: JPEG, PNG, GIF, WebP

## Environment Variables

Required environment variables:
- `FRONTEND_URL` - Frontend application URL for CORS
- `JWT_SECRET` - JWT secret key (generated automatically)
- `ADMIN_NAME` - Default admin user name
- `ADMIN_EMAIL` - Default admin email
- `ADMIN_PASSWORD` - Default admin password