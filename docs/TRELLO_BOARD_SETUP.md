# 🗂️ The 404 Server Manager — Trello Board Setup

This Trello structure covers both frontend (`The404-Web`) and backend (`The404-API`) development.  
The project is exploratory, so placeholders and mock data are included to simulate API responses until integration.

---

## 📋 LISTS OVERVIEW

### 1. 🧱 Setup & Configuration

### 2. 🎨 The404-Web (Next.js Frontend)

### 3. ⚙️ The404-API (Express Backend)

### 4. 🔄 Integration & Data Flow

### 5. 🧪 Testing & QA

### 6. 🚀 Deployment & Documentation

### 7. 💭 Backlog / Future Enhancements

---

## 🧱 Setup & Configuration

**Cards:**

- **Initialize Repositories**

  - Create GitHub repos: `The404-Web` and `The404-API`
  - Configure branch protection and dev branches
  - Set up shared `.editorconfig` and `.eslint` rules

- **Shared Environment Setup**

  - Define `.env.local` structure for both projects
  - Add placeholders for:
    - `NEXT_PUBLIC_API_BASE_URL`
    - `MONGODB_URI`
    - `JWT_SECRET`
  - Document example `.env` file

- **Code Quality & Tooling**

  - Install and configure Prettier, ESLint, and Husky for pre-commit hooks
  - Ensure TypeScript strict mode is enabled
  - Add lint command to CI

- **Design System Integration**
  - Apply JetBrains Mono across project
  - Add Tailwind CSS dark/light color palette per spec
  - Create color tokens in `tailwind.config.ts`

---

## 🎨 The404-Web (Next.js Frontend)

**Cards:**

- **Next.js Project Setup**

  - Verify project runs with `npm run dev` on port 3001
  - Remove Turbopack flag
  - Confirm Redux persistence is active

- **App Layout Implementation**

  - Add `(dashboard)` layout with `AppHeader` and `AppSidebar`
  - Integrate `ThemeProvider`, `SidebarProvider`, and Redux `Providers`
  - Right-hand sidebar toggle and responsive behavior

- **Sidebar Navigation**

  - Implement menu items per spec:
    - Servers → Machines, Apps
    - Manage DNS → Nginx, GoDaddy
  - Add placeholder icons in `/src/icons/`
  - Verify responsive expand/collapse works

- **Header Component**

  - Show `machineName` and `urlFor404Api` (from Redux)
  - Hide logo on mobile
  - Add hamburger toggle on right

- **Machines Page ([base_url]/servers/machines)**

  - Create table component:
    - Columns: Machine Name | URL | IP Address | Action (Connect)
  - Placeholder data array (e.g. 3 mock servers)
  - “Connect Machine” button updates Redux userSlice
  - Connected machine name displays in header

- **Apps Page ([base_url]/servers/apps)**

  - Create table with mock PM2 app data:
    - Columns: App Name | Port | Status (Toggle Button)
  - Add button to simulate app toggle (`running` ↔ `stopped`)
  - Placeholder fetch call to `/api/apps` with mock data

- **Manage DNS Section**

  - Add subpages:
    - `/manage-dns/nginx`
    - `/manage-dns/go-daddy`
  - Create mock data for Nginx configs and DNS entries
  - Add “Add Subdomain” modal (UI-only for now)

- **Theme Switcher**

  - Implement `useTheme()` toggle
  - Validate color palette matches design spec

- **Redux Enhancements**
  - Add `machine` reducer state (name, apiURL, paths)
  - Integrate persistence
  - Create mock login state (workstation mode)

---

## ⚙️ The404-API (Express Backend)

**Cards:**

- **Refactor Starter Project**

  - Replace TypeScriptDb with Mongoose/MongoDB connection
  - Rename DB to `The404v02`
  - Connect to shared MongoDB URI via `.env`

- **Basic Server Setup**

  - Ensure Express runs on port `8000`
  - Add routes folder structure:
    - `/machines`
    - `/apps`
    - `/dns`
    - `/nginx`

- **API: GET /machines**

  - Return mock machine list:
    ```json
    [
    	{
    		"machineName": "server-01",
    		"urlFor404Api": "http://192.168.1.10:8000",
    		"localIpAddress": "192.168.1.10",
    		"userHomeDir": "/home/ubuntu",
    		"nginxStoragePathOptions": [
    			"/etc/nginx/sites-available",
    			"/etc/nginx/conf.d"
    		]
    	}
    ]
    ```

- **API: GET /apps**

  - Return mock PM2 process list with names, ports, and statuses

- **API: POST /apps/toggle**

  - Accept app name and toggle mock status (simulate PM2 behavior)

