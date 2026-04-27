# ♻️ EcoLocator

EcoLocator is a web-based waste collection and recycling locator system that helps users find nearby recycling centers using an interactive map.

## 🚀 Overview

This project consists of:
- 🌍 Public Web App (for users)
- 🛠️ Admin Panel (for managing data)
- 🔌 API Backend (Laravel)

## 🛠️ Tech Stack

| Layer     | Technology            |
| --------- | --------------------- |
| Frontend  | Next.js, Tailwind CSS |
| Backend   | Laravel               |
| Database  | MySQL                 |
| Maps      | Google Maps API       |

## ✨ Key Features

### 🌍 Public Features
- Interactive map-based search
- Filter by material types
- Location autocomplete (Google Places)
- Suggest new recycling locations
- Contact form

### 🛠️ Admin Features
- Dashboard statistics
- Manage recycling centers
- Manage material types
- Review location suggestions
- Manage contact messages

# ⚙️ System Requirements

## Software Requirements

### Backend
- PHP >= 8.1
- Composer
- Laravel Framework

### Frontend
- Node.js >= 18
- pnpm / npm / yarn

### Database
- MySQL / MariaDB

### Development Tools
- Git
- Web browser (Chrome, Edge, Firefox)
- Docker (optional)

### External Services
- Google Maps JavaScript API
- Google Places API

A valid API key is required for map rendering, location search, and geolocation features. You can quickly get a demo key <a href="https://mapsplatform.google.com/maps-demo-key/" target="blank">here</a>.

# 📦 Project Structure

```
root/
│
├── apps/
│   ├── api/        # Laravel backend API
│   └── web/        # Next.js frontend
│
└── infra/          # Infrastructure and Docker configuration
```

# 🛠️ Local Setup Guide

## Clone the Repository

```bash
git clone https://github.com/jamloresto/cmsc-207-ecolocator.git
cd cmsc-207-ecolocator
```

---

## Install Frontend & Workspace Dependencies

Using **pnpm (recommended)**:

```bash
cd apps/web
pnpm install
```

> This installs all dependencies including `node_modules`.

Configure .env.local

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Run the Web App

```bash
pnpm run dev
```

>Frontend will run at: http://localhost:3000

---

## Setup Backend (Laravel API) & install PHP dependencies

Go to the API folder:

```bash
cd apps/api
composer install

cp .env.example .env
php artisan key:generate
```

### Configure Database

Edit `.env`:

```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecolocator
DB_USERNAME=app_user
DB_PASSWORD=secret
```

### Create Database

#### If using MySQL:

```sql
CREATE DATABASE ecolocator;
```

#### If using Docker:

```bash
docker compose -f infra/ecolocator/docker-compose.yml up -d
```

### Run Migrations

```bash
php artisan migrate
php artisan db:seed
```

### Run the Backend Server

```bash
php artisan serve
```

>Backend will run at: http://127.0.0.1:8000

## 🧪 Running Tests

```bash
php artisan test
```

## 📄 API Documentation (Swagger)

Generate Swagger docs:

```bash
php artisan l5-swagger:generate
```

>Access documentation: http://127.0.0.1:8000/api/documentation

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

## 📄 Documentation

Full system documentation is available separately.

---

# 👨‍💻 Author

This project was designed and developed by <b>Jessa Mae Hernandez</b>

### Contact

For inquiries, suggestions, or collaboration, message: Jessa Mae Hernandez (https://www.linkedin.com/in/jam-hernandez/)