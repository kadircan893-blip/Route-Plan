# Route Plan

**Build your own personalized route** — pick a location, choose your filters, and get a custom itinerary tailored to exactly what you want to visit.

---

## Overview

Route Plan is a full-stack web application that lets users create personalized routes based on their own preferences. You choose the location — either your current GPS position or anywhere in Turkey — then pick the types of places you want to visit through category filters, and the app builds an optimized route just for you.

No generic tourist lists. Your filters, your route.

---

## How It Works

```
1. Set your location  →  Use GPS or pick a city and district
2. Choose your filters →  Select categories: restaurants, cafes, museums, beaches...
3. Browse places       →  Real-time results matched to your preferences
4. Build your route    →  Pick your favorites, generate an optimized visit order
5. Navigate            →  Export directly to Google Maps
```

---

## Features

- **Personalized filtering** — choose from 12+ categories and fine-tune with sub-filters (e.g., burger, sushi, pastry, kebap...)
- **Two location modes** — explore around your current GPS position, or plan a route between two cities
- **Route optimization** — nearest-neighbor algorithm arranges your selected places in the most efficient order
- **Real-time place discovery** — results fetched live from Geoapify and scored by rating and review count
- **Google Maps export** — open your finalized route in Google Maps for turn-by-turn navigation
- **Travel mode** — toggle between driving and walking
- **Turkish geography** — built-in database covering 20+ major cities and their districts

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, React Router, Zustand, Tailwind CSS, Framer Motion, Ant Design |
| **Backend** | Node.js, Express 5 |
| **Maps & Places** | Geoapify Places API, OpenStreetMap Nominatim, OSRM Routing |
| **Build** | Vite 7, ESLint, PostCSS |

---

## Getting Started

### Prerequisites

- Node.js v16+
- npm

### Installation

```bash
git clone https://github.com/your-username/route-plan.git
cd route-plan
npm install
```

### Running Locally

The app requires both servers running at the same time.

```bash
# Terminal 1 — backend (port 3001)
node server.js

# Terminal 2 — frontend (port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
route-plan/
├── server.js                        # Express backend (API proxy)
├── src/
│   ├── App.jsx                      # Root component + routing
│   ├── pages/
│   │   ├── HomePage.jsx             # Landing page
│   │   ├── CardSelectionPage.jsx    # Category & filter selection
│   │   └── RoutePlanPage.jsx        # Place discovery + route builder
│   ├── components/
│   │   ├── home/                    # Hero section, location input
│   │   └── common/                  # Layout, floating particles
│   ├── services/
│   │   ├── api/
│   │   │   └── googlePlacesAPI.js   # Place search via Geoapify + Nominatim
│   │   └── utils/
│   │       ├── routeGenerator.js    # Nearest-neighbor route optimization
│   │       └── distanceCalculator.js# Haversine distance calculations
│   ├── store/
│   │   └── appStore.js              # Zustand global state
│   └── constants/
│       ├── categories.js            # Category definitions & metadata
│       └── districts.js             # Turkish cities & districts database
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/places/nearby-new` | Search places by category within a radius |
| `POST` | `/api/places/textsearch-new` | Search places by text query |
| `GET` | `/api/geocode` | Address → coordinates |
| `GET` | `/api/reverse-geocode` | Coordinates → address |
| `GET` | `/api/directions` | Route between two points (OSRM) |

---

## External APIs Used

- **[Geoapify Places API](https://www.geoapify.com/)** — point of interest search
- **[OpenStreetMap Nominatim](https://nominatim.org/)** — geocoding and reverse geocoding
- **[OSRM](http://project-osrm.org/)** — open-source routing engine

---

## License

MIT
