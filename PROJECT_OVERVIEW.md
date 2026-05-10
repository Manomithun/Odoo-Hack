# Traveloop Project Overview

This document explains the database design, the project structure, and the main features of the Traveloop travel planning app.

## Database Design

The backend uses Prisma with a PostgreSQL database. The main tables and relationships are:

- `users`
  - Stores registered users.
  - Fields: `id`, `full_name`, `email`, `password_hash`, `profile_image`, `bio`, `language`, `is_verified`, `is_admin`, timestamps.
  - Relationships:
    - has many `trips`
    - has many `saved_destinations`
    - has many `user_activity_logs`

- `trips`
  - Stores trip plans created by users.
  - Fields: `id`, `user_id`, `title`, `description`, `start_date`, `end_date`, `cover_image`, `total_estimated_budget`, `visibility`, timestamps.
  - Relationships:
    - belongs to `user`
    - has many `trip_stops`
    - has many `budgets`
    - has many `packing_items`
    - has many `trip_notes`
    - has many `shared_trips`

- `cities`
  - Stores destination city data.
  - Fields: `id`, `city_name`, `country_name`, `region`, `description`, `cost_index`, `popularity_score`, `image_url`, `latitude`, `longitude`, timestamp.
  - Relationships:
    - has many `activities`
    - has many `trip_stops`
    - has many `saved_destinations`

- `trip_stops`
  - Stores individual stops inside a trip.
  - Fields: `id`, `trip_id`, `city_id`, `arrival_date`, `departure_date`, `stop_order`, `notes`, timestamp.
  - Relationships:
    - belongs to `trip`
    - belongs to `city`
    - has many `trip_activities`
    - has many `trip_notes`

- `activities`
  - Stores activities linked to cities.
  - Fields: `id`, `city_id`, `title`, `description`, `category`, `duration_hours`, `estimated_cost`, `rating`, `image_url`, timestamp.
  - Relationships:
    - belongs to `city`
    - has many `trip_activities`

- `trip_activities`
  - Connects activities to a specific trip stop.
  - Fields: `id`, `trip_stop_id`, `activity_id`, `activity_date`, `start_time`, `end_time`, `estimated_cost`, `custom_notes`, timestamp.
  - Relationships:
    - belongs to `trip_stop`
    - belongs to `activity`

- `budgets`
  - Stores budget items for a trip.
  - Fields: `id`, `trip_id`, `category`, `amount`, `description`, timestamp.
  - Relationships:
    - belongs to `trip`

- `packing_items`
  - Stores packing list items for a trip.
  - Fields: `id`, `trip_id`, `item_name`, `category`, `is_packed`, timestamp.
  - Relationships:
    - belongs to `trip`

- `trip_notes`
  - Stores notes for a trip or a specific trip stop.
  - Fields: `id`, `trip_id`, `trip_stop_id`, `title`, `content`, timestamp.
  - Relationships:
    - belongs to `trip`
    - optionally belongs to `trip_stop`

- `saved_destinations`
  - Stores cities saved by a user.
  - Fields: `id`, `user_id`, `city_id`, timestamp.
  - Unique composite key: `[user_id, city_id]`
  - Relationships:
    - belongs to `user`
    - belongs to `city`

- `shared_trips`
  - Stores public share links for trips.
  - Fields: `id`, `trip_id`, `share_token`, `view_count`, timestamp.
  - Relationships:
    - belongs to `trip`

- `user_activity_logs`
  - Tracks user actions and events.
  - Fields: `id`, `user_id`, `action`, `metadata`, timestamp.
  - Relationships:
    - belongs to `user`

## Project Structure

### Frontend (`client/`)

- `src/main.jsx` - app bootstrap file.
- `src/App.jsx` - top-level app layout and route container.
- `src/routes/RouteGuards.jsx` - private route handling.
- `src/layouts/DashboardLayout.jsx` - shared dashboard UI layout.
- `src/pages/` - contains page views grouped by feature.
  - `activities/` - search and activity pages.
  - `admin/` - admin dashboard.
  - `auth/` - login and register pages.
  - `cities/` - city details and city listing pages.
  - `community/` - community features.
  - `dashboard/` - user dashboard pages.
  - `landing/` - marketing/home pages.
  - `profile/` - user profile pages.
  - `saved/` - saved destinations and favorites.
  - `share/` - shared trip views.
  - `trips/` - trip planning and detail pages.
