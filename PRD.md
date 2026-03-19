# Product Requirements Document (PRD)
**Project:** Farm Day
**Phase:** 1 - Requirements
**Status:** Approved

## 1. Executive Summary
**Goal:** Build a centralized webapp directory ("Farm Day") for agri-tourism spots (u-pick farms, farm activities, farmers markets) within a 120-mile radius of Greenville, SC. 
**Target Audience:** Families and individuals looking for local farm experiences and agri-tourism events.

## 2. Key Features (MVP)
1. **Search & Discovery (The "Airbnb" Experience):**
   - Map-based and list-based discovery of local farms and markets.
   - Filter by activity type (u-pick, farm fun, market, events, etc.).
   - Distance/radius filtering (centered around Greenville, SC, up to 120 miles).
2. **Location/Listing Pages:**
   - Detailed pages for each farm/market.
   - Information: Address, hours of operation, seasonality, available activities, contact info, and photos.
3. **User Roles:**
   - **Visitor:** Browse, search, view listings.
   - **Admin:** Add, edit, and curate farm listings.
4. **Design & UX:**
   - Inspired by Airbnb (clean, photo-heavy, intuitive map integration, mobile-first responsive design).

## 3. Non-Functional Requirements
- **Infrastructure:** Serverless architecture (scalable, low-maintenance).
- **Hosting & Deployment:** Netlify.
- **Source Control:** GitHub (dedicated account).

## 4. Open Questions / Next Steps (Architecture Phase)
- Map provider selection (Mapbox vs. Google Maps vs. Leaflet).
- Database strategy for storing location data (e.g., Supabase, Firebase, or a headless CMS).

---
*PO Approval Required to proceed to Phase 2: Architecture.*