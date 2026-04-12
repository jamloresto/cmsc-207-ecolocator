# ♻️ EcoLocator

### by Jessa Mae Hernandez

## 📌 Description

EcoLocator is a web-based application designed to help users easily locate nearby recycling centers and waste collection facilities. It provides essential information such as location, materials accepted, and contact details. Enhanced with real-time map interactions and smarter filtering.

---

## 🎯 Goal

To promote sustainable waste management by making recycling locations accessible and searchable for everyone.

---

## ✨ Features

### 🌍 Public Features
- 📍 Interactive Map-Based Search
  -  Displays recycling centers directly on a map
  -  Automatically updates results based on map movement (viewport-based filtering)
- 📡 Location Detection (Geolocation)
  -  Detects user’s location on first load (if allowed)
  -  Sets map center automatically for nearby results
- 🧠 Smart Map Behavior
  - Map auto-centers based on:
    - User location (on first load)
    - Search selection (autocomplete)
    - Selected recycling center
  - Debounced API requests when moving the map
  - Prevents duplicate requests using cancellation logic
- 🧭 Dynamic Map Filtering API
  -  Fetches only locations within the current map bounds
  -  Improves performance and scalability
- 🏷️ Material-Based Filtering
  -  Filter recycling centers by material types (e.g., plastic, batteries, e-waste)
  -  Supports multi-select filtering
  -  Includes:
     - Select All
     - Clear All
- 🧾 Compact Location Cards
  -  Displays key info (name + materials)
  -  Limits visible materials (e.g., first 3 + “See more”)
- 🔍 Search + Map Integration
  -  Searching updates map position instead of filtering list only
  -  Google Places Autocomplete integration
  -  Clicking a suggestion re-centers the map
- 📬 Contact Form
  -  Users can send inquiries to admins
- 📝 Location Suggestion System
  -  Users can suggest new recycling centers
  -  Supports material selection + custom input (“Others”)
---
### 🛠️ Admin Features
- 🔐 Role-Based Access
  -  Super Admin
  -  Editor
- 📊 Admin Dashboard
  -  Overview statistics:
  -  Total recycling centers
  -  Material types
  -  Pending suggestions
  -  Contact messages
- 🏢 Waste Collection Location Management
  -  CRUD operations
  -  Active/inactive status
- 🧾 Material Types Management
  -  Manage recyclable categories
  -  Only active types exposed to public API
- 📥 Contact Message Management
  -  Status tracking:
     -  new, read, replied, archived
  -  Pagination + filtering
- 🧠 Location Suggestion Moderation
  -  Review submitted suggestions
  -  Edit and enrich data
  -  Approve → becomes official location
  -  Reject → with review notes
- 📑 Standardized Table System
  -  Pagination
  -  Meta (total items, pages)
  -  Reusable table components
    -  Shared pagination + meta structure across backend and frontend
    -  Sortable columns
    -  Filterable datasets
    -  Consistent table UI system
- 📍 Interactive Location Picker
  - Search locations using Google Places Autocomplete
  - Click anywhere on the map to select coordinates
  - Draggable marker for fine adjustments
  - Map recenters automatically when a place is searched
  - Controlled selection – coordinates are only saved when clicking “Use selected point”
---
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