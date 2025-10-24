# API Reference

This document provides comprehensive documentation for all available API endpoints in the The404-API API.

## Base URL

```
http://localhost:3000
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Table of Contents

- [Index Routes](#index-routes)
- [User Routes](#user-routes)
- [Machine Routes](#machine-routes)
- [PM2 Routes](#pm2-routes)

---

## Index Routes

### GET /

Serves the main HTML page.

**Authentication:** Not required

**Request:**

```http
GET / HTTP/1.1
Host: localhost:3000
```

**Success Response (200 OK):**

```html
<!DOCTYPE html>
<html>
	<!-- HTML content -->
</html>
```

**Error Response (500 Internal Server Error):**

```json
{
	"error": "Internal server error"
}
```

---

## User Routes

### GET /users

Returns a simple message indicating the users endpoint is available.

**Authentication:** Not required

**Request:**

```http
GET /users HTTP/1.1
Host: localhost:3000
```

**Success Response (200 OK):**

```
users endpoint
```

---

### POST /users/register

Register a new user account.

**Authentication:** Not required

**Request Body:**

```json
{
	"email": "user@example.com",
	"password": "securePassword123"
}
```

**Request Example:**

```bash
curl --location 'http://localhost:3000/users/register' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "user@example.com",
  "password": "securePassword123"
}'
```

**Success Response (201 Created):**

```json
{
	"message": "User created successfully",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"user": {
		"username": "user",
		"email": "user@example.com"
	}
}
```

**Error Responses:**

**400 Bad Request - Missing Fields:**

```json
{
	"error": "Missing email, password"
}
```

**400 Bad Request - User Already Exists:**

```json
{
	"error": "User already exists"
}
```

---

### POST /users/login

Authenticate and log in an existing user.

**Authentication:** Not required

**Request Body:**

```json
{
	"email": "user@example.com",
	"password": "securePassword123"
}
```

**Request Example:**

```bash
curl --location 'http://localhost:3000/users/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "user@example.com",
  "password": "securePassword123"
}'
```

**Success Response (200 OK):**

```json
{
	"message": "User logged in successfully",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"user": {
		"username": "user",
		"email": "user@example.com",
		"isAdmin": false
	}
}
```

**Error Responses:**

**400 Bad Request - Missing Fields:**

```json
{
	"error": "Missing email, password"
}
```

**400 Bad Request - User Not Found:**

```json
{
	"error": "User not found"
}
```

**400 Bad Request - Invalid Password:**

```json
{
	"error": "Invalid password"
}
```

---

### POST /users/request-reset-password-email

Request a password reset email. Sends an email with a JWT token that expires in 1 hour.

**Authentication:** Not required

**Request Body:**

```json
{
	"email": "user@example.com"
}
```

**Request Example:**

```bash
curl --location 'http://localhost:3000/users/request-reset-password-email' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "user@example.com"
}'
```

**Success Response (200 OK):**

```json
{
	"message": "Email sent successfully"
}
```

**Error Responses:**

**400 Bad Request - Missing Email:**

```json
{
	"error": "Email is required."
}
```

**404 Not Found - User Not Found:**

```json
{
	"error": "User not found."
}
```

---

### POST /users/reset-password-with-new-password

Reset user password using the token from the reset email.

**Authentication:** Not required (uses JWT token from email)

**Request Body:**

```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"newPassword": "newSecurePassword123"
}
```

**Request Example:**

```bash
curl --location 'http://localhost:3000/users/reset-password-with-new-password' \
--header 'Content-Type: application/json' \
--data-raw '{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "newSecurePassword123"
}'
```

**Success Response (200 OK):**

```json
{
	"message": "Password reset successfully"
}
```

**Error Responses:**

**400 Bad Request - Missing Fields:**

```json
{
	"error": "Missing token, newPassword"
}
```

**401 Unauthorized - Invalid Token:**

```json
{
	"error": "Invalid or expired token."
}
```

**401 Unauthorized - Expired Token:**

```json
{
	"error": "Reset token has expired."
}
```

**404 Not Found - User Not Found:**

```json
{
	"error": "User not found."
}
```

**500 Internal Server Error:**

```json
{
	"error": "Internal server error"
}
```

---

## Machine Routes

### GET /machines/name

Get the current machine's hostname and local IP address using OS-level information.

**Authentication:** Required (JWT token)

**Request:**

```http
GET /machines/name HTTP/1.1
Host: localhost:3000
```

**Request Example:**

```bash
curl --location 'http://localhost:3000/machines/name'
```

**Success Response (200 OK):**

```json
{
	"machineName": "ubuntu-server-01",
	"localIpAddress": "192.168.1.100"
}
```

**Error Response (500 Internal Server Error):**

```json
{
	"error": "Failed to retrieve machine information"
}
```

---

### GET /machines

Get all registered machines in the system.

**Authentication:** Required (JWT token)

**Request:**

```http
GET /machines HTTP/1.1
Host: localhost:3000
Authorization: Bearer <your_jwt_token>
```

**Request Example:**

```bash
curl --location 'http://localhost:3000/machines' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**Success Response (200 OK):**

