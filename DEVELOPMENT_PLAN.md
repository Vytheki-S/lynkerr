# 🌍 Lynkerr — Full Development Plan
### Mini Travel Experience Listing Platform

> **Stack:** React + Vite + Tailwind CSS · Django REST Framework · MySQL  
> **Deployment:** Vercel (Frontend) · Render (Backend) · Railway (MySQL)  
> **Color Palette:** Deep black UI with orange accents

---

## 🎨 Design System

| Token | Hex | Usage |
|---|---|---|
| Background | `#0A0A0A` | Page background |
| Card surface | `#111111` | Listing cards, panels |
| Elevated surface | `#1C1C1C` | Modals, dropdowns |
| Border default | `#1F2937` | Card borders, dividers |
| Border hover | `#F97316` | Orange glow on hover |
| Primary CTA | `#F97316` | Buttons, links, badges |
| CTA hover | `#EA580C` | Button hover state |
| Heading | `#FFFFFF` | H1–H4, card titles |
| Body text | `#D1D5DB` | Paragraphs, descriptions |
| Muted text | `#6B7280` | Timestamps, placeholders |
| Location text | `#F97316` | Location labels (stand out) |
| Price badge | `#F97316` bg + `#FFFFFF` text | Price display |
| Error | `#EF4444` | Validation errors, alerts |
| Success | `#22C55E` | Success messages |

**Tailwind config additions required in `tailwind.config.js`:**
```js
extend: {
  colors: {
    brand: {
      DEFAULT: '#F97316',
      hover:   '#EA580C',
    },
    surface: {
      base:    '#0A0A0A',
      card:    '#111111',
      raised:  '#1C1C1C',
    },
    border: {
      DEFAULT: '#1F2937',
    }
  }
}
```

---

## 📁 Final Project Structure

```
lynkerr/
├── DEVELOPMENT_PLAN.md
├── README.md
│
├── frontend/                        # React + Vite app
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css                # Tailwind base imports
│       │
│       ├── api/
│       │   ├── axiosInstance.js     # Axios + JWT interceptor
│       │   ├── authApi.js           # register, login, logout, refresh
│       │   └── listingsApi.js       # CRUD + search + pagination
│       │
│       ├── context/
│       │   └── AuthContext.jsx      # Global auth state (user, accessToken)
│       │
│       ├── components/
│       │   ├── Navbar.jsx           # Logo, nav links, auth state
│       │   ├── ListingCard.jsx      # Feed card component
│       │   ├── ListingForm.jsx      # Reusable create/edit form
│       │   ├── ProtectedRoute.jsx   # Redirect if not logged in
│       │   └── ConfirmDialog.jsx    # Delete confirmation modal
│       │
│       ├── pages/
│       │   ├── HomePage.jsx         # Feed + search + pagination
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── CreateListingPage.jsx
│       │   ├── ListingDetailPage.jsx
│       │   └── EditListingPage.jsx
│       │
│       └── utils/
│           └── timeAgo.js           # "Posted 2 hours ago" helper
│
└── backend/                         # Django REST API
    ├── manage.py
    ├── requirements.txt
    ├── .env.example
    ├── render.yaml                  # Render deployment config
    │
    ├── lynkerr/                     # Django project config
    │   ├── settings.py
    │   ├── urls.py
    │   └── wsgi.py
    │
    ├── users/                       # Auth app
    │   ├── serializers.py
    │   ├── views.py
    │   └── urls.py
    │
    └── listings/                    # Listings app
        ├── models.py
        ├── serializers.py
        ├── views.py
        ├── permissions.py           # IsOwnerOrReadOnly
        └── urls.py
```

---

## ✅ Phase Checklist Overview

