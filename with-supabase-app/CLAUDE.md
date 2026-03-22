# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application using the App Router with Supabase for authentication and database. It's a starter template that demonstrates password-based authentication with Supabase SSR (Server-Side Rendering).

## Commands

### Development
```bash
npm run dev       # Start development server on localhost:3000
npm run build     # Build production bundle
npm start         # Start production server
npm run lint      # Run ESLint
```

### Package Manager
This project uses npm. Package dependencies are listed in `package.json`.

## Environment Setup

Required environment variables (copy `.env.example` to `.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Your Supabase publishable/anon key

Find these values in your Supabase project's API settings.

## Architecture

### Supabase Client Patterns

The codebase uses three distinct Supabase client creation patterns depending on context:

1. **Server Components** (`lib/supabase/server.ts`):
   - Uses `createServerClient` from `@supabase/ssr`
   - Accesses Next.js cookies via `cookies()` from `next/headers`
   - **CRITICAL**: Always create a new client within each function (never use global variables) for Fluid compute compatibility
   - Handles cookie operations with try-catch for Server Component edge cases

2. **Client Components** (`lib/supabase/client.ts`):
   - Uses `createBrowserClient` from `@supabase/ssr`
   - Simple browser-based client for client-side operations

3. **Middleware/Proxy** (`lib/supabase/proxy.ts`):
   - Uses `createServerClient` configured for Next.js middleware
   - Handles session refresh and authentication state
   - **CRITICAL**: Must call `supabase.auth.getClaims()` immediately after creating the client to prevent random logouts
   - Redirects unauthenticated users to `/auth/login` (except for auth routes)
   - Must return the supabaseResponse object with cookies intact

### Routing Structure

- `/` - Public landing page
- `/auth/*` - Authentication pages (login, sign-up, forgot-password, etc.)
- `/auth/confirm/route.ts` - Email confirmation handler (verifies OTP tokens)
- `/protected/*` - Protected routes requiring authentication

### Middleware/Proxy

The `proxy.ts` file at the root exports a `proxy` function that calls `updateSession` from `lib/supabase/proxy.ts`. This runs on all requests except static assets and handles:
- Session refresh via cookies
- Authentication state validation
- Automatic redirects for unauthenticated users

### UI Components

- Built with **shadcn/ui** components (configured in `components.json`)
- Styling: **Tailwind CSS** with `new-york` style
- Theme: **next-themes** with system, light, and dark modes
- Icons: **lucide-react**
- Path aliases configured as `@/*` for imports

### Component Organization

- `components/` - Application-specific components (auth forms, navigation, etc.)
- `components/ui/` - Reusable shadcn/ui primitives (button, card, input, etc.)
- `components/tutorial/` - Tutorial and onboarding components

### Utilities

- `lib/utils.ts` - Contains:
  - `cn()` - Tailwind class merging utility using `clsx` and `tailwind-merge`
  - `hasEnvVars` - Checks if required Supabase env vars are set

## Key Implementation Notes

### Authentication Flow

1. User submits credentials via form components (login-form, sign-up-form, etc.)
2. Forms call Supabase client methods (signIn, signUp, resetPassword)
3. Email confirmations are handled via `/auth/confirm` route handler
4. Protected routes check authentication in the proxy middleware
5. Auth state is available across Server Components, Client Components, Route Handlers, and Server Actions via cookie-based sessions

### Protected Routes

The `/protected` directory has its own layout (`app/protected/layout.tsx`) that includes:
- Navigation bar with auth button
- Environment variable warnings
- Theme switcher in footer

### TypeScript Configuration

- Target: ES2017
- JSX: react-jsx
- Path aliases: `@/*` maps to project root
- Strict mode enabled

## Important Patterns

### Creating Supabase Clients

Always use the appropriate client creation pattern:
- Server Components: `const supabase = await createClient()` from `@/lib/supabase/server`
- Client Components: `const supabase = createClient()` from `@/lib/supabase/client`
- Never store Supabase clients in global variables

### Cookie Handling

When working with the proxy/middleware:
- Always return the supabaseResponse object with cookies intact
- If creating a new NextResponse, copy cookies: `newResponse.cookies.setAll(supabaseResponse.cookies.getAll())`
- Do not run code between `createServerClient` and `supabase.auth.getClaims()`

### Adding shadcn/ui Components

Use the shadcn CLI to add components:
```bash
npx shadcn@latest add [component-name]
```

Components are configured with the "new-york" style and will be added to `components/ui/`.
