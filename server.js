/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─── API Anahtarları ──────────────────────────────────────────────────────
const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;
const NOMINATIM_UA = 'drell-app/1.0 (portfolio)';

// ─── Google Places tipi → Geoapify kategori eşlemesi ─────────────────────
const TYPE_TO_GEOAPIFY = {
  'restaurant':             'catering.restaurant',
  'cafe':                   'catering.cafe',
  'coffee_shop':            'catering.cafe',
  'bakery':                 'catering.cafe.bakery',
  'bar':                    'catering.bar',
  'museum':                 'entertainment.museum',
  'art_gallery':            'entertainment.culture.gallery',
  'tourist_attraction':     'tourism.attraction',
  'historical_landmark':    'tourism.sights',
  'hotel':                  'accommodation.hotel',
  'motel':                  'accommodation.motel',
  'bed_and_breakfast':      'accommodation.guest_house',
  'extended_stay_hotel':    'accommodation.hotel',
  'beach':                  'natural.beach',
  'national_park':          'natural',
  'park':                   'leisure.park',
  'hiking_area':            'natural',
  'campground':             'camping',
  'rv_park':                'camping',
  'gas_station':            'service.vehicle.fuel',
  'supermarket':            'commercial.supermarket',
  'grocery_or_supermarket': 'commercial.supermarket',
};

// ─── Filtre anahtar kelimesi → Geoapify alt kategorisi ───────────────────
const KEYWORD_TO_CATEGORY = {
  'burger':  'catering.restaurant.burger,catering.fast_food',
  'pizza':   'catering.restaurant.pizza',
  'döner':   'catering.restaurant.kebab',
  'pide':    'catering.restaurant',
  'kebap':   'catering.restaurant.kebab',
  'sushi':   'catering.restaurant.sushi',
  'balık':   'catering.restaurant.seafood',
  'kahve':   'catering.cafe',
  'tatlı':   'catering.cafe.cake_shop',
  'pastane': 'catering.cafe.pastry,catering.cafe.bakery',
  'plaj':    'natural.beach',
  'sahil':   'natural.beach',
};

// ─── Geoapify feature → iç format ────────────────────────────────────────
const geoapifyToPlace = (feature) => {
  const p = feature.properties;
  if (!p.name) return null;
  const [lng, lat] = feature.geometry.coordinates;
  return {
    id: p.place_id,
    displayName: { text: p.name },
    formattedAddress: p.formatted || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    location: { latitude: lat, longitude: lng },
    rating: 0,
    userRatingCount: 0,
    photos: [],
    types: p.categories || [],
    primaryType: p.categories?.[0] || null,
    currentOpeningHours: null,
  };
};

// ─── Geoapify Places API çağrısı ──────────────────────────────────────────
const fetchGeoapify = async (lat, lng, radius, categories, limit = 20) => {
  const cats = [...new Set(
    (categories || []).map(t => TYPE_TO_GEOAPIFY[t]).filter(Boolean)
  )].join(',');

  if (!cats) return [];

  const params = new URLSearchParams({
    categories: cats,
    filter: `circle:${lng},${lat},${Math.min(radius, 50000)}`,
    limit: String(Math.min(limit, 500)),
    apiKey: GEOAPIFY_KEY,
    lang: 'tr',
  });

  try {
    const res = await fetch(`https://api.geoapify.com/v2/places?${params}`, {
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) { console.error('[Geoapify] HTTP', res.status); return []; }
    const data = await res.json();
    return (data.features || []).map(geoapifyToPlace).filter(Boolean);
  } catch (e) {
    console.error('[Geoapify] hata:', e.message);
    return [];
  }
};

// ─── Anahtar kelime araması — alt kategori varsa onu, yoksa name filter ──
const fetchGeoapifyText = async (lat, lng, radius, textQuery, includedTypes, limit = 20) => {
  const cuisineCats = KEYWORD_TO_CATEGORY[textQuery.toLowerCase()];

  const params = new URLSearchParams({
    filter: `circle:${lng},${lat},${Math.min(radius, 50000)}`,
    limit: String(Math.min(limit, 500)),
    apiKey: GEOAPIFY_KEY,
    lang: 'tr',
  });

  if (cuisineCats) {
    params.set('categories', cuisineCats);
  } else {
    const cats = [...new Set(
      (includedTypes || []).map(t => TYPE_TO_GEOAPIFY[t]).filter(Boolean)
    )].join(',');
    if (!cats) return [];
    params.set('categories', cats);
    params.set('name', textQuery);
  }

  try {
    const res = await fetch(`https://api.geoapify.com/v2/places?${params}`, {
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) { console.error('[Geoapify Text] HTTP', res.status); return []; }
    const data = await res.json();
    return (data.features || []).map(geoapifyToPlace).filter(Boolean);
  } catch (e) {
    console.error('[Geoapify Text] hata:', e.message);
    return [];
  }
};

// ─── Geocoding — Nominatim ────────────────────────────────────────────────
app.get('/api/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&addressdetails=1&accept-language=tr`;
    const response = await fetch(url, { headers: { 'User-Agent': NOMINATIM_UA } });
    const data = await response.json();
    if (!data.length) return res.json({ status: 'ZERO_RESULTS', results: [] });
    const r = data[0];
    res.json({
      status: 'OK',
      results: [{
        formatted_address: r.display_name,
        geometry: { location: { lat: parseFloat(r.lat), lng: parseFloat(r.lon) } },
      }],
    });
  } catch (e) {
    console.error('[Geocode] hata:', e.message);
    res.status(500).json({ error: 'Geocoding hatası' });
  }
});

