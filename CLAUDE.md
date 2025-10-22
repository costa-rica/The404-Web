# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The 404 Web** is the primary user-facing dashboard for The 404 Server Manager ecosystem — a comprehensive suite for monitoring, managing, and orchestrating servers and their applications. This Next.js web portal connects to various APIs deployed on each machine, all secured by shared authentication and a unified MongoDB instance.

The dashboard provides real-time visibility for:
- PM2 process logs from any connected machine
- App status for processes running under PM2
- DNS management via GoDaddy API (Type A subdomains)
- Automatic Nginx configuration generation and management
- Server configuration file viewing and management

**Architecture Stack:**
- Frontend: Next.js 15 (App Router) + TypeScript
- Styling: Tailwind CSS v4
- State Management: Redux Toolkit with persistence
- Backend Integration: Connects to the404back instances on each Ubuntu server
- Database: Shared MongoDB across all servers
- Authentication: Token-based, shared across all machines

## Development Commands

```bash
# Start development server on port 3001
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

**IMPORTANT:** Do NOT use Turbopack (`--turbo` flag) — it breaks SVG icon loading from `src/icons/`.

## Core Architecture Patterns

### Route Groups & Layouts

Next.js App Router uses route groups (parentheses) for layout organization. Route groups do NOT appear in URLs:

**`(dashboard)`** — `src/app/(dashboard)/layout.tsx`
- Wraps authenticated pages with `AppHeader` + `AppSidebar`
- Provides responsive sidebar with expand/collapse functionality
- Uses `SidebarProvider` context for state management
- Example: `/home` route at `src/app/(dashboard)/home/page.tsx`
- Sidebar positioned on RIGHT side of screen (custom from template)

**`(full-width)/(auth)`** — `src/app/(full-width)/(auth)/layout.tsx`
- Full-width pages without dashboard chrome
- Split-screen auth layout with logo on right side
- Example: `/login` route at `src/app/(full-width)/(auth)/login/page.tsx`

### State Management with Redux

Redux store configuration in `src/store/index.ts`:

```typescript
// Store setup with persistence
const rootReducer = combineReducers({ user });
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Only persist user slice
};
```

**User slice** (`src/store/features/user/userSlice.ts`):
- `loginUser`: Sets token, username, email, isAdmin after authentication
- `logoutUser`: Clears token and user info
- `logoutUserFully`: Complete state reset (use this for logout flows)

**Typed hooks** (`src/store/hooks.ts`):
- Use `useAppDispatch` and `useAppSelector` instead of raw Redux hooks
- Provides proper TypeScript inference

**Provider hierarchy** (`src/app/layout.tsx`):
1. `<Providers>` — Redux Provider + PersistGate (`src/app/providers.tsx`)
2. `<ThemeProvider>` — Dark/light mode context (`src/context/ThemeContext.tsx`)
3. `<SidebarProvider>` — Sidebar state management (`src/context/SidebarContext.tsx`)

### Authentication Flow

Authentication handled in `src/components/auth/LoginForm.tsx`:

1. User submits email/password
2. POST to `${NEXT_PUBLIC_API_BASE_URL}/users/login`
3. On success: `dispatch(loginUser(resJson))`
4. Router navigates to `/home`
5. Token and user data persisted via redux-persist

**Logout:** Use `logoutUserFully` action and navigate to `/login` (see `src/layout/AppSidebar.tsx:61-64`).

### SVG Icons

Icons in `src/icons/` transformed to React components via `@svgr/webpack`:

- Webpack config in `next.config.ts` handles `.svg` imports
- Import: `import { HouseIcon, LogoutIcon } from "@/icons"`
- **Critical:** Never use Turbopack — breaks icon loading

### Sidebar Navigation

Sidebar menu defined in `src/layout/AppSidebar.tsx`:

```typescript
// Main navigation items
const navItems: NavItem[] = [
  {
    icon: <HouseIcon />,
    name: "Home",
    subItems: [{ name: "Home page", path: "/home" }],
  },
  // ...
];

// Admin/other items
const othersItems: NavItem[] = [
  {
    icon: <DatabaseIcon />,
    name: "Database",
    subItems: [
      { name: "Backup", path: "/admin-database/backup" },
      // ...
    ],
  },
];
```

**Adding new routes:**
1. Create page: `src/app/(dashboard)/your-route/page.tsx`
2. Add to `navItems` or `othersItems` in AppSidebar
3. Page automatically inherits dashboard layout

**Sidebar behavior:**
- RIGHT-side placement (custom from template)
- Desktop: Expands/collapses between 290px and 90px
- Mobile: Slides over with backdrop
- Click collapsed sidebar to expand
- Auto-opens parent menu when child route is active

### Component Organization

```
src/components/
├── auth/              # LoginForm, RegistrationForm
├── form/              # Form inputs, selects, switches, labels, etc.
├── ui/                # Reusable primitives (button, modal, dropdown, alert, badge, table)
├── common/            # Shared components (breadcrumbs, theme toggle, chart tabs)
└── tables/            # Specialized table components (DELETED in current state)

