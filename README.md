# FeedFlow

Food Waste Management & Donation Platform - Frontend Foundation

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS** (mobile-first)
- **shadcn/ui**
- **Zustand** (state management)
- **React Hook Form**
- **Zod** (validation)
- **Framer Motion** (animations)
- **Lucide Icons**

## Project Structure

```
app/
 ├─ auth/
 │   ├─ login/page.tsx
 │   ├─ register/page.tsx
 ├─ donor/page.tsx
 ├─ ngo/page.tsx
 ├─ volunteer/page.tsx
 ├─ admin/page.tsx
 ├─ notifications/page.tsx
 ├─ reports/page.tsx
 ├─ layout.tsx
 └─ page.tsx

components/
 ├─ ui/          # shadcn/ui components
 ├─ Header.tsx
 ├─ Sidebar.tsx
 ├─ MobileNav.tsx
 └─ StatusBadge.tsx

lib/
 ├─ store.ts     # Zustand global store
 └─ utils.ts     # Utility functions

mock/
 ├─ users.ts
 ├─ foods.ts
 ├─ requests.ts
 ├─ tasks.ts
 └─ notifications.ts
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- ✅ Next.js App Router setup
- ✅ TypeScript configuration
- ✅ Tailwind CSS with mobile-first design
- ✅ shadcn/ui components
- ✅ Zustand global state management
- ✅ Responsive layout (desktop sidebar + mobile bottom nav)
- ✅ Mock data structure
- ✅ StatusBadge component
- ✅ Clean folder structure

## Notes

- This is a **frontend-only** foundation
- No business logic or workflows implemented
- No API calls - uses mock data only
- Ready for parallel feature development

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint




