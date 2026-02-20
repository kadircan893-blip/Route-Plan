import React, { useState } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';

const LocationInput = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    city: '',
    district: '',
    distance: 5, // Default 5km
  });

  const [errors, setErrors] = useState({});

  // Türkiye'nin büyük şehirleri
  const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana', 
    'Konya', 'Gaziantep', 'Şanlıurfa', 'Mersin', 'Diyarbakır', 
    'Kayseri', 'Eskişehir', 'Samsun', 'Denizli', 'Trabzon', 
    'Malatya', 'Balıkesir', 'Kahramanmaraş', 'Van'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Hata varsa temizle
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDistanceChange = (e) => {
    const value = parseFloat(e.target.value);
    setFormData(prev => ({
      ...prev,
      distance: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.city.trim()) {
      newErrors.city = 'Şehir seçimi zorunludur';
    }
    
    if (!formData.district.trim()) {
      newErrors.district = 'İlçe bilgisi zorunludur';
    }
    
    if (formData.distance < 0.1 || formData.distance > 15) {
      newErrors.distance = 'Mesafe 0.1km - 15km arasında olmalıdır';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full max-w-2xl" padding="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Title */}
        <div className="text-center space-y-2">
          <h2 className="font-sf-pro font-semibold text-2xl text-dark-slate">
            Gezini Planlamaya Başla
          </h2>
          <p className="font-inter text-sm text-dark-slate opacity-75">
            Konum ve mesafe bilgilerini girerek kişiselleştirilmiş rotanı oluştur
          </p>
        </div>

        {/* City Select */}
        <div className="space-y-2">
          <label className="font-inter font-medium text-sm text-dark-slate block">
            Şehir <span className="text-coral-accent">*</span>
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-button border-2 font-inter text-base transition-all
              ${errors.city 
                ? 'border-coral-accent focus:border-coral-accent' 
                : 'border-soft-mint focus:border-moss-green'
              } 
              focus:outline-none focus:ring-2 focus:ring-moss-green focus:ring-opacity-20`}
          >
            <option value="">Şehir Seçin</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.city && (
            <p className="font-inter text-xs text-coral-accent">{errors.city}</p>
          )}
        </div>

        {/* District Input */}
        <div className="space-y-2">
          <label className="font-inter font-medium text-sm text-dark-slate block">
            İlçe / Bölge <span className="text-coral-accent">*</span>
          </label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            placeholder="Örn: Kadıköy, Konak, Çankaya..."
            className={`w-full px-4 py-3 rounded-button border-2 font-inter text-base transition-all
              ${errors.district 
                ? 'border-coral-accent focus:border-coral-accent' 
                : 'border-soft-mint focus:border-moss-green'
              } 
              focus:outline-none focus:ring-2 focus:ring-moss-green focus:ring-opacity-20`}
          />
          {errors.district && (
            <p className="font-inter text-xs text-coral-accent">{errors.district}</p>
          )}
        </div>

        {/* Distance Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-inter font-medium text-sm text-dark-slate">
              Gezi Mesafesi
            </label>
            <span className="font-inter font-semibold text-lg text-moss-green">
              {formData.distance} km
            </span>
          </div>
          
          <input
            type="range"
            name="distance"
            min="0.1"
            max="15"
            step="0.1"
            value={formData.distance}
            onChange={handleDistanceChange}
            className="w-full h-2 bg-soft-mint rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-5 
              [&::-webkit-slider-thumb]:h-5 
              [&::-webkit-slider-thumb]:bg-moss-green 
              [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:hover:bg-ocean-blue
              [&::-webkit-slider-thumb]:transition-colors"
          />
          
          <div className="flex justify-between font-inter text-xs text-dark-slate opacity-50">
            <span>0.1 km</span>
            <span>15 km</span>
          </div>
          
          {errors.distance && (
            <p className="font-inter text-xs text-coral-accent">{errors.distance}</p>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-sky-light bg-opacity-20 p-4 rounded-button border border-sky-light">
          <p className="font-inter text-xs text-dark-slate">
            💡 <strong>İpucu:</strong> Mesafe, seçtiğiniz konumdan ne kadar uzağa kadar yer önerilmesini istediğinizi belirler. 
            Kısa mesafeler için yürüyüş rotaları, uzun mesafeler için araç ile gezi önerilir.
          </p>
        </div>

        {/* Submit Button */}
        <Button type="submit" variant="primary" fullWidth>
          Devam Et ve Kategorileri Seç
        </Button>
      </form>
    </Card>
  );
};

export default LocationInput;