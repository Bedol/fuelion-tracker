# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fuelion Tracker** (refuel-tracker) is a Next.js web application for tracking vehicle fuel consumption, expenses, and maintenance. Built with TypeScript, Chakra UI, and PostgreSQL with Prisma ORM.

## Development Commands

### Core Development
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with auto-fix
- `npm run prettier` - Format code with Prettier

### Database Management
- `npx prisma generate` - Generate Prisma client after schema changes
- `npx prisma db push` - Push schema changes to database
- `npx prisma migrate dev` - Create and apply new migration
- `npx prisma studio` - Open Prisma Studio for database GUI
- `docker-compose up -d` - Start PostgreSQL and pgAdmin containers

### Testing and Quality
- Code is automatically linted and formatted on commit via lint-staged
- Always run `npm run lint` after making changes to ensure code quality
- Use conventional commit messages (enforced by commitlint)

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 15 with React 19, TypeScript, Chakra UI, Tailwind CSS
- **Backend**: Next.js API routes with NextAuth.js authentication
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React Query for server state, Formik for forms
- **Authentication**: NextAuth.js with Google OAuth and JWT sessions

### Project Structure

#### Database Schema (Prisma)
Core entities with relationships:
- **User** - Authentication and preferences (1:N with Vehicle)
- **Vehicle** - Vehicle information (1:N with Fueling, Expense)
- **Fueling** - Fuel purchase records with consumption data
- **Expense** - Additional vehicle-related costs
- **Account/Session** - NextAuth.js authentication tables

#### Pages Structure (Next.js Pages Router)
```
pages/
├── _app.tsx               # App wrapper with Chakra UI and auth providers
├── index.tsx             # Landing page
├── api/                  # API routes
│   ├── auth/[...nextauth].ts  # NextAuth configuration
│   ├── vehicles/         # Vehicle CRUD operations
│   └── fueling/          # Fueling data operations
├── vehicles/             # Vehicle management
├── expenses/             # Expense tracking
└── auth/                 # Authentication pages
```

#### Component Organization
- **Layout.tsx** - Main app layout with header/sidebar
- **components/vehicles/** - Vehicle-specific components
- **components/fueling/** - Fuel tracking components
- **components/statistics/** - Data visualization
- **components/Form/** - Reusable form components

### Key Configuration Files
- **prisma/schema.prisma** - Database schema definition
- **pages/api/auth/[...nextauth].ts** - Authentication configuration
- **lib/prisma.ts** - Prisma client setup
- **docker-compose.yml** - PostgreSQL development environment

## Development Patterns

### Database Operations
- Use Prisma Client for all database operations
- Always include proper error handling for database queries
- Use transactions for multi-table operations
- Follow cascade delete patterns defined in schema

### API Routes
- Validate request methods (GET, POST, PUT, DELETE)
- Use proper HTTP status codes
- Include error handling and validation
- Return consistent JSON response formats

### Component Development
- Use Chakra UI components for consistency
- Implement proper loading and error states
- Use React Query for data fetching with caching
- Follow existing form validation patterns with Formik

### Authentication
- Check authentication status using NextAuth hooks
- Protect API routes with session validation
- Handle unauthorized access gracefully
- Use user ID from session for data filtering

## Important Development Notes

- The app uses Pages Router (not App Router)
- Database foreign keys have cascade deletes configured
- All timestamps use PostgreSQL DateTime types
- Country/region data uses ISO codes (2-char for countries)
- Mileage and fuel quantities are stored as Float values
- Currency and measurement units are stored as integer IDs referencing lookup tables