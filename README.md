# PetConnect 🐾

**PetConnect** is a pet adoption and breeding platform designed to connect pet owners, prospective adopters, and animal shelters in Türkiye.

The application features a React and Vite frontend, a Node.js and Express backend, and a PostgreSQL database. It provides user authentication, pet listings, shelter profiles, favorites, contact forms, and administrative management tools.

## 📋 Project Structure

```text
petconnect/
├── src/                        # Frontend (React + Vite + Tailwind CSS)
│   └── app/
│       ├── components/         # Reusable UI components
│       ├── context/            # Authentication context (JWT sessions)
│       ├── lib/
│       │   └── api.ts          # Axios client (/api proxy)
│       ├── pages/              # Page components
│       └── routes.tsx          # React Router configuration
├── backend/                    # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js               # PostgreSQL connection pool
│   ├── controllers/            # Business logic layer
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── migrations/             # Sequential SQL migration files
│   ├── routes/                 # Express route handlers
│   ├── server.js               # Application entry point
│   ├── migrate.js              # Database migration runner
│   ├── seed.js                 # Demo data seeder
│   └── package.json
├── start.sh                    # Startup script for frontend and backend
├── vite.config.ts              # Vite configuration and /api proxy
└── package.json                # Frontend dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- PostgreSQL database

### Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=3001
JWT_SECRET=your_secret_key_here
DATABASE_URL=your_postgresql_connection_string
```

Configure your PostgreSQL connection using the appropriate environment variables for your environment, such as `DATABASE_URL`, `PGHOST`, and related PostgreSQL settings.

**Security note:** Use a strong, unique JWT secret and never commit real credentials or secrets to version control.

### Install Dependencies

Install the frontend dependencies:

```bash
npm install
```

Install the backend dependencies:

```bash
cd backend
npm install
cd ..
```

### Run the Application

Start the application using:

```bash
bash start.sh
```

The startup script is designed to:

1. Test the PostgreSQL connection.
2. Run database migrations in sequence.
3. Load demo data on the initial setup.
4. Start the backend server on port `3001`.
5. Start the Vite development server on port `5000`.

*Note: Actual startup behavior depends on the project's current configuration and environment.*

## 🔌 API Endpoints

All endpoints use the `/api` prefix.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in and receive a JWT |
| `GET` | `/api/auth/me` | Retrieve the current user's information |

### Pet Listings

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pets` | List pet listings with filtering |
| `GET` | `/api/pets/:id` | Retrieve pet details |
| `POST` | `/api/pets` | Create a pet listing (authenticated) |
| `PUT` | `/api/pets/:id` | Update a pet listing (authenticated) |
| `DELETE` | `/api/pets/:id` | Delete a pet listing (authenticated) |

### Shelters

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/shelters` | List animal shelters |
| `GET` | `/api/shelters/:id` | Retrieve shelter details |
| `POST` | `/api/shelters` | Register a shelter (admin) |

### Favorites

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/favorites` | Retrieve the user's favorite listings (authenticated) |
| `POST` | `/api/favorites/:petId` | Add a listing to favorites (authenticated) |
| `DELETE` | `/api/favorites/:petId` | Remove a listing from favorites (authenticated) |

### Administration

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/stats` | Retrieve platform statistics |
| `GET` | `/api/admin/users` | Manage users |
| `GET` | `/api/admin/pets` | Manage pet listings |
| `PUT` | `/api/admin/pets/:id/approve` | Approve a pet listing |

### Contact

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/contact` | Submit a contact form |

*Authenticated and administrator-only endpoints require the appropriate authorization.*

## 🧪 Demo Accounts

The seed script is intended to create the following demo accounts:

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@petconnect.com` | `Admin123!` |
| User | `ayse@example.com` | `User1234!` |
| Shelter | `info@patibarinak.com` | `Shelter123!` |

These credentials are for local development and demonstration purposes only. Do not use them in production.

## 🛠️ Technology Stack

### Frontend

- **React 18** — UI development
- **Vite 6** — Development server and build tooling
- **TypeScript** — Static type checking
- **Tailwind CSS 4** — Utility-first styling
- **React Router 7** — Client-side routing
- **Axios** — HTTP requests
- **shadcn/ui and Radix UI** — UI components

### Backend

- **Node.js and Express** — REST API server
- **PostgreSQL and `pg`** — Relational database
- **JSON Web Tokens (JWT)** — Authentication
- **bcryptjs** — Password hashing
- **MVC-inspired architecture** — Separation of controllers, routes, and configuration

## 🗄️ Database Schema

| Table | Description |
|---|---|
| `users` | User accounts and roles (`admin`, `user`, `shelter`) |
| `shelters` | Animal shelter profiles |
| `pets` | Pet listings for adoption and breeding |
| `pet_images` | Images associated with pet listings |
| `favorites` | Users' favorite pet listings |
| `contact_submissions` | Contact form submissions |
| `activities` | System activity logs |

Database migration files are stored in `backend/migrations/` and are designed to run in sequence. The migration runner is intended to support repeatable execution where migrations are implemented accordingly.

## 📌 Key Features

- User registration and login with JWT authentication
- Pet listing creation, viewing, updating, and deletion
- Pet adoption and breeding listings
- Animal shelter profiles
- Favorites management
- Contact form submissions
- Administrative dashboard and platform statistics
- PostgreSQL database with SQL migrations
- Demo data for local development
