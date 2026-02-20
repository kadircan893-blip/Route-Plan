import React from 'react';
import PlaceCard from './PlaceCard';
import { CATEGORIES } from '../../constants/categories';

const RouteList = ({ places, selectedPlaces, onPlaceSelect, coordinates }) => {
  
  // Kategori adını bul
  const getCategoryName = (categoryId) => {
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.title : categoryId;
  };

  // Hiç yer yoksa
  if (!places || Object.keys(places).length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-6xl mb-4">🗺️</p>
        <h3 className="font-sf-pro font-semibold text-xl text-dark-slate mb-2">
          Yer Bulunamadı
        </h3>
        <p className="font-inter text-sm text-dark-slate opacity-75">
          Seçilen kategorilerde yakın yer bulunamadı.
          Mesafeyi artırmayı deneyin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(places).map(([categoryId, placesArr]) => {
        if (!placesArr || placesArr.length === 0) return null;
        
        return (
          <div key={categoryId} className="space-y-4">
            {/* Kategori Başlığı */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {CATEGORIES.find(c => c.id === categoryId)?.emoji}
              </span>
              <h2 className="font-sf-pro font-semibold text-xl text-dark-slate">
                {getCategoryName(categoryId)}
              </h2>
              <span className="font-inter text-sm text-dark-slate opacity-50">
                ({placesArr.length} yer)
              </span>
            </div>

            {/* Yer Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {placesArr.map(place => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  categoryName={getCategoryName(categoryId)}
                  isSelected={selectedPlaces.some(p => p.id === place.id)}
                  onSelect={onPlaceSelect}
                  userCoordinates={coordinates}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RouteList;