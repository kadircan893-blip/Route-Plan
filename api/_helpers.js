export const GEOAPIFY_KEY = process.env.VITE_GEOAPIFY_KEY;

export const TYPE_TO_GEOAPIFY = {
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

export const KEYWORD_TO_CATEGORY = {
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

export const geoapifyToPlace = (feature) => {
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

export const fetchGeoapify = async (lat, lng, radius, categories, limit = 20) => {
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

export const fetchGeoapifyText = async (lat, lng, radius, textQuery, includedTypes, limit = 20) => {
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
