# Lynkerr 🌍
### Mini Travel Experience Listing Platform

> **Stack:** React + Vite + Tailwind CSS · Django REST Framework · MySQL  
> **Deployment:** Vercel (Frontend) · Render (Backend) · Railway (MySQL)

---

## 1. Project Overview

Lynkerr is a mini travel experience listing platform where local guides and experience operators can publish their offerings, and travelers can discover, browse, and explore them.

**The problem it solves:** Finding unique, local travel experiences is fragmented across social media and generic booking sites. Lynkerr gives operators a dedicated space to post their experiences with rich detail (title, location, description, image, price), and gives travelers a clean, searchable feed to discover them.

**Core user flows:**
- Anyone can **browse** the public feed without an account
- Registered users can **create** new travel experience listings
- Listing owners can **edit or delete** their own listings
- **Search** by title or location, with **paginated** results (9 per page)

---

## 2. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 19 + Vite | Fast dev server, modern React with hooks |
| Styling | Tailwind CSS v4 | Utility-first, rapid dark UI implementation |
| HTTP Client | Axios | Interceptors for automatic JWT refresh |
| Routing | React Router v7 | Client-side navigation, protected routes |
| Backend | Django 5 + Django REST Framework | Rapid API development, built-in auth, ORM |
| Auth | SimpleJWT + Token Blacklist | Stateless JWT with secure refresh rotation |
| Database | MySQL 8 | Relational, reliable, production-ready |
| CORS | django-cors-headers | Manages cross-origin requests cleanly |
| Static files | Whitenoise | Serves Django admin/static without a CDN |
| Web server | Gunicorn | Production WSGI server for Render |
| DB hosting | Railway | Managed MySQL with easy credential export |
| Backend hosting | Render | Free-tier Python web services |
| Frontend hosting | Vercel | Zero-config React/Vite deployment |

---

## 3. Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8 running locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env` and fill in your MySQL credentials:
```
SECRET_KEY=your-django-secret-key
DEBUG=True
DB_NAME=lynkerr_db
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306
FRONTEND_URL=http://localhost:5173
```

Create the MySQL database:
```sql
CREATE DATABASE lynkerr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run migrations and start the server:
```bash
python manage.py migrate
python manage.py runserver
```

Backend API is now running at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

The `.env` should contain:
```
VITE_API_URL=http://localhost:8000/api
```

Start the dev server:
```bash
npm run dev
```

Frontend is now running at `http://localhost:5173`

---

## 4. Features Implemented

- [x] **User registration** — username, email, password with validation
- [x] **User login / logout** — JWT access + refresh tokens, token blacklisting on logout
- [x] **Auto token refresh** — Axios interceptor silently refreshes expired access tokens
- [x] **Public feed** — All listings visible to unauthenticated users, newest first
- [x] **Create listing** — Title, location, image URL, description, optional price (auth required)
- [x] **Listing detail page** — Full listing view with image, metadata, owner info
- [x] **Edit listing** — Owner-only edit form, pre-populated with existing data
- [x] **Delete listing** — Owner-only delete with confirmation dialog
- [x] **Search** — Real-time search by title or location with 400ms debounce
- [x] **Pagination** — 9 listings per page with Prev / Next navigation
- [x] **Responsive UI** — Mobile-first design, hamburger nav on small screens
- [x] **Dark theme** — Deep black (`#0A0A0A`) with orange (`#F97316`) accents throughout
- [x] **Loading skeletons** — Animated placeholder cards during data fetching
- [x] **Empty & error states** — Graceful fallbacks with retry and CTA buttons
- [x] **Owner-only actions** — Edit/Delete buttons only shown to the listing's creator

---

## 5. Architecture & Key Decisions

### Backend Architecture

```
Django Project (lynkerr/)
├── users/          ← Custom auth views: register, logout
├── listings/       ← CRUD API with owner permissions
└── lynkerr/        ← settings, urls, wsgi
```

**JWT Authentication flow:**
1. `POST /api/auth/login/` returns `{ access, refresh }` tokens
2. Frontend stores `access` in memory (`window.__accessToken`) and `refresh` in `localStorage`
3. Every API request attaches `Authorization: Bearer <access>` via Axios request interceptor
4. On 401 response, the response interceptor calls `/api/auth/token/refresh/` automatically and retries the original request — the user never sees an auth error during a valid session
5. On logout, the refresh token is blacklisted server-side via `rest_framework_simplejwt.token_blacklist`

**Permission model:**
- `GET` (list, detail) → public, no auth required
- `POST` (create) → any authenticated user
- `PUT/PATCH/DELETE` → only the listing owner (`IsOwnerOrReadOnly` custom permission class)

**Database indexes:** `location` and `created_at` fields on the `Listing` model are indexed for fast search and feed ordering.

### Frontend Architecture

```
src/
├── api/            ← Axios instance + auth/listings API helpers
├── context/        ← AuthContext (user state, login/logout)
├── components/     ← Navbar, ListingCard, ListingForm, ProtectedRoute, ConfirmDialog
├── pages/          ← HomePage, LoginPage, RegisterPage, CreateListingPage, DetailPage, EditPage
└── utils/          ← timeAgo() helper
```

**State management:** React Context (`AuthContext`) handles global auth state. No Redux needed at this scale — all other state is local to each page (listings array, pagination, search term, loading).

**Protected routes:** `<ProtectedRoute>` wraps Create and Edit pages — unauthenticated users are redirected to `/login`.

**Key decision — CORS in development:** `CORS_ALLOW_ALL_ORIGINS = True` when `DEBUG=True` to avoid port-mismatch issues locally. In production, only the deployed Vercel domain is allowed.

---

## 6. Product Thinking: Scaling to 10,000 Listings

With 10,000 listings, the current architecture holds up well with a few targeted changes:

**Database:**
- The existing `db_index=True` on `location` and `created_at` means feed and search queries stay fast even at large scale
- For full-text search beyond simple `LIKE` queries, switch Django's `SearchFilter` to use MySQL's `FULLTEXT` index on `title` and `location` columns: `ALTER TABLE listings_listing ADD FULLTEXT(title, location)`
- Add a `LIMIT` to the queryset and ensure the DRF pagination (currently 9 per page) is enforced at the database level with `LIMIT/OFFSET`, which it already is via `PageNumberPagination`

**API performance:**
- Add `django-redis` caching for the public feed endpoint (`GET /api/listings/`) with a 30-second TTL — most visitors never modify listings, so the same queryset can be served from cache
- Use `select_related('user')` on all listing queries (already implemented) to avoid N+1 queries even at large list sizes

**Frontend:**
- Replace the current full-page re-fetch on every search keystroke (debounced) with cursor-based pagination for infinite scroll — better UX at scale
- Add image CDN (Cloudflare Images or Cloudinary) so listing creators upload images rather than pasting URLs — more reliable and faster loading globally

**Infrastructure:**
- Render free tier hibernates after 15 minutes of inactivity — upgrade to a paid instance or use a health-check ping service to eliminate cold starts for a production launch
- Railway MySQL automatically scales storage; no changes needed there until ~1M rows

**Feature additions that become important at scale:**
- Category/tag filtering so users can narrow 10,000 listings to "Hiking in Bali" without a text search
- Owner dashboard showing only the logged-in user's listings
- Soft delete (add `is_active` flag) rather than hard delete, preserving historical data

The current stack (Django + MySQL + React) can comfortably handle 10,000 listings with the index and caching additions above — a rewrite is not needed at this scale.