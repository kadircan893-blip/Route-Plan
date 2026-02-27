import { haversineDistance } from '../utils/distanceCalculator';

const BACKEND_URL = 'http://localhost:3001';

// ─── Kategori konfigürasyonu (New Places API v1) ──────────────────────────
const CATEGORY_CONFIG = {
  'muze-gezisi': {
    includedTypes: ['museum', 'art_gallery'],
    excludedTypes: ['restaurant', 'cafe', 'bar', 'hotel', 'gas_station'],
    minReviews: 200,
  },
  'tarihi-gezi': {
    includedTypes: ['tourist_attraction', 'historical_landmark'],
    excludedTypes: ['restaurant', 'cafe', 'bar', 'hotel', 'gas_station'],
    minReviews: 500,
  },
  'restoranlar': {
    includedTypes: ['restaurant'],
    excludedTypes: ['hotel', 'gas_station'],
    minReviews: 200,
    defaultSubFilters: ['burger', 'pizza', 'döner', 'pide', 'kebap', 'sushi', 'balık'],
    chains: {
      _all: ["mcdonald's", 'burger king', 'popeyes', "domino's", 'pizza hut', 'little caesars', "arby's", 'five guys', 'shake shack', 'sbarro'],
      'burger': ["mcdonald's", 'burger king', 'popeyes', "arby's", 'five guys', 'shake shack'],
      'pizza': ["domino's", 'pizza hut', 'little caesars', 'sbarro', "papa john's"],
    },
  },
  'kahve-brunch': {
    includedTypes: ['cafe', 'coffee_shop', 'bakery'],
    excludedTypes: ['restaurant', 'bar', 'hotel', 'gas_station'],
    minReviews: 90,
    chains: {
      _all: ['starbucks', 'kahve dünyası', 'gloria jeans', 'caribou', 'costa coffee', 'caffe nero', 'coffee lab', 'tchibo', 'espresso lab', 'coffy'],
    },
  },
  'publar': {
    includedTypes: ['bar'],
    excludedTypes: ['hotel', 'restaurant', 'gas_station'],
    minReviews: 90,
  },
  'otel': {
    includedTypes: ['hotel', 'motel', 'bed_and_breakfast', 'extended_stay_hotel'],
    excludedTypes: ['restaurant', 'gas_station'],
    minReviews: 50,
  },
  'sahiller': {
    useTextSearch: true,
    textQuery: 'plaj sahil',
    includedTypes: ['beach'],
    excludedTypes: [],
    minReviews: 20,
  },
  'doga-yuruyusu': {
    includedTypes: ['national_park', 'park', 'hiking_area'],
    excludedTypes: ['restaurant', 'hotel', 'gas_station'],
    minReviews: 20,
  },
  'kamp': {
    includedTypes: ['campground', 'rv_park'],
    excludedTypes: ['hotel', 'restaurant', 'gas_station'],
    minReviews: 10,
  },
  'benzin-istasyonu': {
    includedTypes: ['gas_station'],
    excludedTypes: [],
    minReviews: 10,
  },
  'park': {
    includedTypes: ['park'],
    excludedTypes: ['restaurant', 'hotel', 'gas_station'],
    minReviews: 90,
  },
  'supermarket': {
    includedTypes: ['supermarket', 'grocery_or_supermarket'],
    excludedTypes: [],
    minReviews: 0,
  },
};

// ─── New API yanıtını iç formata dönüştür ────────────────────────────────
const normalizePlace = (place) => ({
  id: place.id,
  name: place.displayName?.text ?? '',
  address: place.formattedAddress ?? '',
  rating: place.rating ?? 0,
  userRatingsTotal: place.userRatingCount ?? 0,
  location: {
    lat: place.location?.latitude ?? 0,
    lng: place.location?.longitude ?? 0,
  },
  photo: place.photos?.[0]?.name ?? null,
  openNow: place.currentOpeningHours?.openNow,
  types: place.types ?? [],
  primaryType: place.primaryType ?? null,
});

