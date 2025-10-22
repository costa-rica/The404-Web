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

## For Claude Code (claude.ai/code)

Use the docs/CLAUDE_TEMPLATE.md and docs/PROJECT_OVERVIEW.md files references for the project structure. They are both documentation files for a different project that will have a very similar structure to this one. For the overall object of the project use the Overview section of the README.md file.