- **API: GET /dns/godaddy**

  - Return mock list of A records
  - Include fake TTL and IP values

- **API: POST /dns/godaddy**

  - Simulate adding new A record entry

- **API: GET /nginx/configs**

  - Return placeholder array of config filenames

- **API: POST /nginx/register**

  - Simulate creating new Nginx config
  - Return mock success message

- **Authentication Middleware**

  - Create token verification middleware (mock only)
  - Add sample bearer token for testing

- **CORS & Logging**
  - Add CORS for localhost:3001
  - Include Morgan logging middleware

---

## 🔄 Integration & Data Flow

**Cards:**

- **Define API Contracts**

  - Document all REST endpoints and expected payloads
  - Create `/docs/api-contracts.md` in root

- **Frontend → API Mock Connection**

  - Connect placeholder fetch calls in The404-Web to local Express mock endpoints
  - Create reusable API utility in `src/utils/api.ts`

- **Redux Thunks for API Calls**

  - Implement async thunks for `/machines` and `/apps`
  - Use mock endpoints until backend is ready

- **Error Handling & Loading States**
  - Add global loading spinner component
  - Add error boundary for network calls

---

## 🧪 Testing & QA

**Cards:**

- **Unit Testing Setup**

  - Add Jest and React Testing Library
  - Add sample tests for reducers and components

- **API Testing**

  - Use Postman collection for testing endpoints
  - Mock responses for `/machines` and `/apps`

- **Visual QA**

  - Verify light/dark mode consistency
  - Ensure sidebar and header responsive behavior

- **Accessibility Audit**
  - Test contrast ratios, keyboard navigation, and focus states

---

## 🚀 Deployment & Documentation

**Cards:**

- **Ubuntu VM Deployment Setup**

  - Each VM hosts one instance of **The404-API** on port `8000`
  - The main VM (**NWS-the404**) hosts both **The404-Web** and **The404-API**
  - Ensure all VMs have Node.js LTS and PM2 installed globally
  - Verify proper firewall and UFW rules (allow port 8000 + 3001)
  - Configure Nginx reverse proxy for The404-Web → localhost:3001

- **The404-Web Deployment (NWS-the404)**

  - Clone `The404-Web` repository to `/var/www/the404-web`
  - Run `npm install && npm run build`
  - Use `pm2 start npm --name "the404-web" -- start` to run in background
  - Configure Nginx to serve via domain/subdomain (e.g. `the404.example.com`)
  - Set environment variables:
    - `NEXT_PUBLIC_MODE=workstation`
    - `NEXT_PUBLIC_API_BASE_URL=http://nws-the404:8000`

- **The404-API Deployment (on each VM)**

  - Clone `The404-API` repository to `/var/www/the404-api`
  - Run `npm install && npm run build`
  - Start with `pm2 start npm --name "the404-api" -- start`
  - Confirm it runs at `http://<vm_ip>:8000`
  - Configure `.env` for MongoDB connection:
    ```
    MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/The404v02
    JWT_SECRET=example_secret
    ```
  - Each VM instance should have a unique `machineName` in its local config

- **Inter-Server Communication Configuration**

  - `The404-Web` connects dynamically to different API URLs based on selected machine
  - Verify `/machines` endpoint returns correct list of all available servers
  - Ensure CORS is enabled on all API instances to allow cross-VM requests
  - Test connection switching between machines from the web dashboard

- **Systemd Service Setup (optional)**

  - Create `systemd` service files for `the404-web` and `the404-api` for auto-restart
  - Enable at boot: `sudo systemctl enable the404-web.service`

- **Domain and SSL Configuration**

  - Use Nginx on NWS-the404 to serve HTTPS via Let’s Encrypt (`certbot`)
  - Reverse proxy rules:
    - `/` → The404-Web (port 3001)
    - `/api` → Local The404-API (port 8000)

- **README & Documentation Updates**

  - Update both project README files with Ubuntu deployment steps
  - Include examples of PM2 start commands and Nginx configuration snippets
  - Add topology diagram showing:
    - NWS-the404 (frontend + local API)
    - Additional VMs (remote APIs)
  - Include screenshots of The404-Web interacting with multiple APIs

- **Versioning & Changelog**
  - Start versioning from `v0.1.0` (Proof of Concept)
  - Add `CHANGELOG.md` with deployment notes for each new release

---

## 💭 Backlog / Future Enhancements

**Cards:**

- Live PM2 log streaming via WebSocket
- Auth with shared token (JWT)
- Server-specific user permissions
- Nginx file editor (read/write)
- Real GoDaddy API integration
- SSH key management for remote servers
- Dynamic machine switching via dropdown
- Configurable API base URL per session

---
