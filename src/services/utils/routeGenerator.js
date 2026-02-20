
export const generateOptimalRoute = (selectedPlaces) => {
  if (!selectedPlaces || selectedPlaces.length === 0) return [];
  
  if (selectedPlaces.length <= 2) return selectedPlaces;
  
  const route = [selectedPlaces[0]];
  const remaining = [...selectedPlaces.slice(1)];
  
  while (remaining.length > 0) {
    const current = route[route.length - 1];
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    
    remaining.forEach((place, index) => {
      const distance = calculateDistanceBetweenPlaces(current, place);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    
    route.push(remaining[nearestIndex]);
    remaining.splice(nearestIndex, 1);
  }
  
  return route;
};

const calculateDistanceBetweenPlaces = (place1, place2) => {
  const lat1 = place1.location.lat;
  const lng1 = place1.location.lng;
  const lat2 = place2.location.lat;
  const lng2 = place2.location.lng;
  
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calculateTotalTripTime = (places) => {
  if (!places || places.length === 0) return '0 dakika';
  
  const timePerPlace = 45;
  const totalMinutes = places.length * timePerPlace;
  
  const travelTime = (places.length - 1) * 10;
  const grandTotal = totalMinutes + travelTime;
  
  if (grandTotal < 60) return `${grandTotal} dakika`;
  
  const hours = Math.floor(grandTotal / 60);
  const minutes = grandTotal % 60;
  return minutes > 0 ? `${hours} saat ${minutes} dakika` : `${hours} saat`;
};

export const splitRouteByDay = (places, hoursPerDay = 8) => {
  const minutesPerDay = hoursPerDay * 60;
  const timePerPlace = 45;
  const travelTime = 10;
  const timePerStop = timePerPlace + travelTime;
  
  const placesPerDay = Math.floor(minutesPerDay / timePerStop);
  const days = [];
  
  for (let i = 0; i < places.length; i += placesPerDay) {
    days.push({
      day: days.length + 1,
      places: places.slice(i, i + placesPerDay),
    });
  }
  
  return days;
};

export const generateRouteSummary = (places, categories) => {
  return {
    totalPlaces: places.length,
    totalTime: calculateTotalTripTime(places),
    categories: [...new Set(categories)],
    topRatedPlace: places.reduce((best, place) => 
      (place.rating > (best?.rating || 0)) ? place : best, null
    ),
  };
};