src/layout/            # Top-level layout components
├── AppHeader.tsx      # Top navigation bar
├── AppSidebar.tsx     # Right-side navigation sidebar
├── Backdrop.tsx       # Mobile overlay
└── SidebarWidget.tsx  # Sidebar content widgets
```

### TypeScript Configuration

Path alias: `@/*` → `./src/*`

Example: `import { AppHeader } from "@/layout/AppHeader"`

### Styling with Tailwind

- Tailwind CSS v4 via `@tailwindcss/postcss`
- Global styles: `src/app/globals.css`
- Dark mode: Use `dark:` prefix (managed by ThemeContext)
- Font: Outfit (Google Font) in `src/app/layout.tsx`

**Note:** The current implementation uses Outfit font, but the finalized design system specifies JetBrains Mono (see Design System section below).

### Context Usage

Both contexts require `"use client"`:

```typescript
// Theme (dark/light mode)
import { useTheme } from "@/context/ThemeContext";
const { isDarkMode, toggleTheme } = useTheme();

// Sidebar state
import { useSidebar } from "@/context/SidebarContext";
const { isExpanded, isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
```

## Design System

**IMPORTANT:** The following design system has been finalized but is **NOT YET IMPLEMENTED** in code. All future styling work, UI updates, and component implementations should reference these guidelines for consistency.

### Visual Aesthetic

The 404 Web uses a **terminal-inspired design language** — minimalist, functional, with high contrast and readability that evokes classic CRT terminal environments. This aesthetic reinforces the application's purpose as a technical server management tool.

### Color Palette

When implementing or updating UI components, use these colors:

- **Background: `#34385A`**
  Main dashboard background. Dark navy tone reminiscent of terminal environments.

- **Highlight / Accent: `#FA9F15`**
  Primary interactive color for hover states, buttons, links, and visual emphasis. Amber tone inspired by CRT terminal glow.

- **Dark Text: `#000000`**
  For light background sections, cards, or contrast areas.

- **Medium Text: `#888787`**
  For secondary text, metadata, timestamps, labels, or de-emphasized content.

- **Light Text: `#FFFFFF`**
  Primary text color on dark backgrounds. Use for headers, body text, and important content.

- **Error / Warning Red: `#8B0419`**
  Reserved for critical alerts, error states, and destructive actions. Use sparingly.

### Typography

- **Primary Font: JetBrains Mono, monospace**
  All text should use JetBrains Mono to reinforce the technical, terminal-style aesthetic.
  Fallback: `monospace`

**Current state:** The application currently uses Outfit (Google Font) loaded in `src/app/layout.tsx`. This should be replaced with JetBrains Mono during implementation.

### Implementation Guidelines

When building new components or updating existing ones:
1. Reference these color values instead of arbitrary Tailwind colors
2. Use JetBrains Mono for all text (configure in Tailwind or load via Google Fonts)
3. Maintain high contrast ratios (light text on dark background, dark text on light cards)
4. Use the accent color `#FA9F15` for interactive states and emphasis
5. Reserve the error red for critical UI states only

**Status:** Pending design approval before full codebase implementation.

## Backend Integration

While no API utilities currently exist in the codebase, backend calls follow this pattern:

```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/endpoint`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

Environment variables (not in repo, add to `.env.local`):
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the404back API instances
- `NEXT_PUBLIC_MODE`: Set to "workstation" for dev mode (prefills login)

## Template Notes

This project originated from `create-next-app@latest` and was customized from the TailAdmin template architecture. Key customizations:

- Sidebar moved to RIGHT side
- Route groups replace v08 TemplateView pattern
- Component renaming: `SignInForm` → `LoginForm`, `SignUpForm` → `RegistrationForm`
- Redux persistence configured for user authentication state
- Custom SVG icon webpack loader

## Adding New Features

**New dashboard page:**
1. Create: `src/app/(dashboard)/your-page/page.tsx`
2. Add route to sidebar: `src/layout/AppSidebar.tsx`
3. Inherits header + sidebar automatically

**New Redux state:**
1. Create slice: `src/store/features/your-feature/yourFeatureSlice.ts`
2. Add to `rootReducer` in `src/store/index.ts`
3. Add to `whitelist` if state should persist
4. Use `useAppDispatch`/`useAppSelector` in components

**New auth page:**
1. Create: `src/app/(full-width)/(auth)/your-page/page.tsx`
2. Inherits full-width auth layout automatically
