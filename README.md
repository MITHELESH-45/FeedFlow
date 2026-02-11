# FeedFlow

FeedFlow is a multi-role food rescue platform that helps donors share surplus food, NGOs request and receive it, volunteers complete deliveries, and admins coordinate approvals and operations.

## Overview

FeedFlow combines a Next.js App Router frontend with server-side API routes backed by MongoDB (Mongoose), JWT authentication, and Cloudinary image upload support. The app includes dedicated experiences for:

- **Donors** (create donations, track donation history)
- **NGOs** (browse available food, place requests, confirm delivery)
- **Volunteers** (execute assigned pickup and drop workflows)
- **Admins** (approve NGOs and requests, assign volunteers, monitor reports)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS + shadcn/ui + Lucide icons
- **State**: Zustand
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcryptjs
- **Maps**: React Leaflet/OpenStreetMap + map utilities
- **Media**: Cloudinary
- **PWA**: `@ducanh2912/next-pwa`

## Core Architecture

### Application Layers

- `app/`: route-based UI pages + API route handlers
- `components/`: reusable UI and feature components
- `lib/`: shared infrastructure (auth, db connection, models, cloudinary, state)
- `shared/`: shared Zod schemas
- `scripts/`: utility scripts (e.g., admin seeding)

### Data Models

The backend uses five core Mongoose models:

- `User`: donors, NGOs, volunteers, admins (with NGO approval status)
- `Food`: donation listing lifecycle and pickup location
- `Request`: NGO request records for food items
- `Task`: volunteer delivery assignment and progression
- `Notification`: per-user notifications

## User Roles & Workflows

### Donor

- Upload food donations with metadata, quantity, timing, and location
- View donation history and dashboard metrics
- Manage donor profile

### NGO

- Browse available donations
- Place requests (must be approved NGO)
- Track request states and confirm final delivery completion
- Set/update NGO delivery location profile

### Volunteer

- Receive admin-assigned tasks
- Progress through delivery lifecycle:
  - `assigned → accepted → picked_up → reached_ngo`
- View task details with pickup/drop location context
- Track volunteer history and profile

> Volunteers cannot mark tasks as fully `completed`; final confirmation is done by NGOs.

### Admin

- View platform-wide dashboard and reports
- Approve/reject NGO registrations
- Approve/reject donation requests
- Assign volunteers to eligible deliveries
- Monitor deliveries, foods, and volunteer availability

## Status Lifecycles

### Food Lifecycle

`available → requested → approved → picked_up → reached_ngo → completed`

### Task Lifecycle

`assigned → accepted → picked_up → reached_ngo → completed`

## API Surface (high-level)

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Donor APIs

- `/api/donor/food`
- `/api/donor/dashboard`
- `/api/donor/donations`
- `/api/donor/profile`

### NGO APIs

- `/api/ngo/dashboard`
- `/api/ngo/available-food`
- `/api/ngo/available-food/[id]`
- `/api/ngo/requests`
- `/api/ngo/requests/[id]/complete`
- `/api/ngo/profile`
- `/api/ngo/profile/location`

### Volunteer APIs

- `/api/volunteer/tasks`
- `/api/volunteer/tasks/[id]`
- `/api/volunteer/tasks/[id]/status`
- `/api/volunteer/statistics`
- `/api/volunteer/profile`

### Admin APIs

- `/api/admin/dashboard`
- `/api/admin/ngos` + `/api/admin/ngos/[id]/approve|reject`
- `/api/admin/requests` + `/api/admin/requests/[id]/approve|reject`
- `/api/admin/assign-volunteer`
- `/api/admin/foods`
- `/api/admin/volunteers`
- `/api/admin/deliveries`
- `/api/admin/reports`

### Notifications / Health

- `/api/notifications`
- `/api/notifications/[id]/read`
- `/api/health`

## Authentication

- Login/register endpoints issue JWT tokens.
- Clients store token and send `Authorization: Bearer <token>` for protected routes.
- Role-based checks are enforced in route handlers using helper utilities.

## Environment Variables

Create `.env.local` in the project root:

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# optional unless you upload images
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Scripts

- `npm run dev` — Start local development server
- `npm run build` — Production build
- `npm run start` — Run production build
- `npm run lint` — Lint checks
- `npm run seed:admin` — Create default admin user in DB

## Default Admin Credentials

A bootstrap admin login flow exists and `seed:admin` is available.

- Email: `admin@gmail.com`
- Password: `admin123`

> For production, rotate credentials and set a strong `JWT_SECRET`.

## PWA & UX Notes

- PWA plugin is enabled through Next config.
- Manifest and service worker assets are configured under `public/`.
- The app includes responsive layouts for desktop and mobile role dashboards.

## Current Project Notes

- Build config currently ignores TypeScript and ESLint build errors in `next.config.mjs`; consider enabling strict checks before production.
- Some legacy mock files remain for UI prototyping, while most role flows already use API routes.

## Suggested Next Improvements

- Add automated integration tests for critical role workflows
- Replace bootstrap admin credential pattern with secure provisioning
- Add token refresh/session expiry UX handling
- Tighten runtime validation and request schemas across all API routes

---

If you want, I can also generate a **developer-focused README variant** (with endpoint request/response examples and sequence diagrams for each role workflow).
