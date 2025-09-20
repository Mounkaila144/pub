# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 13.5.1 publishing house website built with TypeScript, Tailwind CSS, and shadcn/ui components. The site is configured for static export and represents "Success Publishing" - a French publishing house platform.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (static export)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Framework & Configuration
- **Next.js 13.5.1** with App Router (`app/` directory)
- **Static Export**: Configured with `output: 'export'` in `next.config.js`
- **TypeScript**: Strict mode enabled with path aliases (`@/*` maps to root)
- **Styling**: Tailwind CSS with shadcn/ui design system

### Project Structure
```
/
├── app/              # Next.js App Router
│   ├── globals.css   # Global styles with CSS variables
│   ├── layout.tsx    # Root layout with font configuration
│   └── page.tsx      # Home page with all sections
├── components/       # React components
│   ├── ui/          # shadcn/ui components (accordion, button, etc.)
│   └── *.tsx        # Custom sections (Header, Hero, Footer, etc.)
├── data/            # JSON data files
│   ├── authors.json
│   ├── books.json
│   ├── partners.json
│   └── testimonials.json
├── hooks/           # Custom React hooks
├── lib/             # Utilities
│   └── utils.ts     # cn() utility for class merging
├── node_modules/    # Dependencies
└── .bolt/           # Bolt-specific files
```

### Key Components
The main page is composed of modular sections:
- `Header` - Navigation and branding
- `Hero` - Main landing section
- `StepsPublish` - Publishing process steps
- `BooksGrid` - Featured books display
- `AuthorsGrid` - Featured authors
- `PartnersGrid` - Publishing partners
- `Testimonials` - Customer testimonials
- `CTASection` - Call-to-action
- `Footer` - Site footer

### Design System
- **shadcn/ui**: Complete UI component library with consistent styling
- **Fonts**: Playfair Display (serif) and Inter (sans-serif) with CSS variables
- **Theme**: CSS variables-based theming system with dark mode support
- **Colors**: HSL-based color system with semantic naming
- **Components**: All UI components follow Radix UI patterns

### Data Management
Static JSON files in `data/` directory contain:
- Books with metadata (title, author, genre, rating, cover images)
- Author profiles and information
- Partner/publisher information
- Customer testimonials

### Path Aliases
- `@/components` → `./components`
- `@/lib` → `./lib`
- `@/hooks` → `./hooks`
- `@/data` → `./data`

## Important Notes
- Site is configured for static export - avoid server-side features
- All images use external URLs (Pexels) due to static export
- ESLint is disabled during builds (`ignoreDuringBuilds: true`)
- French language content throughout the application