```json
{
	"result": true,
	"existingMachines": [
		{
			"_id": "507f1f77bcf86cd799439011",
			"machineName": "ubuntu-server-01",
			"urlFor404Api": "http://192.168.1.100:8000",
			"localIpAddress": "192.168.1.100",
			"userHomeDir": "/home/ubuntu",
			"nginxStoragePathOptions": ["/var/www", "/home/user/sites"],
			"createdAt": "2025-10-23T10:30:00.000Z",
			"updatedAt": "2025-10-23T10:30:00.000Z"
		}
	]
}
```

**Error Responses:**

**401 Unauthorized - Missing or Invalid Token:**

```json
{
	"error": "Access denied. No token provided."
}
```

---

### POST /machines

Register a new machine in the system. Automatically adds the machine name and local IP address from OS.

**Authentication:** Required (JWT token)

**Request Body:**

```json
{
	"urlFor404Api": "http://192.168.1.100:8000",
	"nginxStoragePathOptions": ["/var/www", "/home/user/sites"],
	"userHomeDir": "/home/ubuntu"
}
```

**Request Example:**

```bash
curl --location 'http://localhost:3000/machines' \
--header 'Content-Type: application/json' \
--data-raw '{
  "urlFor404Api": "http://192.168.1.100:8000",
  "nginxStoragePathOptions": ["/var/www", "/home/user/sites"],
  "userHomeDir": "/home/ubuntu"
}'
```

**Success Response (201 Created):**

```json
{
	"message": "Machine created successfully",
	"machine": {
		"id": "507f1f77bcf86cd799439011",
		"machineName": "ubuntu-server-01",
		"urlFor404Api": "http://192.168.1.100:8000",
		"localIpAddress": "192.168.1.100",
		"userHomeDir": "/home/ubuntu",
		"nginxStoragePathOptions": ["/var/www", "/home/user/sites"],
		"createdAt": "2025-10-23T10:30:00.000Z",
		"updatedAt": "2025-10-23T10:30:00.000Z"
	}
}
```

**Error Responses:**

**400 Bad Request - Missing Fields:**

```json
{
	"error": "Missing urlFor404Api, nginxStoragePathOptions, userHomeDir"
}
```

**400 Bad Request - Invalid Array:**

```json
{
	"error": "nginxStoragePathOptions must be an array of strings"
}
```

**500 Internal Server Error:**

```json
{
	"error": "Failed to create machine"
}
```

---

### DELETE /machines/:id

Delete a machine from the system by its ID.

**Authentication:** Required (JWT token)

**URL Parameters:**

- `id` (string, required) - MongoDB ObjectId of the machine to delete

**Request:**

```http
DELETE /machines/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:3000
Authorization: Bearer <your_jwt_token>
```

**Request Example:**

```bash
curl --location --request DELETE 'http://localhost:3000/machines/507f1f77bcf86cd799439011' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**Success Response (200 OK):**

```json
{
	"message": "Machine deleted successfully"
}
```

**Error Responses:**

**401 Unauthorized - Missing or Invalid Token:**

```json
{
	"error": "Access denied. No token provided."
}
```

**404 Not Found - Machine Not Found:**

```json
{
	"error": "Machine not found"
}
```

**500 Internal Server Error:**

```json
{
	"error": "Failed to delete machine"
}
```

---

## PM2 Routes

### GET /pm2/apps

Get all PM2 managed applications running on the server with detailed information including port numbers.

**Authentication:** Required (JWT token)

**Request:**

```http
GET /pm2/apps HTTP/1.1
Host: localhost:3000
Authorization: Bearer <your_jwt_token>
```

**Request Example:**

```bash
curl --location 'http://localhost:3000/pm2/apps' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**Success Response (200 OK):**

