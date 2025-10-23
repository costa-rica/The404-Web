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

## 2. The404-Web Styling

### 2.1. Color Pallet

The404-Web has a dark and light mode.

#### 2.1.1 Dark Mode

I would like the dark mode to have the following color pallet :

- **Background: `#34385A`**
  Main dashboard background. Dark navy tone reminiscent of terminal environments.

- **Highlight / Accent: `#FA9F15`**
  Used for hover states, primary buttons, and visual emphasis. Amber tone inspired by CRT terminals.

- **Dark Text: `#000000`**
  Used for light background sections or cards.

- **Medium Text: `#888787`**
  Used for secondary text, timestamps, or labels.

- **Light Text: `#FFFFFF`**
  Used for primary text on dark backgrounds.

- **Error / Warning Red: `#8B0419`**
  Used sparingly for critical alerts or destructive actions.

#### 2.1.2 Light Mode

I would like the light mode to have the following color pallet :

- **Background: `#F7F8FC`**
  Clean off-white with a subtle blue tint for the main dashboard background.

- **Surface / Card Background: `#FFFFFF`**
  Panels, cards, and modals — crisp and neutral.

- **Primary Accent: `#FA9F15`**
  Same amber as dark mode for brand consistency; use for primary buttons and active states.

- **Secondary Accent: `#3D5AFE`**
  Vibrant indigo-blue for secondary actions and highlights; complements the amber.

- **Primary Text: `#0F172A`**
  Deep slate-blue for high-contrast body text on light backgrounds.

- **Secondary Text: `#6B7280`**
  Medium gray for secondary information, timestamps, and labels.

- **Disabled / Muted Text: `#9CA3AF`**
  Light gray for placeholders and disabled elements.

- **Border / Divider: `#E2E8F0`**
  Soft neutral for separators, table borders, and outlines.

- **Hover Background: `#F1F5F9`**
  Subtle gray tint for hover states on list items and rows.

- **Error / Warning Red: `#D90429`**
  Clear, attention-grabbing red for errors and destructive actions.

- **Success Green: `#16A34A`**
  Positive state (e.g., server online) badges and confirmations.

- **Info Blue: `#2563EB`**
  Informational banners, non-critical notices, and links.

### 2.2. Typography

- **Primary Font: JetBrains Mono, monospace**
  Used across all text to reinforce the technical and terminal-style design.
  Fallback: `monospace`

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