| Phase | Scope | Git Commit Target |
|---|---|---|
| [Phase 1](#-phase-1--project-setup-hours-01) | Repo + folder structure + tooling | `init: project setup` |
| [Phase 2](#-phase-2--django-auth-hours-13) | Django auth API (register, login, logout, JWT) | `feat: user authentication API` |
| [Phase 3](#-phase-3--react-auth-pages-hours-34) | React login, register, protected routes, AuthContext | `feat: React auth pages and JWT flow` |
| [Phase 4](#-phase-4--listings-backend-hours-46) | Django listings model + CRUD API | `feat: listings model and API endpoints` |
| [Phase 5](#-phase-5--react-feed--detail-hours-69) | Feed page, listing cards, detail page | `feat: public feed and listing detail page` |
| [Phase 6](#-phase-6--create--edit--delete-hours-911) | Create listing form, edit, delete | `feat: create, edit, delete listing` |
| [Phase 7](#-phase-7--search--pagination-hours-1113) | Search bar, paginated API + UI | `feat: search and pagination` |
| [Phase 8](#-phase-8--ui-polish--responsive-hours-1315) | Tailwind polish, mobile responsive, dark UI | `feat: responsive UI and dark theme` |
| [Phase 9](#-phase-9--deployment-hours-1520) | Render + Vercel + Railway setup, env vars | `chore: deployment configuration` |
| [Phase 10](#-phase-10--readme--submission-hours-2024) | README all sections, final checks, email | `docs: complete README and documentation` |

---

## 🔲 Phase 1 — Project Setup (Hours 0–1)

### 1.1 GitHub Repository
- [ ] Create new GitHub repository: `lynkerr`
- [ ] Push initial commit with just `README.md` (establishes commit history)
- [ ] Clone locally

### 1.2 Django Backend Scaffold
```bash
cd lynkerr
mkdir backend && cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers mysqlclient python-dotenv
django-admin startproject lynkerr .
python manage.py startapp users
python manage.py startapp listings
pip freeze > requirements.txt
```

### 1.3 React Frontend Scaffold
```bash
cd ../
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 1.4 Tailwind Configuration
Edit `frontend/tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#F97316', hover: '#EA580C' },
        surface: { base: '#0A0A0A', card: '#111111', raised: '#1C1C1C' },
      },
    },
  },
  plugins: [],
}
```

Edit `frontend/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #0A0A0A;
  color: #D1D5DB;
}
```

### 1.5 MySQL Database
```sql
CREATE DATABASE lynkerr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'lynkerr_user'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON lynkerr_db.* TO 'lynkerr_user'@'localhost';
FLUSH PRIVILEGES;
```

### 1.6 Django Settings Setup
Create `backend/.env`:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=lynkerr_db
DB_USER=lynkerr_user
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306
FRONTEND_URL=http://localhost:5173
```

Create `backend/.env.example`:
```
SECRET_KEY=
DEBUG=True
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
FRONTEND_URL=http://localhost:5173
```

Edit `backend/lynkerr/settings.py` — key sections:
```python
import os
from dotenv import load_dotenv
load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    # Django defaults...
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'users',
    'listings',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # must be first
    # ...rest of middleware
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '3306'),
    }
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 9,
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

CORS_ALLOWED_ORIGINS = [
    os.getenv('FRONTEND_URL', 'http://localhost:5173'),
]
```

> **Git commit:** `init: project setup, Django scaffold, React + Vite, Tailwind config`

---

## 🔲 Phase 2 — Django Auth API (Hours 1–3)

### 2.1 Users Serializer — `backend/users/serializers.py`
```python
from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Email already in use.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)
```

### 2.2 Users Views — `backend/users/views.py`
```python
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Account created.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.data.get('refresh'))
            token.blacklist()
            return Response({'message': 'Logged out.'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)
```

### 2.3 Users URLs — `backend/users/urls.py`
```python
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/',    TokenObtainPairView.as_view()),
    path('logout/',   LogoutView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
]
```

### 2.4 Root URLs — `backend/lynkerr/urls.py`
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/',      include('listings.urls')),
]
```

### 2.5 Run Migrations
```bash
python manage.py migrate
python manage.py createsuperuser  # optional, useful for admin panel
```

### 2.6 Test Auth Endpoints with Postman / curl
- [ ] `POST /api/auth/register/` → 201 with new user
- [ ] `POST /api/auth/login/` → 200 with `{ access, refresh }` tokens
- [ ] `POST /api/auth/logout/` with Bearer token → 200
- [ ] `POST /api/auth/token/refresh/` → new access token

> **Git commit:** `feat: user registration, login, logout, JWT authentication`

---

## 🔲 Phase 3 — React Auth Pages (Hours 3–4)

### 3.1 AuthContext — `frontend/src/context/AuthContext.jsx`
```jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const login = ({ access, refresh, username, userId }) => {
    setAccessToken(access);
    setUser({ username, id: userId });
    localStorage.setItem('refresh', refresh);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('refresh');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### 3.2 Axios Instance — `frontend/src/api/axiosInstance.js`
```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = window.__accessToken;          // set by AuthContext
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh');
      if (!refresh) return Promise.reject(error);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/token/refresh/`,
        { refresh }
      );
      window.__accessToken = data.access;
      original.headers.Authorization = `Bearer ${data.access}`;
      return api(original);
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3.3 Auth API — `frontend/src/api/authApi.js`
```js
import api from './axiosInstance';

export const register  = (data)         => api.post('/auth/register/', data);
export const login     = (data)         => api.post('/auth/login/', data);
export const logout    = (refresh)      => api.post('/auth/logout/', { refresh });
export const refresh   = (refreshToken) => api.post('/auth/token/refresh/', { refresh: refreshToken });
```

### 3.4 ProtectedRoute — `frontend/src/components/ProtectedRoute.jsx`
```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
```

### 3.5 Navbar — `frontend/src/components/Navbar.jsx`
```jsx
// Dark navbar: bg-[#111111] border-b border-[#1F2937]
// Logo: text-[#F97316] font-bold text-xl
// Links: text-[#D1D5DB] hover:text-[#F97316]
// Auth buttons: orange CTA for Login, ghost for Register
// Shows username + Logout button when logged in
// Hamburger menu on mobile (toggle state)
```

**Styles to apply:**
- Container: `bg-[#111111] border-b border-[#1F2937] px-6 py-4`
- Logo: `text-[#F97316] font-bold text-xl tracking-tight`
- Nav links: `text-[#D1D5DB] hover:text-[#F97316] transition-colors`
- Login button: `bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors`
- Logout button: `border border-[#1F2937] hover:border-[#F97316] text-[#D1D5DB] px-4 py-2 rounded-lg text-sm transition-colors`

### 3.6 LoginPage — `frontend/src/pages/LoginPage.jsx`
```
Layout: min-h-screen bg-[#0A0A0A] flex items-center justify-center
Card:   bg-[#111111] border border-[#1F2937] rounded-2xl p-8 w-full max-w-md
Title:  text-white text-2xl font-bold
Labels: text-[#D1D5DB] text-sm
Inputs: bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] text-white rounded-lg px-4 py-3 w-full
Button: bg-[#F97316] hover:bg-[#EA580C] text-white w-full py-3 rounded-lg font-semibold
Error:  text-[#EF4444] text-sm
```

On submit:
1. Call `login({ username, password })`
2. Store tokens via `auth.login({ access, refresh, username })`
3. Navigate to `/`

### 3.7 RegisterPage — `frontend/src/pages/RegisterPage.jsx`
Same card layout as LoginPage. Fields: username, email, password, confirm password.

On submit:
1. Call `register({ username, email, password, password2 })`
2. On 201: navigate to `/login` with success message
3. Show field errors inline on 400

### 3.8 App Router — `frontend/src/App.jsx`
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateListingPage from './pages/CreateListingPage';
import ListingDetailPage from './pages/ListingDetailPage';
import EditListingPage from './pages/EditListingPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"               element={<HomePage />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/register"       element={<RegisterPage />} />
          <Route path="/listings/:id"   element={<ListingDetailPage />} />
          <Route path="/listings/create" element={
            <ProtectedRoute><CreateListingPage /></ProtectedRoute>
          } />
          <Route path="/listings/:id/edit" element={
            <ProtectedRoute><EditListingPage /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

### 3.9 Frontend .env Files
`frontend/.env`:
```
VITE_API_URL=http://localhost:8000/api
```
`frontend/.env.example`:
```
VITE_API_URL=http://localhost:8000/api
```

> **Git commit:** `feat: React auth pages, AuthContext, protected routes, JWT flow`

---

## 🔲 Phase 4 — Listings Backend (Hours 4–6)

### 4.1 Listing Model — `backend/listings/models.py`
```python
from django.db import models
from django.contrib.auth.models import User

class Listing(models.Model):
    user        = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    title       = models.CharField(max_length=200)
    location    = models.CharField(max_length=200, db_index=True)
    image_url   = models.TextField()
    description = models.TextField()
    price       = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
```

Run:
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4.2 Permissions — `backend/listings/permissions.py`
```python
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.user == request.user
```

### 4.3 Listing Serializer — `backend/listings/serializers.py`
```python
from rest_framework import serializers
from .models import Listing

class ListingSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model  = Listing
        fields = ['id', 'title', 'location', 'image_url', 'description',
                  'price', 'created_at', 'updated_at', 'owner_username']
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner_username']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
```

### 4.4 Listing Views — `backend/listings/views.py`
```python
from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Listing
from .serializers import ListingSerializer
from .permissions import IsOwnerOrReadOnly

class ListingListCreateView(generics.ListCreateAPIView):
    serializer_class   = ListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends    = [filters.SearchFilter]
    search_fields      = ['title', 'location']

    def get_queryset(self):
        return Listing.objects.select_related('user').order_by('-created_at')

class ListingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Listing.objects.select_related('user')
    serializer_class   = ListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
```

### 4.5 Listings URLs — `backend/listings/urls.py`
```python
from django.urls import path
from .views import ListingListCreateView, ListingRetrieveUpdateDestroyView

urlpatterns = [
    path('listings/',     ListingListCreateView.as_view()),
    path('listings/<int:pk>/', ListingRetrieveUpdateDestroyView.as_view()),
]
```

### 4.6 Test Listings Endpoints
- [ ] `GET  /api/listings/`          → 200, empty array
- [ ] `POST /api/listings/`          → 401 without token, 201 with token
- [ ] `GET  /api/listings/1/`        → 200 with listing data
- [ ] `PUT  /api/listings/1/`        → 403 for non-owner, 200 for owner
- [ ] `DELETE /api/listings/1/`      → 403 for non-owner, 204 for owner
- [ ] `GET  /api/listings/?search=bali` → filtered results
- [ ] `GET  /api/listings/?page=2`   → paginated results

> **Git commit:** `feat: listings model, CRUD API, search filter, pagination`

---

## 🔲 Phase 5 — React Feed & Detail (Hours 6–9)

### 5.1 Listings API — `frontend/src/api/listingsApi.js`
```js
import api from './axiosInstance';

export const getListings  = (params)   => api.get('/listings/', { params });
export const getListing   = (id)       => api.get(`/listings/${id}/`);
export const createListing = (data)   => api.post('/listings/', data);
export const updateListing = (id, data) => api.put(`/listings/${id}/`, data);
export const deleteListing = (id)     => api.delete(`/listings/${id}/`);
```

### 5.2 timeAgo Utility — `frontend/src/utils/timeAgo.js`
```js
export function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 60)   return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}
```

### 5.3 ListingCard Component — `frontend/src/components/ListingCard.jsx`

**Design:**
- Card: `bg-[#111111] border border-[#1F2937] hover:border-[#F97316] rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer group`
- Image: `w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300`
- Body padding: `p-5`
- Title: `text-white font-semibold text-lg leading-tight mb-2`
- Location: `text-[#F97316] text-sm flex items-center gap-1 mb-3` (map pin icon + text)
- Description: `text-[#6B7280] text-sm line-clamp-2 mb-4`
- Footer row: `flex items-center justify-between`
- Creator: `text-[#D1D5DB] text-xs`
- Timestamp: `text-[#6B7280] text-xs`
- Price badge: `bg-[#F97316] text-white text-xs font-semibold px-2 py-1 rounded-full`

```jsx
import { Link } from 'react-router-dom';
import { timeAgo } from '../utils/timeAgo';
import { MapPinIcon } from '@heroicons/react/24/solid'; // or inline SVG

export default function ListingCard({ listing }) {
  const { id, title, location, image_url, description,
          price, owner_username, created_at } = listing;

  return (
    <Link to={`/listings/${id}`}>
      <div className="bg-[#111111] border border-[#1F2937] hover:border-[#F97316] rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer group">
        <div className="overflow-hidden h-48">
          <img src={image_url} alt={title}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
               onError={(e) => { e.target.src = 'https://placehold.co/400x300/111111/F97316?text=No+Image'; }} />
        </div>
        <div className="p-5">
          <h3 className="text-white font-semibold text-lg leading-tight mb-2 line-clamp-1">{title}</h3>
          <p className="text-[#F97316] text-sm flex items-center gap-1 mb-3">
            📍 {location}
          </p>
          <p className="text-[#6B7280] text-sm line-clamp-2 mb-4">{description}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#D1D5DB] text-xs">by {owner_username}</p>
              <p className="text-[#6B7280] text-xs">Posted {timeAgo(created_at)}</p>
            </div>
            {price ? (
              <span className="bg-[#F97316] text-white text-xs font-semibold px-3 py-1 rounded-full">
                ${price}
              </span>
            ) : (
              <span className="bg-[#1C1C1C] text-[#6B7280] text-xs px-3 py-1 rounded-full border border-[#1F2937]">
                Free
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### 5.4 HomePage — `frontend/src/pages/HomePage.jsx`

**Layout:**
```
Hero section (top): bg-[#111111] border-b border-[#1F2937]
  - Big heading: "Discover Unique Travel Experiences"  text-white text-4xl font-bold
  - Subheading: text-[#6B7280]
  - Search bar (see Phase 7)

Feed grid: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-8 max-w-7xl mx-auto
```

Features:
- Fetch `GET /api/listings/` on mount
- Loading skeleton cards while fetching (3 placeholder cards)
- Empty state: `"No listings yet. Be the first to post an experience!"` with CTA
- Error state with retry button
- Render `<ListingCard />` for each listing

### 5.5 ListingDetailPage — `frontend/src/pages/ListingDetailPage.jsx`

**Layout:**
```
Container: max-w-4xl mx-auto px-6 py-10
Image:     w-full h-96 object-cover rounded-2xl mb-8
Back link: "← Back to feed"  text-[#F97316] hover:text-[#EA580C]
Title:     text-white text-3xl font-bold mb-2
Location:  text-[#F97316] text-lg mb-4
Price:     bg-[#F97316] text-white px-4 py-2 rounded-full font-semibold
           OR "Free" in muted style
Description: text-[#D1D5DB] text-base leading-relaxed mb-8
Meta row:  "Posted by {owner}  ·  {timeAgo}"  text-[#6B7280]
Owner actions: Edit button (ghost) + Delete button (red) — visible to owner only
```

Features:
- Fetch `GET /api/listings/:id/` on mount
- Show Edit + Delete buttons only if `user.id === listing.user_id` (or match by username)
- Delete triggers confirmation dialog → `DELETE /api/listings/:id/` → navigate to `/`

> **Git commit:** `feat: public feed page, listing cards, detail page`

---

## 🔲 Phase 6 — Create, Edit, Delete (Hours 9–11)

### 6.1 ListingForm Component — `frontend/src/components/ListingForm.jsx`

Reusable form for both Create and Edit. Accepts `initialValues` and `onSubmit` props.

Fields:
| Field | Type | Validation |
|---|---|---|
| Experience Title | text input | required, max 200 chars |
| Location | text input | required, max 200 chars |
| Image URL | url input | required |
| Short Description | textarea | required |
| Price | number input | optional |

**Input styles:**
```
bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none
text-white rounded-lg px-4 py-3 w-full transition-colors placeholder-[#6B7280]
```

**Label styles:** `text-[#D1D5DB] text-sm font-medium mb-2 block`

**Submit button:** `bg-[#F97316] hover:bg-[#EA580C] text-white w-full py-3 rounded-lg font-semibold transition-colors`

**Error text:** `text-[#EF4444] text-xs mt-1`

### 6.2 CreateListingPage — `frontend/src/pages/CreateListingPage.jsx`
- Render `<ListingForm />` with empty initialValues
- On submit: `POST /api/listings/` → navigate to `/` on success
- Protected route (already guarded in App.jsx)

### 6.3 EditListingPage — `frontend/src/pages/EditListingPage.jsx`
- Fetch `GET /api/listings/:id/` on mount
- If `user.username !== listing.owner_username` → navigate to `/`
- Render `<ListingForm initialValues={listing} />`
- On submit: `PUT /api/listings/:id/` → navigate to `/listings/:id/`

### 6.4 Delete Flow (in ListingDetailPage)
```jsx
// ConfirmDialog state
const [showConfirm, setShowConfirm] = useState(false);

const handleDelete = async () => {
  await deleteListing(id);
  navigate('/');
};
```

**ConfirmDialog styles:**
```
Overlay: fixed inset-0 bg-black/70 flex items-center justify-center z-50
Card:    bg-[#1C1C1C] border border-[#1F2937] rounded-2xl p-8 max-w-sm w-full mx-4
Title:   text-white font-bold text-lg mb-2
Text:    text-[#D1D5DB] text-sm mb-6
Confirm: bg-[#EF4444] hover:bg-red-700 text-white px-6 py-2 rounded-lg
Cancel:  border border-[#1F2937] text-[#D1D5DB] px-6 py-2 rounded-lg hover:border-[#F97316]
```

> **Git commit:** `feat: create listing form, edit listing, delete with confirmation`

---

## 🔲 Phase 7 — Search & Pagination (Hours 11–13)

### 7.1 Search Bar (in HomePage)

Add to hero or above feed grid:
```jsx
<input
  type="text"
  placeholder="Search experiences, locations..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] text-white
             rounded-xl px-5 py-3 w-full max-w-xl outline-none placeholder-[#6B7280]
             transition-colors"
/>
```

**Logic:**
- Debounce input by 400ms (use `useEffect` + `setTimeout`)
- On change: call `GET /api/listings/?search={query}`
- Reset to page 1 when search changes
- Show result count: `"Showing X results for '{query}'"` in `text-[#6B7280]`

```js
useEffect(() => {
  const timer = setTimeout(() => {
    fetchListings({ search: searchTerm, page: 1 });
  }, 400);
  return () => clearTimeout(timer);
}, [searchTerm]);
```

### 7.2 Pagination UI (in HomePage)

After the grid, add:
```jsx
<div className="flex items-center justify-center gap-4 mt-10">
  <button
    onClick={() => setPage(p => p - 1)}
    disabled={!prevUrl}
    className="px-5 py-2 rounded-lg border border-[#1F2937] text-[#D1D5DB]
               hover:border-[#F97316] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
  >
    ← Prev
  </button>
  <span className="text-[#6B7280] text-sm">Page {page}</span>
  <button
    onClick={() => setPage(p => p + 1)}
    disabled={!nextUrl}
    className="px-5 py-2 rounded-lg border border-[#1F2937] text-[#D1D5DB]
               hover:border-[#F97316] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
  >
    Next →
  </button>
</div>
```

**State in HomePage:**
```js
const [page, setPage]         = useState(1);
const [search, setSearch]     = useState('');
const [listings, setListings] = useState([]);
const [nextUrl, setNextUrl]   = useState(null);
const [prevUrl, setPrevUrl]   = useState(null);
const [loading, setLoading]   = useState(true);

const fetchListings = async (params = {}) => {
  setLoading(true);
  const { data } = await getListings({ page, search, ...params });
  setListings(data.results);
  setNextUrl(data.next);
  setPrevUrl(data.previous);
  setLoading(false);
};
```

> **Git commit:** `feat: search listings by title/location, pagination (9 per page)`

---

## 🔲 Phase 8 — UI Polish & Responsive (Hours 13–15)

### 8.1 Hero Section (HomePage)
```jsx
<section className="bg-[#111111] border-b border-[#1F2937] py-16 px-6 text-center">
  <h1 className="text-white text-4xl sm:text-5xl font-bold mb-4 leading-tight">
    Discover Unique <span className="text-[#F97316]">Travel Experiences</span>
  </h1>
  <p className="text-[#6B7280] text-lg max-w-xl mx-auto mb-8">
    Connect with local guides and experience operators around the world.
  </p>
  {/* Search bar here */}
</section>
```

### 8.2 Loading Skeleton Cards
While fetching, render 6 placeholder cards:
```jsx
function SkeletonCard() {
  return (
    <div className="bg-[#111111] border border-[#1F2937] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-[#1C1C1C]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-[#1C1C1C] rounded w-3/4" />
        <div className="h-3 bg-[#1C1C1C] rounded w-1/2" />
        <div className="h-3 bg-[#1C1C1C] rounded w-full" />
        <div className="h-3 bg-[#1C1C1C] rounded w-2/3" />
      </div>
    </div>
  );
}
```

### 8.3 Responsive Navbar
- Desktop: horizontal links + auth buttons
- Mobile (< 768px): hamburger icon `☰` toggles a dropdown menu
- Dropdown: `bg-[#111111] border border-[#1F2937] rounded-xl absolute top-full right-0 mt-2 p-4 flex flex-col gap-3`

### 8.4 Responsive Grid
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
```

### 8.5 Global Scrollbar Style (optional, in index.css)
```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0A0A0A; }
::-webkit-scrollbar-thumb { background: #1F2937; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #F97316; }
```

### 8.6 Form Page Layout
All auth + form pages:
```
min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4
Card: bg-[#111111] border border-[#1F2937] rounded-2xl p-8 w-full max-w-md
```

Create/Edit listing page (wider):
```
max-w-2xl mx-auto px-6 py-10
Heading: text-white text-3xl font-bold mb-8
```

### 8.7 Empty State & Error State
```jsx
// Empty state
<div className="text-center py-20">
  <p className="text-[#6B7280] text-lg mb-4">No listings found.</p>
  <Link to="/listings/create"
        className="bg-[#F97316] hover:bg-[#EA580C] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
    Post the First Experience
  </Link>
</div>

// Error state
<div className="text-center py-20">
  <p className="text-[#EF4444] mb-4">Failed to load listings.</p>
  <button onClick={fetchListings}
          className="border border-[#F97316] text-[#F97316] px-6 py-2 rounded-lg hover:bg-[#F97316] hover:text-white transition-colors">
    Try Again
  </button>
</div>
```

> **Git commit:** `feat: responsive UI, dark theme polish, hero section, loading skeletons`

---

## 🔲 Phase 9 — Deployment (Hours 15–20)

### 9.1 Prepare Django for Production

**Install gunicorn:**
```bash
pip install gunicorn whitenoise
pip freeze > requirements.txt
```

**Update `settings.py` for production:**
```python
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost').split(',')
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:5173').split(',')
```

**Create `backend/render.yaml`:**
```yaml
services:
  - type: web
    name: lynkerr-backend
    env: python
    buildCommand: pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate
    startCommand: gunicorn lynkerr.wsgi:application
    envVars:
      - key: SECRET_KEY
        generateValue: true
      - key: DEBUG
        value: 'False'
      - key: ALLOWED_HOSTS
        value: 'your-render-url.onrender.com'
      - key: DATABASE_URL
        fromDatabase:
          name: lynkerr-db
          property: connectionString
```

### 9.2 Railway MySQL Setup
1. Go to [railway.app](https://railway.app) → New Project → MySQL
2. Copy connection credentials from Dashboard
3. Set Django env vars on Render:
   ```
   DB_NAME=railway
   DB_USER=root
   DB_PASSWORD=[from Railway]
   DB_HOST=[from Railway]
   DB_PORT=3306
   ```

### 9.3 Render Backend Deployment
1. Push `backend/` to GitHub
2. Render Dashboard → New Web Service → Connect GitHub repo
3. Set root directory to `backend`
4. Set environment variables (SECRET_KEY, DEBUG=False, DB credentials, CORS origins)
5. Deploy → wait for build to complete
6. Test: `https://your-app.onrender.com/api/listings/`

### 9.4 Vercel Frontend Deployment
1. Update `frontend/.env.example` with production API URL
2. Push `frontend/` to GitHub
3. Vercel Dashboard → New Project → Import GitHub repo
4. Set root directory to `frontend`
5. Set environment variable: `VITE_API_URL=https://your-app.onrender.com/api`
6. Deploy → test live URL

### 9.5 Post-Deployment Checklist
- [ ] Django admin accessible at `/admin/`
- [ ] CORS working (no browser errors)
- [ ] Register on live site → Login → Create listing
- [ ] Feed loads on Vercel frontend
- [ ] All API endpoints returning correct status codes

> **Git commit:** `chore: deployment config, render.yaml, production settings`

---

## 🔲 Phase 10 — README & Submission (Hours 20–24)

### 10.1 Complete README.md

The README must cover all 6 required sections:

```markdown
# Lynkerr 🌍
### Mini Travel Experience Listing Platform

## 1. Project Overview
...what the app does, the problem it solves...

## 2. Tech Stack
| Layer | Tech | Why |
...

## 3. Setup Instructions
### Prerequisites
- Python 3.11+, Node.js 18+, MySQL 8

### Backend
```bash
cd backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # fill in values
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev
```

## 4. Features Implemented
- [x] User registration & login (JWT)
- [x] Create travel listing (authenticated)
- [x] Public feed — newest first, paginated
- [x] Listing detail page
- [x] Edit listing (owner only)
- [x] Delete listing (owner only, with confirm)
- [x] Search by title or location
- [x] Responsive mobile UI

## 5. Architecture & Key Decisions
...

## 6. Product Thinking: Scaling to 10,000 Listings
...
```

### 10.2 Final Submission Checklist

| # | Item | Done? |
|---|---|---|
| 1 | GitHub repo with 8–12+ meaningful commits | ☐ |
| 2 | Live demo on Vercel + Render | ☐ |
| 3 | Register / Login / Logout working | ☐ |
| 4 | Create listing (all fields, auth required) | ☐ |
| 5 | Public feed — newest first, card layout | ☐ |
| 6 | Listing detail page — full info | ☐ |
| 7 | Edit listing — owner only | ☐ |
| 8 | Delete listing — owner only, confirm dialog | ☐ |
| 9 | Search by title or location | ☐ |
| 10 | Pagination — 9 per page, Prev/Next | ☐ |
| 11 | Responsive mobile UI | ☐ |
| 12 | README — all 6 sections complete | ☐ |
| 13 | Product Thinking question answered | ☐ |
| 14 | `.env.example` committed, no secrets in repo | ☐ |
| 15 | Reply email with GitHub + live demo links | ☐ |

### 10.3 Email Template
```
Subject: Lynkerr Full-Stack Intern Challenge Submission — Vytheki

Hi Chandika,

Please find my submission for the Lynkerr technical challenge below.

GitHub Repository: https://github.com/your-username/lynkerr
Live Demo: https://lynkerr.vercel.app
Backend API: https://lynkerr-backend.onrender.com

Features implemented:
- User authentication (register, login, logout) with JWT
- Create, edit, delete travel listings (owner-only)
- Public feed with search and pagination
- Responsive dark UI

Thank you for the opportunity. Looking forward to your feedback.

Best regards,
Vytheki
```

> **Git commit:** `docs: complete README, all 6 sections, product thinking answer`

---

## 📌 Commit History Target

```
1.  init: project setup, Django scaffold, React + Vite, Tailwind
2.  feat: user registration, login, logout, JWT authentication
3.  feat: React auth pages, AuthContext, protected routes
4.  feat: listings model, database migration, indexes
5.  feat: listings CRUD API, search filter, pagination
6.  feat: public feed page, listing cards, detail page
7.  feat: create listing form, edit listing, delete with confirm
8.  feat: search bar with debounce, pagination UI
9.  feat: responsive UI, dark theme polish, hero, skeletons
10. chore: Render + Vercel + Railway deployment config
11. docs: complete README, product thinking, submission checklist
```

---

## ⚡ Quick Reference — Reusable Style Snippets

```jsx
// Page background
className="min-h-screen bg-[#0A0A0A]"

// Section card
className="bg-[#111111] border border-[#1F2937] rounded-2xl p-6"

// Primary button
className="bg-[#F97316] hover:bg-[#EA580C] text-white px-6 py-3 rounded-lg font-semibold transition-colors"

// Ghost button
className="border border-[#1F2937] hover:border-[#F97316] text-[#D1D5DB] px-6 py-3 rounded-lg transition-colors"

// Danger button
className="bg-[#EF4444] hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"

// Text input
className="bg-[#1C1C1C] border border-[#1F2937] focus:border-[#F97316] focus:outline-none text-white rounded-lg px-4 py-3 w-full transition-colors placeholder-[#6B7280]"

// Section heading
className="text-white text-2xl font-bold"

// Body text
className="text-[#D1D5DB] text-base"

// Muted text
className="text-[#6B7280] text-sm"

// Orange accent text (location, links)
className="text-[#F97316]"

// Error text
className="text-[#EF4444] text-sm"

// Success text
className="text-[#22C55E] text-sm"
```

---

*Lynkerr Technical Challenge · React + Django + MySQL · Good luck, Vytheki! 💪*
