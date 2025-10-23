# The 404 Web

## Overview

### Purpose

The 404 Web is the primary user-facing dashboard of **The 404 Server Manager** ecosystem — a comprehensive suite of applications designed to help monitor, manage, and orchestrate servers and their applications across your infrastructure. It connects to various APIs deployed on each machine, all secured by a shared authentication layer and unified MongoDB instance.

This Next.js web portal provides real-time visibility and management features for your servers. Through its interface, users can:

- View live PM2 process logs from any connected machine.
- Check the status of apps running under PM2.
- Manage DNS entries via the GoDaddy API to add or modify Type A subdomains.
- Automatically generate and register Nginx configurations for new subdomains.
- View and manage existing Nginx configuration files from each server’s `/etc/nginx/sites-available/` and `conf.d` directories.

The dashboard unifies multiple APIs, each hosted on a separate Ubuntu server, and communicates securely with the shared MongoDB database that stores machine data and network configurations. By switching between connected machines, The 404 Web dynamically updates its data context to display logs, apps, and configurations for the selected server.

### Architecture Summary

- **Frontend**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit with persistence
- **Backend**: Connects to individual server APIs (the404back instances)
- **Database**: MongoDB (shared across all servers for global state)
- **Authentication**: Token-based, shared across all machines
- **Hosting**: Ubuntu servers managed by PM2, proxied through Nginx

---

## Design System

The 404 Web uses a **terminal-inspired aesthetic** — minimalist, functional, with high contrast and readability that evokes classic CRT terminal environments.

### Color Palette

**IMPLEMENTATION STATUS:** Fully implemented terminal-inspired color system with a 10-step scale for each color category. This system is defined in `src/app/globals.css` and used throughout all components.

#### Color Scale Structure

Each color category follows a standardized 10-step scale (25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950):

- **25-100**: Light backgrounds (badges, alerts, subtle highlights)
- **200-300**: Borders, disabled states, very light interactive elements
- **400-500**: Main color (500 is the canonical shade)
- **600**: Hover states for interactive elements
- **700-800**: Dark text, pressed states
- **900-950**: Very dark backgrounds/text (dark mode)

#### Color Categories

##### 1. BRAND (Terminal Orange) - Primary/Interactive Elements

**Main color**: `#e95420` (brand-500)

**Used for**:

- Primary buttons (`bg-brand-500`, hover: `bg-brand-600`)
- Active menu items (`bg-brand-50`, text: `brand-500`)
- Links and interactive elements
- Focus rings
- Active states in navigation

**Terminal aesthetic**: Ubuntu orange - evokes classic CRT terminal amber/orange displays

**Scale**:

```
brand-25:  #fff7f5  |  brand-500: #e95420  |  brand-900: #651f0c
brand-50:  #ffede8  |  brand-600: #c74318  |  brand-950: #3d1207
brand-100: #ffd4c7  |  brand-700: #a63513
brand-200: #ffb89e  |  brand-800: #85280f
brand-300: #ff9871
brand-400: #f77548
```

##### 2. GRAY - Neutral/Structure (True Terminal Black)

**Range**: `#fcfcfc` (gray-25) → `#000000` (gray-950)

**Used for**:

- Backgrounds (`bg-gray-50` light mode, `bg-gray-900`/`bg-gray-950` dark mode)
- Text hierarchy (gray-700 primary, gray-500 secondary, gray-400 tertiary)
- Borders (`border-gray-200` light, `border-gray-800` dark)
- Cards and panels
- Disabled states

