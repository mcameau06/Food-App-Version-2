---
name: FoodFindr MVP Implementation
overview: Build a complete food discovery app with search, restaurant details, favorites, and authentication. Starting from the current fresh React + Vite setup, this plan covers frontend pages, backend cleanup, Supabase auth integration, and deployment.
todos:
  - id: install-deps
    content: Install react-router-dom and axios dependencies
    status: pending
  - id: create-structure
    content: "Create folder structure: pages/, components/, services/, hooks/"
    status: pending
  - id: build-navbar
    content: Build Navbar component with logo, links, and mobile menu
    status: pending
  - id: setup-router
    content: Set up React Router in App.jsx with all routes
    status: pending
  - id: build-landing
    content: Build Landing page with hero section and CTA
    status: pending
  - id: create-api-service
    content: Create api.js service with all backend API functions
    status: pending
  - id: create-geolocation-hook
    content: Create useGeolocation hook for user coordinates
    status: pending
  - id: build-searchbar
    content: Build SearchBar component
    status: pending
  - id: build-restaurant-card
    content: Build RestaurantCard component with photo, name, rating, save button
    status: pending
  - id: build-explore-page
    content: Build Explore page with search and results grid
    status: pending
  - id: build-detail-page
    content: Build Restaurant Detail page
    status: pending
  - id: build-favorites-page
    content: Build Favorites page with localStorage
    status: pending
  - id: add-delete-endpoint
    content: Add DELETE /favorites endpoint to backend
    status: pending
  - id: setup-supabase-auth
    content: Set up Supabase auth and AuthContext
    status: pending
  - id: build-login-page
    content: Build Login/Signup page
    status: pending
  - id: connect-supabase-db
    content: Connect backend to Supabase Postgres
    status: pending
  - id: deploy-app
    content: Deploy frontend and backend
    status: pending
---

# FoodFindr MVP Implementation Plan

## Current State

- **Backend**: FastAPI with Google Places search, favorites endpoints (using SQLite locally)
- **Frontend**: Fresh React + Vite app, empty components
- **Missing**: Auth, DELETE favorites endpoint, frontend pages, Supabase integration

## Architecture Overview

```mermaid
flowchart TB
    subgraph frontend [Frontend - React]
        Landing[Landing Page]
        Explore[Explore Page]
        Detail[Restaurant Detail]
        Favorites[Favorites Page]
        Login[Login/Signup]
    end
    
    subgraph backend [Backend - FastAPI]
        Search[GET /search]
        GetFavs[GET /favorites]
        AddFav[POST /favorites]
        DelFav[DELETE /favorites]
        GetRest[GET /restaurant]
    end
    
    subgraph external [External Services]
        Google[Google Places API]
        Supabase[Supabase Auth + DB]
    end
    
    Explore --> Search
    Search --> Google
    Detail --> GetRest
    Favorites --> GetFavs
    Detail --> AddFav
    Favorites --> DelFav
    Login --> Supabase
    backend --> Supabase
```

---

## Phase 1: Frontend Foundation

### 1.1 Install Dependencies

```bash
npm install react-router-dom axios
```



### 1.2 Project Structure

```javascript
src/
  components/
    Navbar/Navbar.jsx
    RestaurantCard/RestaurantCard.jsx
    SearchBar/SearchBar.jsx
  pages/
    LandingPage.jsx
    ExplorePage.jsx
    RestaurantDetailPage.jsx
    FavoritesPage.jsx
    LoginPage.jsx
  services/
    api.js
  hooks/
    useGeolocation.js
  App.jsx
  App.css
  index.css
```



### 1.3 Navbar Component

- Logo/brand link to home
- Navigation links: Explore, Favorites
- Login/Logout button (conditional)
- Mobile responsive hamburger menu

### 1.4 Landing Page

- Hero section with app name and tagline
- CTA button to Explore page
- Brief feature highlights

### 1.5 Router Setup in App.jsx

- `/` - Landing page
- `/explore` - Search and browse restaurants
- `/restaurant/:placeId` - Restaurant details
- `/favorites` - User's saved restaurants
- `/login` - Login/signup page

---

## Phase 2: Core Features (No Auth)

### 2.1 API Service (`src/services/api.js`)

- `searchRestaurants(query, lat, lng)` - calls backend `/search`
- `getRestaurant(placeId)` - calls backend `/restaurant/{place_id}`
- `getFavorites(userId)` - calls backend `/favorites/{user_id}`
- `addFavorite(data)` - calls backend `POST /favorites`
- `removeFavorite(placeId)` - calls backend `DELETE /favorites/{place_id}` (after backend update)