- `src/services/` - API integration logic.
  - `api.js` - shared Axios settings.
  - `auth.service.js` - authentication requests.
  - `city.service.js` - city-related API calls.
  - `trip.service.js` - trip-related API calls.
- `src/store/` - Zustand stores for auth and UI state.
- `src/index.css`, `src/App.css` - global styling.
- `public/` - static assets.

### Backend (`server/`)

- `src/app.js` - Express application startup.
- `src/routes/` - API route definitions.
  - `auth.routes.js`
  - `trip.routes.js`
  - `city.routes.js`
  - `activity.routes.js`
  - `budget.routes.js`
  - `packing.routes.js`
  - `note.routes.js`
  - `share.routes.js`
  - `stop.routes.js`
  - `admin.routes.js`
  - `index.js` - main router aggregator.
- `src/controllers/` - request handlers.
- `src/services/` - business logic and workflow.
- `src/repositories/` - direct Prisma database access.
- `src/validations/` - request validation using Zod.
- `src/middlewares/` - auth, error handling, validation.
- `src/utils/` - helper functions, response formatting, token utilities.
- `prisma/` - schema, migrations, and seed data.

## Main Features

- User registration and login with JWT authentication.
- Create, edit, and delete travel plans (`trips`).
- Add destination stops to a trip with arrival and departure dates.
- Browse and save city destinations.
- Search and attach activities to trip stops.
- Track trip budgets and estimated costs.
- Build packing lists with pack/unpack status.
- Write trip notes and stop-specific notes.
- Share a trip with a public link and track views.
- Admin dashboard features for managing app data.
- Activity logging for user events.
- Responsive UI with a clean dashboard layout.

## API Endpoints

The backend API is exposed under `/api`.

### Auth

- `POST /api/auth/register` - create a new user
- `POST /api/auth/login` - authenticate and receive a token
- `GET /api/auth/profile` - get the current user profile (authenticated)
- `PUT /api/auth/profile` - update the current user profile (authenticated)

### Trips

- `GET /api/trips` - list trips for the current user
- `POST /api/trips` - create a new trip
- `GET /api/trips/:id` - get trip details by ID
- `PUT /api/trips/:id` - update a trip
- `DELETE /api/trips/:id` - delete a trip

### Trip nested features

- `POST /api/trips/:tripId/stops` - add a stop to a trip
- `PUT /api/trips/:tripId/stops/reorder` - reorder trip stops
- `GET /api/trips/:tripId/budget` - get budget items for a trip
- `POST /api/trips/:tripId/budget` - add a budget item
- `GET /api/trips/:tripId/packing` - get the trip packing list
- `POST /api/trips/:tripId/packing` - add a packing item
- `GET /api/trips/:tripId/notes` - list notes for a trip
- `POST /api/trips/:tripId/notes` - create a trip note
- `POST /api/trips/:tripId/share` - generate a share link for a trip

### Stops

- `PUT /api/stops/:id` - update a trip stop
- `DELETE /api/stops/:id` - delete a trip stop
- `POST /api/stops/:stopId/activities` - attach an activity to a trip stop

### Trip activities

- `DELETE /api/trip-activities/:id` - remove an activity from a trip stop

### Cities

- `GET /api/cities` - list available cities
- `GET /api/cities/:id` - get details for a specific city
- `GET /api/cities/:cityId/activities` - get activities available in a city

### Budget

- `DELETE /api/budget/:id` - delete a budget entry

### Packing

- `PUT /api/packing/:id` - update a packing item
- `DELETE /api/packing/:id` - delete a packing item

### Notes

- `DELETE /api/notes/:id` - delete a note

### Sharing and saved destinations

- `GET /api/public/:token` - view a shared trip by token
- `GET /api/saved` - list saved cities for the current user
- `POST /api/saved` - save a city
- `DELETE /api/saved/:cityId` - remove a saved city

### Admin

- `GET /api/admin/stats` - platform metrics and stats (admin only)
- `GET /api/admin/users` - list users (admin only)

## How to use this overview

- Use the DB design section to understand the main data entities and how they connect.
- Use the project structure section to find where frontend and backend logic lives.
- Use the features section to see what the app already supports and what each part is built for.

This file is meant as a quick reference for developers working on Traveloop.