**Terminal aesthetic**: Pure grayscale from white to true black (#000000) for authentic terminal feel

**Scale**:

```
gray-25:  #fcfcfc  |  gray-500: #525252  |  gray-900: #0a0a0a
gray-50:  #f5f5f5  |  gray-600: #404040  |  gray-950: #000000
gray-100: #e5e5e5  |  gray-700: #262626  |  gray-dark: #000000
gray-200: #d4d4d4  |  gray-800: #171717
gray-300: #a3a3a3
gray-400: #737373
```

##### 3. SUCCESS (Phosphor Green) - Positive States

**Main color**: `#10b981` (success-400)

**Used for**:

- Success alerts/messages
- "Server online" badges
- Confirmation buttons
- Checkmarks and positive indicators

**Terminal aesthetic**: Bright phosphor green mimicking classic CRT "command successful" displays

**Pattern**: Light background (success-50) + solid icon/text (success-400/500)

**Scale**:

```
success-25:  #f0fdf9  |  success-500: #059669  |  success-900: #022c22
success-50:  #d1fae5  |  success-600: #047857  |  success-950: #011713
success-100: #a7f3d0  |  success-700: #065f46
success-200: #6ee7b7  |  success-800: #064e3b
success-300: #34d399
success-400: #10b981
```

##### 4. ERROR (Bright Red) - Negative States

**Main color**: `#ef4444` (error-400)

**Used for**:

- Error alerts
- Destructive actions
- Form validation errors
- Failed status badges

**Terminal aesthetic**: Bright, highly visible red for clear error indication on dark backgrounds

**Scale**:

```
error-25:  #fef5f5  |  error-500: #dc2626  |  error-900: #450a0a
error-50:  #fee2e2  |  error-600: #b91c1c  |  error-950: #2d0606
error-100: #fecaca  |  error-700: #991b1b
error-200: #fca5a5  |  error-800: #7f1d1d
error-300: #f87171
error-400: #ef4444
```

##### 5. WARNING (Amber) - Caution States

**Main color**: `#fbbf24` (warning-500)

**Used for**:

- Warning alerts
- Important notices
- Non-critical issues

**Note**: Distinct from brand orange to avoid confusion between warnings and primary actions

**Scale**:

```
warning-25:  #fffef5  |  warning-500: #fbbf24  |  warning-900: #78350f
warning-50:  #fefce8  |  warning-600: #f59e0b  |  warning-950: #451a03
warning-100: #fef9c3  |  warning-700: #d97706
warning-200: #fef08a  |  warning-800: #b45309
warning-300: #fde047
warning-400: #facc15
```

##### 6. INFO (Terminal Cyan) - Info/Secondary

**Main color**: `#06b6d4` (blue-light-400)

**Used for**:

- Info alerts
- Secondary highlights
- Informational badges

**Terminal aesthetic**: Classic terminal cyan for informational messages and secondary emphasis

**Scale**:

```
blue-light-25:  #f0fdff  |  blue-light-500: #0891b2  |  blue-light-900: #083344
blue-light-50:  #cffafe  |  blue-light-600: #0e7490  |  blue-light-950: #042f2e
blue-light-100: #a5f3fc  |  blue-light-700: #155e75
blue-light-200: #67e8f9  |  blue-light-800: #164e63
blue-light-300: #22d3ee
blue-light-400: #06b6d4
```

##### 7. ORANGE - Alternative Accent

**Main color**: `#fb6514` (orange-500)

**Usage**: Available as alternative warning/accent color (rarely used in current implementation)

**Scale**:

```
orange-25:  #fffaf5  |  orange-500: #fb6514  |  orange-900: #7e2410
orange-50:  #fff6ed  |  orange-600: #ec4a0a  |  orange-950: #511c10
orange-100: #ffead5  |  orange-700: #c4320a
orange-200: #fddcab  |  orange-800: #9c2a10
orange-300: #feb273
orange-400: #fd853a
```

##### 8. THEME COLORS - Decorative

- **Pink**: `#ee46bc` (theme-pink-500)
- **Purple**: `#7a5af8` (theme-purple-500)

**Usage**: Special UI elements, charts, data visualization

#### Component Usage Examples

**Buttons** (`src/components/ui/button/Button.tsx`):

- Primary: `bg-brand-500 hover:bg-brand-600`
- Outline: `bg-white ring-gray-300 hover:bg-gray-50`

**Alerts** (`src/components/ui/alert/Alert.tsx`):

- Success: `border-success-500 bg-success-50`
- Error: `border-error-500 bg-error-50`

**Badges** (`src/components/ui/badge/Badge.tsx`):

- Primary light: `bg-brand-50 text-brand-500`
- Success solid: `bg-success-500 text-white`

**Navigation** (`src/layout/AppSidebar.tsx`):

- Active: `bg-brand-50 text-brand-500` (light) / `bg-brand-500/12 text-brand-400` (dark)
- Inactive: `text-gray-700 hover:bg-gray-100`

#### Customizing Colors

To modify this color system:

1. **Keep the scale structure** (25-950 for each category)
2. **Update HEX values** in `src/app/globals.css`
3. **Use a color scale generator** to create consistent progressions from your base colors
4. **Zero component changes required** - all components reference the scale names, not HEX values

This approach allows complete color customization while maintaining the existing component architecture.

### Typography

- **Primary Font: JetBrains Mono, monospace**
  Used across all text to reinforce the technical and terminal-style design.
  Fallback: `monospace`

### Implementation Status

**These design guidelines are finalized but NOT YET IMPLEMENTED in code.** They should guide all future UI and style updates. Implementation pending design approval.

---

### Template Origin

This project originated from a Next.js admin dashboard template and was customized to fit the structure and goals of **The 404 Server Manager**. The following references describe its starting point and base setup:

- Started from `npx create-next-app@latest`
  - No Turbopack → causes issues with SVG icons (`src/icons`)
- Architectural inspiration from [free-nextjs-admin-dashboard-main](https://tailadmin.com/download)
- Modified and extended to fit the 404 ecosystem’s requirements
- Uses:
  - App Router
  - Tailwind CSS
  - Redux Toolkit for state management
  - TypeScript

## Imports

### Required for Template

- `npm install @reduxjs/toolkit react-redux redux-persist`
- `npm install tailwind-merge`
- `npm i -D @svgr/webpack`
  - Requires an update to the `next.config.ts` file → see the file for details.
