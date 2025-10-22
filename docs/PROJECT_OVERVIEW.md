# Project Overview

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

## Development Commands

```bash
# Start development server on port 3001
npm run dev

# Build production bundle
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Implementation Difficulty Index

This index helps Claude determine how challenging a proposed implementation would be within this project’s architecture and conventions. Claude should use this to assign a score from 0 to 10 when assessing new implementation requests.

**Scale:**

0: no need to change anything — functionality already exists  
1: minor modifications to existing files  
2: major modifications to existing files  
3–4: create new files  
5–6: create new files and folders  
7–8: change current structure and architecture (renaming, deleting, or repurposing)  
9: outside the range of convention given the technology, packages, and architecture in use  
10: impossible to accomplish

## Architecture & Key Patterns

### Route Groups & Layouts

The app uses Next.js App Router with route groups for layout organization:

- **(dashboard)**: Routes wrapped with `AppHeader` + `AppSidebar`. Used for authenticated dashboard pages like `/articles/review`.

  - Layout: `src/app/(dashboard)/layout.tsx`
  - Provides sidebar navigation, header, and authenticated UI chrome
  - Uses `SidebarProvider` context for responsive sidebar state

- **(full-width)**: Routes without dashboard chrome, used for auth flows like `/login` and `/register`.
  - Layout: `src/app/(full-width)/(auth)/layout.tsx`
  - Provides split-screen auth layout with KM logo on right side
  - Nested `(auth)` route group for auth-specific pages

**Important**: Route groups like `(dashboard)` and `(full-width)` do NOT appear in URLs — they only organize layouts. This replaces the v08 pattern of using `TemplateView.js` for shared navigation.

### State Management (Redux)

Redux Toolkit is configured in `src/store/index.ts` with `redux-persist` for localStorage persistence:

- **Store setup**: Uses `persistReducer` with `redux-persist/lib/storage`
- **User slice**: `src/store/features/user/userSlice.ts` manages authentication state and application preferences

  - `loginUser`: Sets token, username, email, isAdmin after successful login
  - `logoutUserFully`: Resets all user state completely
  - Article/request filtering params stored in Redux for persistence across sessions

- **Typed hooks**: Use `useAppDispatch` and `useAppSelector` from `src/store/hooks.ts` instead of raw Redux hooks

- **Provider setup**: `src/app/providers.tsx` wraps app with Redux Provider and PersistGate
  - All client components have access to Redux store
  - Persisted state rehydrates automatically on page load

### Authentication Flow

Login is handled in `src/components/auth/LoginForm.tsx`:

1. User submits email/password
2. POST to `${NEXT_PUBLIC_API_BASE_URL}/users/login`
3. On success, dispatch `loginUser(resJson)` to Redux
4. Router pushes to `/articles/review` (dashboard page)
5. Token and user data persisted via redux-persist

Logout should use `logoutUserFully` action to clear all state.

### SVG Icons

SVG icons in `src/icons/` are imported as React components using `@svgr/webpack`:

- Custom webpack config in `next.config.ts` transforms `.svg` imports to components
- Icons exported from `src/icons/index.tsx`
- Usage: `import { EyeIcon, EyeCloseIcon } from "@/icons"`
- **Do NOT use Turbopack** — it breaks SVG loading (causes problems with the svg icons)

### Styling

- **TailwindCSS v4** via `@tailwindcss/postcss`
- Global styles in `src/app/globals.css`
- Theme context in `src/context/ThemeContext.tsx` for light/dark mode
- Sidebar responsive behavior managed by `src/context/SidebarContext.tsx`

### Component Organization

- `src/components/auth/`: Authentication forms (LoginForm, RegistrationForm)
- `src/components/form/`: Reusable form inputs, selects, switches, labels
- `src/components/ui/`: Reusable UI primitives (buttons, alerts, badges, modals, tables, dropdowns)
- `src/components/common/`: Shared components like breadcrumbs, theme toggles, chart tabs
- `src/layout/`: Top-level layout components (AppHeader, AppSidebar, Backdrop, SidebarWidget)

### Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Base URL for NewsNexusAPI09 backend
- `NEXT_PUBLIC_MODE`: Set to "workstation" to prefill login form for development

## Important Notes

- **Template renaming**: `SignUpForm.tsx` → `RegistrationForm.tsx`, `SignInForm.tsx` → `LoginForm.tsx`
- **Sidebar placement**: Sidebar is positioned on the RIGHT side of the screen (customization from template)
- **Logo positioning**: KM logo appears on the right side of auth screens and header
- **Redux persistence**: User state persists across page refreshes via localStorage
- **API integration**: All API calls go through `NEXT_PUBLIC_API_BASE_URL` environment variable
