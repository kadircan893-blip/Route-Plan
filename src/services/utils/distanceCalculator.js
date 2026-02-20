// Mesafe Hesaplama Utilities

// Metre cinsinden mesafeyi okunabilir formata çevir
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

// Kilometre cinsinden mesafeyi metreye çevir
export const kmToMeters = (km) => {
  return km * 1000;
};

// Metreyi kilometreye çevir
export const metersToKm = (meters) => {
  return meters / 1000;
};

// Yürüyüş süresini hesapla (ortalama 5km/saat)
export const calculateWalkingTime = (distanceInMeters) => {
  const walkingSpeedMps = 5000 / 3600; // 5km/saat → metre/saniye
  const seconds = distanceInMeters / walkingSpeedMps;
  const minutes = Math.round(seconds / 60);
  
  if (minutes < 60) {
    return `${minutes} dk yürüyüş`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} sa ${remainingMinutes} dk yürüyüş`;
};

// Araç sürüş süresini hesapla (ortalama 40km/saat şehir içi)
export const calculateDrivingTime = (distanceInMeters) => {
  const drivingSpeedMps = 40000 / 3600; // 40km/saat → metre/saniye
  const seconds = distanceInMeters / drivingSpeedMps;
  const minutes = Math.round(seconds / 60);
  
  if (minutes < 60) {
    return `${minutes} dk sürüş`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} sa ${remainingMinutes} dk sürüş`;
};

// Mesafeye göre ulaşım önerisi
export const getTransportSuggestion = (distanceInMeters) => {
  if (distanceInMeters < 500) {
    return { type: 'yürüyüş', icon: '🚶', time: calculateWalkingTime(distanceInMeters) };
  } else if (distanceInMeters < 2000) {
    return { type: 'yürüyüş veya bisiklet', icon: '🚴', time: calculateWalkingTime(distanceInMeters) };
  } else {
    return { type: 'araç', icon: '🚗', time: calculateDrivingTime(distanceInMeters) };
  }
};

// Rating yıldızlarını oluştur
export const formatRating = (rating) => {
  if (!rating) return 'Değerlendirme yok';
  const stars = '⭐'.repeat(Math.round(rating));
  return `${stars} (${rating.toFixed(1)})`;
};