// ─── Reverse Geocoding — Nominatim ───────────────────────────────────────
app.get('/api/reverse-geocode', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=tr`;
    const response = await fetch(url, { headers: { 'User-Agent': NOMINATIM_UA } });
    const data = await response.json();
    const addr = data.address || {};
    res.json({
      results: [{
        address_components: [
          { long_name: addr.province || addr.state || addr.city || '', types: ['administrative_area_level_1'] },
          { long_name: addr.city_district || addr.town || addr.municipality || '', types: ['administrative_area_level_2'] },
          { long_name: addr.suburb || addr.neighbourhood || addr.quarter || '', types: ['sublocality_level_1', 'sublocality'] },
          { long_name: addr.neighbourhood || addr.quarter || '', types: ['neighborhood'] },
        ].filter(c => c.long_name),
      }],
    });
  } catch (e) {
    console.error('[ReverseGeocode] hata:', e.message);
    res.status(500).json({ error: 'Konum çözümleme hatası' });
  }
});

// ─── Directions — OSRM ───────────────────────────────────────────────────
app.get('/api/directions', async (req, res) => {
  try {
    const { origin, destination, mode } = req.query;
    const [olat, olng] = origin.split(',');
    const [dlat, dlng] = destination.split(',');
    const profile = mode === 'walking' ? 'foot' : 'driving';
    const url = `https://router.project-osrm.org/route/v1/${profile}/${olng},${olat};${dlng},${dlat}?overview=full&geometries=polyline`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes?.[0]) return res.json({ status: 'ZERO_RESULTS' });
    res.json({ status: 'OK', routes: [{ overview_polyline: { points: data.routes[0].geometry } }] });
  } catch (e) {
    console.error('[Directions] hata:', e.message);
    res.status(500).json({ error: 'Directions hatası' });
  }
});

// ─── Places Nearby — Geoapify ─────────────────────────────────────────────
app.post('/api/places/nearby-new', async (req, res) => {
  try {
    const { locationRestriction, locationBias, includedTypes, maxResultCount = 20 } = req.body;
    const circle = locationRestriction?.circle ?? locationBias?.circle;
    if (!circle) return res.json({ places: [] });
    const { center: { latitude: lat, longitude: lng }, radius } = circle;
    const places = await fetchGeoapify(lat, lng, radius, includedTypes, maxResultCount);
    res.json({ places });
  } catch (e) {
    console.error('[Nearby] hata:', e.message);
    res.status(500).json({ error: 'Places Nearby hatası' });
  }
});

// ─── Places Text Search — Geoapify ───────────────────────────────────────
app.post('/api/places/textsearch-new', async (req, res) => {
  try {
    const { textQuery, locationRestriction, locationBias, includedTypes, maxResultCount = 20 } = req.body;
    const circle = locationRestriction?.circle ?? locationBias?.circle;
    if (!circle || !textQuery) return res.json({ places: [] });
    const { center: { latitude: lat, longitude: lng }, radius } = circle;
    const places = await fetchGeoapifyText(lat, lng, radius, textQuery, includedTypes, maxResultCount);
    res.json({ places });
  } catch (e) {
    console.error('[TextSearch] hata:', e.message);
    res.status(500).json({ error: 'Places Text Search hatası' });
  }
});

// Production'da build edilmiş React dosyalarını sun
const distPath = join(__dirname, 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('/{*splat}', (_req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Backend server çalışıyor: http://localhost:${PORT}`);
});
