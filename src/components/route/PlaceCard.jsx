import React from 'react';
import { MapPin, Star, Clock, Check } from 'lucide-react';
import { getTransportSuggestion } from '../../services/utils/distanceCalculator';

const PlaceCard = ({ place, categoryName, isSelected, onSelect, userCoordinates }) => {
  
  // Mesafe ve ulaşım hesapla
  const transport = userCoordinates ? getTransportSuggestion(
    Math.round(
      Math.sqrt(
        Math.pow(place.location.lat - userCoordinates.lat, 2) +
        Math.pow(place.location.lng - userCoordinates.lng, 2)
      ) * 111000
    )
  ) : null;

  return (
    <div
      onClick={() => onSelect(place)}
      className={`
        relative bg-white rounded-card shadow-soft p-5 cursor-pointer
        transition-all duration-200 hover:shadow-card hover:-translate-y-1
        ${isSelected ? 'border-2 border-moss-green' : 'border-2 border-transparent'}
      `}
    >
      {/* Seçim İndikatörü */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-7 h-7 bg-moss-green rounded-full flex items-center justify-center shadow-md">
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      )}

      {/* Kategori Badge */}
      <span className="inline-block px-3 py-1 bg-soft-mint text-moss-green font-inter font-medium text-xs rounded-full mb-3">
        {categoryName}
      </span>

      {/* Yer Adı */}
      <h3 className="font-sf-pro font-semibold text-lg text-dark-slate mb-2 pr-8">
        {place.name}
      </h3>

      {/* Adres */}
      <div className="flex items-start gap-2 mb-3">
        <MapPin className="w-4 h-4 text-moss-green mt-0.5 flex-shrink-0" strokeWidth={1.5} />
        <p className="font-inter text-sm text-dark-slate opacity-75">
          {place.address}
        </p>
      </div>

      {/* Rating */}
      {place.rating > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-coral-accent fill-coral-accent" strokeWidth={1.5} />
          <span className="font-inter font-medium text-sm text-dark-slate">
            {place.rating.toFixed(1)}
          </span>
          {place.userRatingsTotal > 0 && (
            <span className="font-inter text-xs text-dark-slate opacity-50">
              ({place.userRatingsTotal} değerlendirme)
            </span>
          )}
        </div>
      )}

      {/* Ulaşım Bilgisi */}
      {transport && (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-ocean-blue" strokeWidth={1.5} />
          <span className="font-inter text-xs text-dark-slate">
            {transport.icon} {transport.time}
          </span>
        </div>
      )}

      {/* Açık/Kapalı */}
      {place.openNow !== undefined && (
        <div className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-inter font-medium
          ${place.openNow ? 'bg-soft-mint text-moss-green' : 'bg-red-100 text-red-500'}`}>
          {place.openNow ? '✓ Açık' : '✗ Kapalı'}
        </div>
      )}
    </div>
  );
};

export default PlaceCard;