### 2.2 useGeolocation Hook

- Get user's current lat/lng
- Handle permission denied
- Return coordinates, loading, error states

### 2.3 Explore Page

- SearchBar component at top
- Get user location on mount
- Call search API on form submit
- Display results as RestaurantCard grid
- Loading and empty states

### 2.4 RestaurantCard Component

- Photo (first from photo_urls)
- Restaurant name
- Rating with star icon
- Address (truncated)
- Open/Closed status badge
- Click navigates to detail page
- Heart icon to save to favorites

### 2.5 Restaurant Detail Page

- Fetch restaurant data by placeId from URL
- Large photo carousel or hero image
- Full name, address, rating
- Open hours if available
- "Save to Favorites" button
- Back button to explore

### 2.6 Favorites Page (localStorage first)

- Display saved restaurants as cards
- Remove button on each card
- Empty state when no favorites
- Later: sync with backend after auth

---

## Phase 3: Backend Updates

### 3.1 Add DELETE Endpoint

Add to `routes.py`:

```python
@app.delete("/favorites/{user_id}/{place_id}")
def remove_favorite(user_id: str, place_id: str, db: Session = Depends(get_db)):
    # Delete swipe record where user_id and place_id match
```



### 3.2 Refactor Terminology (Optional)

- Rename `Swipe` model to `Favorite`
- Update `swipe_direction` to just store favorites (remove left/right concept)
- Simplify endpoints

### 3.3 Connect to Supabase Postgres

- Uncomment Supabase connection in `schemas.py`
- Test database migrations
- Verify data persists

---

## Phase 4: Authentication

### 4.1 Supabase Auth Setup

- Create Supabase project (if not done)
- Enable email/password auth
- Get API keys for frontend

### 4.2 Auth Context (`src/context/AuthContext.jsx`)

- Supabase client initialization
- `user` state
- `login()`, `signup()`, `logout()` functions
- Persist session

### 4.3 Login Page

- Email and password form
- Toggle between login and signup
- Error handling and validation
- Redirect to explore after success

### 4.4 Protect Routes

- Favorites page requires auth
- Save button requires auth (or prompts login)
- Pass user_id to backend requests

### 4.5 Backend Auth Validation

- Verify Supabase JWT tokens
- Extract user_id from token instead of URL param
- Protect favorites endpoints

---

## Phase 5: Polish and Deploy

### 5.1 UI/UX Polish

- Loading spinners/skeletons
- Error toasts/messages
- Responsive design (mobile-first)
- Consistent styling across pages

### 5.2 Deploy Backend

- Railway or Render
- Set environment variables
- Connect to Supabase Postgres

### 5.3 Deploy Frontend

- Vercel or Netlify
- Set API base URL env variable
- Configure redirects for SPA routing

### 5.4 Final Testing

- End-to-end user flow
- Mobile testing
- Error scenarios

---

## File Changes Summary

### New Files to Create

| File | Purpose |

|------|---------|

| `src/pages/LandingPage.jsx` | Home/hero page |

| `src/pages/ExplorePage.jsx` | Search and browse |

| `src/pages/RestaurantDetailPage.jsx` | Single restaurant view |

| `src/pages/FavoritesPage.jsx` | Saved restaurants |

| `src/pages/LoginPage.jsx` | Auth page |

| `src/components/RestaurantCard/RestaurantCard.jsx` | Restaurant card |

| `src/components/SearchBar/SearchBar.jsx` | Search input |

| `src/services/api.js` | Backend API calls |

| `src/hooks/useGeolocation.js` | Location hook |

| `src/context/AuthContext.jsx` | Auth state (Phase 4) |

### Files to Modify

| File | Changes |

|------|---------|

| `src/App.jsx` | Add Router, routes, layout |

| `src/components/Navbar/Navbar.jsx` | Build navigation |

| `src/index.css` | Global styles, CSS variables |

| `src/App.css` | Layout styles |

| `backend/app/routes.py` | Add DELETE endpoint |

| `backend/app/database/schemas.py` | Switch to Supabase |---

## MVP Completion Checklist

- [ ] User can view landing page
- [ ] User can search for restaurants
- [ ] User can view restaurant details
- [ ] User can save favorites (localStorage)
- [ ] User can view and remove favorites
- [ ] User can log in/sign up
- [ ] Favorites sync with backend