// ─── New Places API: Nearby Search ───────────────────────────────────────
const searchNearby = async ({ lat, lng, radius, includedTypes, excludedTypes = [], maxResultCount = 20 }) => {
  try {
    const body = {
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: Math.min(radius, 50000),
        },
      },
      includedTypes,
      maxResultCount,
      rankPreference: 'POPULARITY',
      ...(excludedTypes.length > 0 ? { excludedTypes } : {}),
    };

    const response = await fetch(`${BACKEND_URL}/api/places/nearby-new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return (data.places ?? []).map(normalizePlace);
  } catch {
    return [];
  }
};

// Seçili filtre sayısına göre filtre başına mekan limiti
const getPerFilterLimit = (filterCount) => {
  if (filterCount <= 1) return 20;
  if (filterCount === 2) return 9;
  if (filterCount === 3) return 6;
  if (filterCount === 4) return 5;
  if (filterCount === 5) return 4;
  return 3; // 6 veya 7 filtre
};

// ─── New Places API: Text Search (keyword / zincir araması) ──────────────
// strict=true → locationRestriction (kesin sınır), false → locationBias (yumuşak)
const searchByText = async ({ textQuery, lat, lng, radius, includedTypes = [], maxResultCount = 20, strict = false }) => {
  try {
    const locationKey = strict ? 'locationRestriction' : 'locationBias';
    const body = {
      textQuery,
      [locationKey]: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: Math.min(radius, 50000),
        },
      },
      maxResultCount,
    };
    if (includedTypes.length > 0) body.includedTypes = includedTypes;

    const response = await fetch(`${BACKEND_URL}/api/places/textsearch-new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return (data.places ?? []).map(normalizePlace);
  } catch {
    return [];
  }
};

// ─── Polyline decoder (Directions güzergahı için) ─────────────────────────
const decodePolyline = (encoded) => {
  const points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let shift = 0, result = 0, b;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);
    shift = 0; result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);
    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
};

const sampleRoutePoints = (points, intervalMeters = 5000) => {
  if (points.length === 0) return [];
  const sampled = [points[0]];
  let accumulated = 0;
  for (let i = 1; i < points.length; i++) {
    accumulated += haversineDistance(points[i - 1].lat, points[i - 1].lng, points[i].lat, points[i].lng);
    if (accumulated >= intervalMeters) { sampled.push(points[i]); accumulated = 0; }
  }
  const last = points[points.length - 1];
  if (sampled[sampled.length - 1] !== last) sampled.push(last);
  return sampled;
};

const getActualRoutePoints = async (origin, destination, travelMode) => {
  try {
    const mode = travelMode === 'driving' ? 'driving' : 'walking';
    const res = await fetch(
      `${BACKEND_URL}/api/directions?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=${mode}`
    );
    const data = await res.json();
    if (data.status !== 'OK' || !data.routes?.[0]?.overview_polyline?.points) return null;
    return sampleRoutePoints(decodePolyline(data.routes[0].overview_polyline.points), 5000);
  } catch {
    return null;
  }
};

// ─── Geocoding (legacy Geocoding API, değişmiyor) ─────────────────────────
export const getCityCoordinates = async (city, district) => {
  try {
    const address = `${district}, ${city}, Türkiye`;
    const response = await fetch(`${BACKEND_URL}/api/geocode?address=${encodeURIComponent(address)}`);
    const data = await response.json();
    if (data.status === 'OK' && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng, formattedAddress: data.results[0].formatted_address };
    }
    throw new Error('Konum bulunamadı');
  } catch (error) {
    console.error('Geocoding hatası:', error);
    throw error;
  }
};