```json
{
	"managedAppsArray": [
		{
			"name": "The404Back",
			"pm_id": 0,
			"status": "online",
			"cpu": 0.5,
			"memory": 62275584,
			"uptime": 1761282745752,
			"restarts": 0,
			"script": "/Users/nick/Documents/The404Back/server.js",
			"exec_mode": "fork_mode",
			"instances": 1,
			"pid": 31029,
			"version": "0.0.0",
			"node_version": "22.19.0",
			"port": 8000
		},
		{
			"name": "Samurai04Web",
			"pm_id": 1,
			"status": "stopped",
			"cpu": 0,
			"memory": 0,
			"uptime": 0,
			"restarts": 5,
			"script": "/Users/nick/.nvm/versions/node/v22.19.0/bin/npm",
			"exec_mode": "fork_mode",
			"instances": 1,
			"pid": null,
			"version": "0.40.3",
			"node_version": "22.19.0",
			"port": 8002
		}
	]
}
```

**Notes:**

- Port information is read from the `ecosystem.config.js` file specified in `PATH_PM2_ECOSYSTEM` environment variable
- Empty array is returned if no PM2 apps are running

**Error Responses:**

**401 Unauthorized - Missing or Invalid Token:**

```json
{
	"error": "Access denied. No token provided."
}
```

**503 Service Unavailable - PM2 Not Available:**

```json
{
	"error": "PM2 is not installed or not available",
	"managedAppsArray": []
}
```

**500 Internal Server Error:**

```json
{
	"error": "Failed to retrieve PM2 applications",
	"managedAppsArray": []
}
```

---

### POST /pm2/toggle-app-status/:name

Toggle the status of a PM2 application. If the app is online, it will be stopped. If stopped, it will be started. If in an error state, it will be restarted.

**Authentication:** Required (JWT token)

**URL Parameters:**

- `name` (string, required) - Name of the PM2 application to toggle

**Request:**

```http
POST /pm2/toggle-app-status/Samurai04Web HTTP/1.1
Host: localhost:3000
Authorization: Bearer <your_jwt_token>
```

**Request Example:**

```bash
curl --location --request POST 'http://localhost:3000/pm2/toggle-app-status/Samurai04Web' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**Success Response - Stopped App (200 OK):**

```json
{
	"message": "App stopped successfully",
	"app": {
		"name": "Samurai04Web",
		"status": "stopped",
		"action": "stop"
	}
}
```

**Success Response - Started App (200 OK):**

```json
{
	"message": "App started successfully",
	"app": {
		"name": "Samurai04Web",
		"status": "online",
		"action": "start"
	}
}
```

**Success Response - Restarted App (200 OK):**

```json
{
	"message": "App restarted successfully",
	"app": {
		"name": "Samurai04Web",
		"status": "online",
		"action": "restart"
	}
}
```

**Error Responses:**

**400 Bad Request - Missing App Name:**

```json
{
	"error": "App name is required"
}
```

**401 Unauthorized - Missing or Invalid Token:**

```json
{
	"error": "Access denied. No token provided."
}
```

**404 Not Found - App Not Found:**

```json
{
	"error": "App \"NonExistentApp\" not found"
}
```

**503 Service Unavailable - PM2 Not Available:**

```json
{
	"error": "PM2 is not installed or not available"
}
```

**500 Internal Server Error:**

```json
{
	"error": "Failed to toggle app status"
}
```

### GET /pm2/logs/:appName

Retrieve the latest lines from the specified PM2 application's log or error file.

**Authentication:** Required (JWT token)

**URL Parameters:**

- `appName` (string, required) — Name of the PM2 application

**Query Parameters:**

- `type` (string, optional) — Log type:
  - `out` → output log _(default)_
  - `err` → error log
- `lines` (number, optional) — Number of lines to return from the log file _(default: 500)_

**Request Example:**

```bash
curl --location 'http://localhost:3000/pm2/logs/Samurai04Web?type=out&lines=700' --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**Success Response (200 OK):**

```json
{
	"appName": "Samurai04Web",
	"type": "out",
	"lines": [
		"Server started...",
		"Listening on port 8000",
		"Connected to MongoDB",
		"..."
	]
}
```

**Error Responses:**

**404 Not Found — Log File Not Found**

```json
{ "error": "Log file not found" }
```

**500 Internal Server Error**

```json
{ "error": "Failed to read log file" }
```
