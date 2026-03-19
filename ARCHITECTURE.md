# Architecture Document
**Project:** Farm Day
**Phase:** 2 - Architecture
**Status:** Approved

## 1. System Overview
Farm Day is a serverless, mobile-first webapp designed to connect users with local agri-tourism spots within a 120-mile radius of Greenville, SC. It relies on community-sourced and admin-curated data rather than scraping, ensuring high quality and low legal risk. 

## 2. Tech Stack Recommendation
- **Frontend Framework:** React (Next.js) or Vue (Nuxt.js) – depending on Kiro's preference, optimized for mobile-first responsive design.
- **Hosting & Deployment:** Netlify (Serverless deployment, Edge Functions).
- **Database:** Supabase (PostgreSQL with built-in Row Level Security and API generation).
- **Authentication:** Supabase Auth (Passwordless via Magic Link or OAuth via Google/GitHub).
- **Maps:** Leaflet + OpenStreetMap (Free tier, no Google Maps API keys required).
- **Source Control:** GitHub (issues, PRs, actions).

## 3. Data Model
**Table: `locations`**
- `id` (UUID, Primary Key)
- `name` (String)
- `description` (Text)
- `address` (String)
- `latitude` (Decimal)
- `longitude` (Decimal)
- `activities` (Array/JSON: 'u-pick', 'farm fun', 'market', etc.)
- `hours_of_operation` (JSON)
- `contact_info` (JSON: phone, email, website)
- `created_by` (UUID, Foreign Key -> `users`)
- `status` (Enum: 'pending', 'approved', 'rejected') - for admin curation

**Table: `users`**
- `id` (UUID, Primary Key)
- `email` (String)
- `role` (Enum: 'visitor', 'admin')

## 4. API Surface
- **GET /api/locations:** Fetch approved locations (with optional filters for activity type and radius).
- **GET /api/locations/:id:** Fetch details for a specific location.
- **POST /api/locations:** Submit a new location (requires authentication, sets status to 'pending').
- **PUT /api/locations/:id:** Update location details (admin only or owner).

## 5. Mobile-First Considerations
- The UI will be designed for mobile screens first (bottom navigation, touch-friendly map interfaces, collapsible filters) and scaled up for desktop.
- No native mobile app is planned for MVP; the webapp must provide an app-like experience.

---
*PO Approval Required to proceed to Phase 3: Implementation.*