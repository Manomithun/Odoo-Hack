# Traveloop

A travel planning app with a React + Vite frontend and an Express + Prisma backend.

## What this project is

This project is a modern travel planner with features for managing trips, cities, activities, budgets, packing lists, notes, and sharing plans. It uses:

- **React** for the client UI
- **Vite** for fast frontend development
- **Express** for the backend API
- **Prisma** for database access
- **JWT** for authentication
- **Tailwind CSS** for styling

## Project structure

- `client/` - frontend app
  - `src/` contains pages, routes, services, and store logic
  - `public/` contains static assets
- `server/` - backend API
  - `src/app.js` starts the Express server
  - `src/controllers/` handles request logic
  - `src/routes/` defines API endpoints
  - `src/services/` contains business logic
  - `src/repositories/` handles database calls
  - `src/validations/` checks input data
  - `src/utils/` contains reusable helpers
  - `server/prisma/` contains Prisma schema, seeds, and migrations

## Setup

### 1. Clone the repo

```bash
git clone <repo-url>
cd odoo
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Configure environment variables

Create a `.env` file inside `server/` and add values like:

```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_secret_here
```

Adjust `DATABASE_URL` if you use a different database.

### 5. Run Prisma setup

From the `server/` folder:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Running the app

### Backend

From the `server/` folder:

```bash
npm run dev
```

This starts the API server on the configured port.

### Frontend

From the `client/` folder:

```bash
npm run dev
```

This starts the React app locally.

## Common commands

### Backend

- `npm run dev` - run backend in development with nodemon
- `npm run start` - run backend normally
- `npm run db:migrate` - apply database migrations
- `npm run db:seed` - seed the database
- `npm run db:reset` - reset migrations and reseed

### Frontend

- `npm run dev` - start the Vite development server
- `npm run build` - build the frontend for production
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint

## Notes

- The backend uses **Prisma** and expects a supported database connection in `server/.env`.
- The frontend uses **React Router** and client-side pages under `client/src/pages/`.
- Authentication is handled using **JWT tokens**.

## Troubleshooting

- If the frontend cannot reach the backend, make sure both servers are running and the API URL is correct in `client/src/services/api.js`.
- If Prisma migrations fail, verify your `DATABASE_URL` and run `npm run db:generate` again.

---

Thanks for checking out Traveloop. The app is built for fast travel planning and easy local development.