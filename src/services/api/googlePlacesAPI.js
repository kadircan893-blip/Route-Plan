const BACKEND_URL = 'http://localhost:3001';

export const CATEGORY_TO_PLACE_TYPES = {
  'kilise-gezisi': ['church'],
  'cami-gezisi': ['mosque'],
  'tarihi-gezi': ['tourist_attraction', 'landmark'],
  'deniz': ['natural_feature', 'park'],
  'sahiller': ['natural_feature'],
  'kulturel-gezi': ['art_gallery', 'museum'],
  'lezzet-gezisi': ['restaurant', 'food'],
  'muze-gezisi': ['museum'],
  'doga-yuruyusu': ['park', 'natural_feature'],
  'kamp': ['campground'],
  'balik-tutma': ['natural_feature', 'park'],
  'otel': ['lodging'],
  'beach-club': ['night_club', 'bar'],
  'publar': ['bar', 'night_club'],
  'restoranlar': ['restaurant'],
  'kahve-brunch': ['cafe'],
};

export const getCityCoordinates = async (city, district) => {
  try {
    const address = `${district}, ${city}, Türkiye`;
    const url = `${BACKEND_URL}/api/geocode?address=${encodeURIComponent(address)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: data.results[0].formatted_address,
      };
    }
    throw new Error('Konum bulunamadı');
  } catch (error) {
    console.error('Geocoding hatası:', error);
    throw error;
  }
};

export const searchNearbyPlaces = async (lat, lng, placeType, radiusInMeters) => {
  try {
    const url = `${BACKEND_URL}/api/places/nearby?location=${lat},${lng}&radius=${radiusInMeters}&type=${placeType}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === 'OK') {
      return data.results.map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        rating: place.rating || 0,
        userRatingsTotal: place.user_ratings_total || 0,
        location: place.geometry.location,
        photo: place.photos?.[0]?.photo_reference || null,
        openNow: place.opening_hours?.open_now,
        types: place.types,
      }));
    }
    return [];
  } catch (error) {
    console.error('Places API hatası:', error);
    return [];
  }
};

export const searchPlacesByCategories = async (locationData, selectedCategories) => {
  try {
    const coordinates = await getCityCoordinates(
      locationData.city,
      locationData.district
    );
    const radiusInMeters = locationData.distance * 1000;
    const allPlaces = {};
    for (const categoryId of selectedCategories) {
      const placeTypes = CATEGORY_TO_PLACE_TYPES[categoryId] || [];
      const places = [];
      for (const placeType of placeTypes) {
        const results = await searchNearbyPlaces(
          coordinates.lat,
          coordinates.lng,
          placeType,
          radiusInMeters
        );
        places.push(...results);
      }
      const uniquePlaces = places
        .filter((place, index, self) =>
          index === self.findIndex(p => p.id === place.id)
        )
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
      allPlaces[categoryId] = uniquePlaces;
    }
    return {
      coordinates,
      places: allPlaces,
    };
  } catch (error) {
    console.error('Yer arama hatası:', error);
    throw error;
  }
};

export const getPhotoUrl = (photoReference, maxWidth = 400) => {
  if (!photoReference) return null;
  const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${API_KEY}`;
};