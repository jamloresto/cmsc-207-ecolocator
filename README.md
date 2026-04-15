# 1. Project Overview: ♻️ EcoLocator

## 📌 Project Title

Ecolocator: Waste Collection & Recycling Locator System

## 📄 Project Description

EcoLocator is a web-based application designed to help users easily locate nearby recycling centers and waste collection facilities. It provides essential information such as location, accepted materials, and contact details through an interactive, map-based interface.

The system integrates real-time geolocation, dynamic filtering, and map-based search capabilities to improve accessibility and usability. Additionally, it includes an administrative platform for managing recycling data and moderating user-submitted location suggestions.

---

## 🎯 Project Objectives

### General Objective

To promote sustainable waste management by providing an accessible and centralized platform for locating recycling centers.

### Specific Objectives

- Enable users to find nearby recycling centers using an interactive map
- Allow filtering of locations based on accepted material types
- Provide a system for users to suggest new recycling locations
- Implement an admin workflow to review, approve, and manage data
- Improve awareness and participation in environmental sustainability efforts

## 👥 Target Users

1. General Public
   - Individuals looking for recycling centers
   - Environmentally conscious users
   - Households practicing waste segregation
2. Administrators
   - System admins (Super Admin / Editor)
   - Organizations or LGUs managing recycling data

## ✨ Key Features

### 🌍 Public Features
- Interactive map-based search for recycling centers
- Automatic location detection (geolocation)
- Dynamic filtering by material types (e.g., plastic, e-waste, metals)
- Search with Google Places Autocomplete
- Location suggestion submission
- Contact form for inquiries

### 🛠️ Admin Features
- Dashboard with system statistics
- Waste collection location management (CRUD)
- Material type management
- Location suggestion moderation (approve/reject workflow)
- Contact message management with status tracking

## 💡 Significance of the Project

EcoLocator addresses a common problem: lack of accessible information on where to recycle waste. Many individuals are willing to recycle but are unable to do so due to limited knowledge of nearby facilities.

This system contributes to:

- Environmental sustainability by encouraging proper waste disposal
- Community awareness of recycling practices
- Data centralization for recycling centers

## 🧱 Scope and Limitations

### Scope
- Covers recycling centers and waste collection locations
- Provides location-based search within map bounds
- Supports material-based filtering
- Includes admin management system
- Allows user-generated location suggestions

### Limitations
- Requires internet connection
- Dependent on Google Maps API for map functionality
- Accuracy of data depends on admin validation and user submissions
- Limited to areas with available recycling data

## System Summary

EcoLocator is composed of two main components:

1. Public Web Application
  - Used by general users to search and explore recycling centers
  - Admin Management System
  - Used to manage data, moderate suggestions, and maintain system integrity

These components communicate through a centralized <b>API backend</b>, ensuring scalability and maintainability.


----------
### 🎨 UI/UX Enhancements
-  Responsive design (mobile + desktop optimized)
-  Sticky / dynamic header behavior
-  Smooth scrolling experience
-  Reusable UI components (tables, filters, badges, etc.)
-  Dark / Light mode support

## 🧠 Location Suggestion Workflow

EcoLocator implements a structured moderation system for adding new locations:

1. **Public Submission**
   - Users submit suggested recycling locations via API
   - Only basic information is required

2. **Admin Review**
   - Admins (Super Admin / Editor) can:
     - View all suggestions
     - Edit and enrich data (e.g., country, region, contact info)
     - Add review notes

3. **Approval Process**
   - Once approved:
     - A new record is created in `waste_collection_locations`
     - Suggestion is marked as `approved`
   - If rejected:
     - Suggestion is marked as `rejected`
     - Admin provides reason via `review_notes`

4. **Data Integrity**
   - Approval requires required fields (e.g., country_code, state_province)
   - Ensures only clean, verified data enters the main database

---

## 🏗️ Project Structure

This project uses a **monorepo setup**:

### apps/
- `api/` → Laravel backend (API)
- `web/` → Next.js (React-based framework)

### infra/
- Infrastructure configs (Docker, etc.)

### Root Files
- `docker-compose.yml`
- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`

---

## 🧰 Tech Stack

### Backend
- Laravel (PHP)
- MySQL
- Laravel Sanctum (authentication)
- OpenAPI (Swagger) for API documentation

### Frontend
- Next.js
- Tailwind CSS

### Dev Tools
- Docker (optional)
- PNPM (monorepo management)
---

## ⚙️ Requirements

Make sure you have the following installed:

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- PHP (v8.1+)
- Composer
- MySQL (or MySQL Workbench or MariaDB)
- Git
- Docker (optional)
- Required Google Maps API

---

## 🗺️ Google Maps API Key (Required)

EcoLocator uses Google Maps for the interactive map and location-based features.

To run the project locally, you need a Google Maps API Key.

### 🔑 Get a Demo API Key

You can quickly get a demo key here:
https://mapsplatform.google.com/maps-demo-key/

### ⚙️ Setup

Add your API key to your frontend .env file:

`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here`
### 📌 Notes
- Required for:
  - Map rendering
  - Location detection
  - Map-based filtering
- Without this key, the map will not load properly

---

## 🚀 Local Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/jamloresto/cmsc-207-ecolocator.git
cd cmsc-207-ecolocator
```

---

### 2. Install Frontend & Workspace Dependencies

Using **pnpm (recommended)**:

```bash
pnpm install
```

> This installs all dependencies including `node_modules` for the entire monorepo.

---

### 3. Setup Backend (Laravel API)

Go to the API folder:

```bash
cd apps/api
```

### Install PHP dependencies:

```bash
composer install
```

---

### 4. Setup Environment File

Copy `.env.example`:

```bash
cp .env.example .env
```

Generate app key

```bash
php artisan key:generate
```

---

### 5. Configure Database

Edit `.env`:

```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecolocator
DB_USERNAME=root
DB_PASSWORD=your_password
```

---

### 6. Create Database

Using MySQL:

```sql
CREATE DATABASE ecolocator;
```

---

### 7. Run Migrations

```bash
php artisan migrate
```

(Optional: seed data if available)

```bash
php artisan db:seed
```

---

### 8. Run the Backend Server

```bash
php artisan serve
```

>Backend will run at: http://127.0.0.1:8000

---

### 9. Run the Frontend

Go to web app:

```bash
cd ../web
pnpm dev
```

>Frontend will run at: http://localhost:3000

---

## 🧪 Running Tests

From `apps/api`:

```bash
php artisan test
```

---

## 📄 API Documentation (Swagger)

Generate Swagger docs:

```bash
php artisan l5-swagger:generate
```

Access documentation: http://127.0.0.1:8000/api/documentation


---

## 🐳 (Optional) Docker

If using Docker:

```bash
docker compose -f infra/ecolocator/docker-compose.yml up -d
```

---

## 🔑 Notes

- `node_modules` is **not included** in the repository → run `pnpm install`
- `.env` is **not included** → copy from `.env.example`
- Database must be **manually created** before running migrations
- Public users can:
  - View locations
  - Submit contact forms
  - Suggest new locations
- Admin users (Super Admin / Editor) can:
  - Manage waste collection locations
  - Review, edit, approve, or reject location suggestions
- Location suggestions go through a **review + approval workflow**
  before becoming official locations

---

## 📬 Contact

For inquiries, suggestions, or collaboration, message: Jessa Mae Hernandez (https://www.linkedin.com/in/jam-hernandez/)