// ─── Ana arama fonksiyonu ─────────────────────────────────────────────────
export const searchPlacesByCategories = async (locationData, selectedCategories, categoryKeywords = {}) => {
  try {
    const hasDestination = !!(locationData.city?.trim() && locationData.district?.trim());
    const hasGPS = !!locationData.userLocation;

    let coordinates = null;
    if (hasDestination) {
      coordinates = await getCityCoordinates(locationData.city, locationData.district);
    }

    const searchCenter = locationData.userLocation ?? coordinates;
    if (!searchCenter) throw new Error('Konum bilgisi gerekli');

    const radiusInMeters = locationData.distance * 1000;
    const useRouteMode = hasGPS && hasDestination && coordinates;

    let searchPoints;
    if (useRouteMode) {
      const travelMode = locationData.travelModes?.includes('driving') ? 'driving' : 'walking';
      const routePoints = await getActualRoutePoints(locationData.userLocation, coordinates, travelMode);
      searchPoints = routePoints ?? [locationData.userLocation, coordinates];
    } else {
      searchPoints = [searchCenter];
    }

    const sortRef = locationData.userLocation ?? searchCenter;
    const score = (p) => (p.rating || 0) * Math.log10((p.userRatingsTotal || 0) + 10);
    const byScore = (a, b) => score(b) - score(a);
    const byDistance = (a, b) =>
      haversineDistance(sortRef.lat, sortRef.lng, a.location.lat, a.location.lng) -
      haversineDistance(sortRef.lat, sortRef.lng, b.location.lat, b.location.lng);

    const categoryResults = await Promise.all(
      selectedCategories.map(async (categoryId) => {
        const config = CATEGORY_CONFIG[categoryId];
        if (!config) return [categoryId, []];

        const userKeywords = categoryKeywords[categoryId];
        const hasUserKeywords = userKeywords?.length > 0;

        // Rota modunda dar koridor yarıçapı, değilse tam yarıçap
        const corridorRadius =
          categoryId === 'benzin-istasyonu' ? 2000 :
          categoryId === 'restoranlar' ? 500 : 1000;
        const activeRadius = useRouteMode ? corridorRadius : radiusInMeters;

        // Tüm rota noktalarından paralel Nearby Search
        const searchAllNearby = () =>
          Promise.all(
            searchPoints.map(point =>
              searchNearby({
                lat: point.lat,
                lng: point.lng,
                radius: activeRadius,
                includedTypes: config.includedTypes,
                excludedTypes: config.excludedTypes,
              })
            )
          ).then(results => results.flat());

        // Text Search — rota modunda her noktayı dar yarıçapla (strict), local modda merkezi geniş yarıçapla ara
        const searchText = async (query, types) => {
          const includedTypes = types ?? config.includedTypes;
          if (useRouteMode) {
            const results = await Promise.all(
              searchPoints.map(pt =>
                searchByText({ textQuery: query, lat: pt.lat, lng: pt.lng, radius: activeRadius, includedTypes, strict: true })
              )
            );
            return results.flat();
          }
          return searchByText({ textQuery: query, lat: searchCenter.lat, lng: searchCenter.lng, radius: radiusInMeters, includedTypes });
        };

        // Dedup + openNow + minReviews (OSM datada rating olmadığından 0 ise filtre atlanır)
        const dedupAndFilter = (raw) => {
          const seen = new Set();
          return raw
            .filter(p => !seen.has(p.id) && seen.add(p.id))
            .filter(p => p.openNow !== false)
            .filter(p => p.userRatingsTotal === 0 || p.userRatingsTotal >= config.minReviews);
        };

        // ── Ana arama ──
        let places;

        if (config.useTextSearch) {
          // Sahil gibi kategoriler → sadece Text Search
          const raw = await searchText(config.textQuery, config.includedTypes);
          places = dedupAndFilter(raw).sort(byScore).slice(0, 15);
        } else if (hasUserKeywords) {
          // Kullanıcı keyword seçti → filtre başına ayrı arama + per-filtre limit
          const perLimit = getPerFilterLimit(userKeywords.length);
          const keywordResults = await Promise.all(
            userKeywords.map(async (kw) => {
              const raw = await searchText(kw, config.includedTypes);
              return dedupAndFilter(raw).sort(byScore).slice(0, perLimit);
            })
          );
          // Keywordlar arası dedup (aynı mekan birden fazla keyword'de çıkabilir)
          const seen = new Set();
          places = keywordResults.flat().filter(p => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
          });
        } else if (config.defaultSubFilters) {
          // Seçim yok ama kategori defaultSubFilters'a sahip → her subFilter'dan 3 mekan
          const subResults = await Promise.all(
            config.defaultSubFilters.map(async (sf) => {
              const raw = await searchText(sf, config.includedTypes);
              return dedupAndFilter(raw).sort(byScore).slice(0, 3);
            })
          );
          const seen = new Set();
          places = subResults.flat().filter(p => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
          });
        } else {
          // Seçim yok → Nearby Search
          const raw = await searchAllNearby();
          places = dedupAndFilter(raw).sort(byScore).slice(0, 15);
        }

        // ── Zincir araması ──
        if (config.chains) {
          const activeKeyword = hasUserKeywords ? userKeywords[0] : null;
          const brands =
            (activeKeyword && config.chains[activeKeyword]?.length > 0)
              ? config.chains[activeKeyword]
              : (config.chains._all ?? []);

          if (brands.length > 0) {
            const existingIds = new Set(places.map(p => p.id));
            const chainRaw = (await Promise.all(
              brands.map(brand => searchText(brand, config.includedTypes))
            )).flat();

            const chainSeen = new Set(existingIds);
            const newChains = chainRaw.filter(p => {
              if (chainSeen.has(p.id)) return false;
              chainSeen.add(p.id);
              return p.openNow !== false && (p.userRatingsTotal ?? 0) >= config.minReviews;
            });

            if (newChains.length > 0) {
              places = [...places, ...newChains];
            }
          }
        }

        return [categoryId, places.sort(byDistance)];
      })
    );

    return {
      coordinates,
      places: Object.fromEntries(categoryResults),
    };
  } catch (error) {
    console.error('Yer arama hatası:', error);
    throw error;
  }
};

// OSM fotoğraf sağlamaz — her zaman null döner
export const getPhotoUrl = () => null;
