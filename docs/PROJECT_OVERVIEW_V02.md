# The 404 Server Manager Specifications Document

## 1. Overview of the project

The 404 Server Manager ecosystem is a comprehensive suite of applications designed to help monitor, manage, and orchestrate servers and their applications across your infrastructure. It connects to various APIs deployed on each machine, all secured by a shared authentication layer and unified MongoDB instance.

There will be a front facing Next.js web application that provides real-time visibility and management features for your servers. Through its interface, users can:

- View PM2 process logs from any connected machine. The first iteration will be reading the logs – later we will implement live logs.
- Check the status of apps running under PM2.
- Manage DNS entries via the GoDaddy API to add or modify Type A subdomains.
- Automatically generate and register Nginx configurations for new subdomains.
- View and manage existing Nginx configuration files from each server’s `/etc/nginx/sites-available/`, `/etc/nginx/sites-enabled/`, and `/etc/nginx/conf.d` directories.

The dashboard unifies multiple APIs, each hosted on a separate Ubuntu server, and communicates securely with the shared MongoDB database that stores machine data and network configurations. By switching between connected machines, The 404 Web dynamically updates its data context to display logs, apps, and configurations for the selected server.

### 1.1. Core projects

The following projects will be part of the suite of applications.

#### 1.1.1. The 404 API

This project’s Github project repo name will be “The404-API”, and also it will be referred to as The404-API from here on out in this document. This will start from an ExpressJS starter project I created. The starter project connects to an external database project called TypeScriptDb, but instead we will refactor the code so the database will be a MongoDb collection called The404v02, which will be connected to using the mongoose npm package.

The404-API will be running on each server’s port 8000. The servers run Ubuntu and PM2 to manage apps.

Before specifying all the routes and endpoints we want to build the Next.js website first with placeholder data to verify the proof of concept.

#### 1.1.2. The 404 Web

This project’s Github project repo name will be “The404-Web” and also it will be referred to as The404-Web from here on out in this document. This will be a Next.js application based on a starter project I have created on GitHub. Here are the details of this starter project:
This is a starter project for a dashboard application built with Next.js and TypeScript. It will use Tailwind CSS for styling and Redux Toolkit for state management. The navigation and folder structure will use App Router.
• Started from npx create-next-app@latest
o No Turbopack -> this causes problems with the svg icons (src/icons)
• Heavily lifting the architecture from free-nextjs-admin-dashboard-main
• Customizeing it to fit the needs of the NewsNexus Portal.
• Uses App Router
• Uses TailwindCSS
• Uses Redux for state management
• Uses TypeScript

### 1.2. Goal of this document

This document is the first version. It will serve as a proof of concept that we can have ChatGPT create tickets in Trello and have both ChatGPT and Claude read the tickets. The goal is to build both The 404 Web and The 404 API projects in a non-isolated way using the Trello tickets as context for how the apps should communicate with each other.

## 2. The404-Web Styling Guide

The 404 Web uses a **terminal-inspired design language** — minimalist, functional, with high contrast and readability that evokes classic CRT terminal environments.

### Color Palette

The application uses a fully implemented terminal-inspired color system with a 10-step scale for each color category:

- **Brand (Terminal Orange)**: `#e95420` - Primary actions, links, active states
- **Gray (True Black)**: `#000000` to `#fcfcfc` - Neutral structure, backgrounds, text hierarchy
- **Success (Phosphor Green)**: `#10b981` - Positive states, confirmations
- **Error (Bright Red)**: `#ef4444` - Negative states, destructive actions
- **Warning (Amber)**: `#fbbf24` - Caution states, important notices
- **Info (Terminal Cyan)**: `#06b6d4` - Informational content, secondary highlights

All colors follow a standardized 10-step scale (25-950) defined in `src/app/globals.css`. Components reference these scales by name, allowing easy customization without code changes.

**For complete color scales, component usage examples, and customization guidelines, see [docs/STYLE_GUIDE.md](./docs/STYLE_GUIDE.md).**

### Typography

**Font**: JetBrains Mono (monospace) - Loaded via Google Fonts in `src/app/layout.tsx`

## 3. Sidebar menu (The404-Web)

The sidebar menu will consist of a links. There will be NavItems, which may be “clickable” or “expandable”. If the NavItem is clickable it will not be expandable. If they are expandable they will have subItems that are links.

The404-Web component that will be the side navigation bar is found in src/layout/AppSidebar.tsx.

Each NavItem will have an icon. Icons will be stored in the src/icons/ directory.

The sidebar NavItems will be:

- Name: Servers
  - icon: src/icons/database-solid.svg
  - subItems: machines, apps
    - path to machines will be [base_url]/servers/machines
    - path to apps will be [base_url]/servers/apps
- Name: Manage DNS
  - icon: src/icons/gear-solid-full.svg
  - subItems: Nginx, GoDaddy
    - path to nginx: will be [base_url]/manage-dns/nginx
    - path to godaddy: will be [base_url]/manage-dns/go-daddy

## 4. Top Heading (The404-Web)

The top heading component is found in the src/layout/AppHeader.tsx. On the left we will have a small logo. The middle will show the connected server’s machineName and urlFor404Api just below the machineName. On small and mobile screens the logo on the left will be hidden and only the machineName and the urlFor404Api will show. The menu hamburger will be on the right as it is programmed to show now.

## 5. Machines page

In the [base_url]/servers/machines page will have a table that has a row for each machine. The machines will be Ubuntu servers. When this page is accessed it will make a call to the connected The404-API’s endpoint called GET /machines, which will make a call to the MongoDb’s machines collection, this will have string fields for machineName, urlFor404Api, localIpAddress, userHomeDir, and then nginxStoragePathOptions will be an array of strings.

The table will be a simple looking table with the machine name in the left most column and the urlFor404Api and localIpAddress in lighter colors below the machine name. To the right will be a column with a button that says connect machine. If connect machine is selected on a row, that machines’s url will update the user reducer’s (src/store/features/user/userSlice.ts) machineName, urlFor404Api and the nginxStoragePathOptions properties.

The selected machine will be displayed on the top heading bar of the website which is rendered using the src/layout/AppHeader.tsx component. In the middle we will want to show the machine name and the url to the api of that machine’s api.

## 6. App page

In the [base_url]/servers/apps page will have a table that has a row for each app running on that server. This data will come from pm2 that runs on that machine. On the left column of the table there will be the apps name. There will be a middle column for the port number the app is running on. The right most column will called status and it will have a button for each row that says the status of the app. If the user clicks on the button it will toggle the app between on or off by sending a request to the api which will then communicate with PM2 to change the app’s status. The api call will wait for the pm2 response to verify the app has successfully been toggled to its new status.
