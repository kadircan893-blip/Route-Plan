import { useState, useRef } from 'react';
import { LocateFixed } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import { DISTRICTS } from '../../constants/districts';

const BACKEND_URL = 'http://localhost:3001';

const cities = Object.keys(DISTRICTS);

// Türkçe karakter duyarsız normalize
const normalize = (s) =>
  s.toLowerCase()
    .replace(/ı/g, 'i').replace(/İ/g, 'i').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');

// ─── Ulaşım Modu bileşeni ──────────────────────────────────────────────────
const TravelModeSelector = ({ travelModes, onToggle, error }) => (
  <div className="space-y-2">
    <label className="font-inter font-medium text-sm text-dark-slate block">Ulaşım Tercihi</label>
    <div className="flex gap-3">
      {[
        { key: 'driving', label: 'Araçla', icon: '🚗' },
        { key: 'walking', label: 'Yürüme', icon: '🚶' },
      ].map(({ key, label, icon }) => {
        const active = travelModes.includes(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-button border-2 font-inter font-medium text-sm transition-all
              ${active ? 'bg-moss-green border-moss-green text-white' : 'border-soft-mint text-dark-slate hover:border-moss-green'}`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
    {error && <p className="font-inter text-xs text-coral-accent">{error}</p>}
  </div>
);

// ─── Ana bileşen ──────────────────────────────────────────────────────────
const LocationInput = ({ onSubmit }) => {
  const [mode, setMode] = useState('route'); // 'route' | 'local'

  // ── Rota formu state ────────────────────────────────────────────────────
  const [routeData, setRouteData] = useState({ city: '', district: '', travelModes: ['driving'] });
  const [routeGps, setRouteGps] = useState(null);
  const [routeGpsLabel, setRouteGpsLabel] = useState('');
  const [routeLocating, setRouteLocating] = useState(false);
  const [routeGpsError, setRouteGpsError] = useState('');

  // ── Çevre Keşfet formu state ─────────────────────────────────────────────
  const [localData, setLocalData] = useState({ distance: 5, travelModes: [] });
  const [localGps, setLocalGps] = useState(null);
  const [localGpsLabel, setLocalGpsLabel] = useState('');
  const [localLocating, setLocalLocating] = useState(false);
  const [localGpsError, setLocalGpsError] = useState('');

  // ── Autocomplete — Rota Planla ────────────────────────────────────────────
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);

  const [errors, setErrors] = useState({});

  // ─── GPS ──────────────────────────────────────────────────────────────────
  const handleGps = async (formType) => {
    if (!navigator.geolocation) {
      const setter = formType === 'route' ? setRouteGpsError : setLocalGpsError;
      setter('Tarayıcınız konum özelliğini desteklemiyor.');
      return;
    }
    if (formType === 'route') { setRouteLocating(true); setRouteGpsError(''); }
    else { setLocalLocating(true); setLocalGpsError(''); }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const gps = { lat: coords.latitude, lng: coords.longitude };
        let label = 'Konum algılandı';
        try {
          const res = await fetch(`${BACKEND_URL}/api/reverse-geocode?lat=${gps.lat}&lng=${gps.lng}`);
          const data = await res.json();
          if (data.results?.[0]) {
            const get = (types) => {
              for (const type of types) {
                const found = data.results[0].address_components.find(c => c.types.includes(type));
                if (found) return found.long_name;
              }
              return '';
            };
            const province = get(['administrative_area_level_1']);
            const district2 = get(['administrative_area_level_2']);
            const neighborhood = get(['sublocality_level_1', 'neighborhood', 'administrative_area_level_4', 'sublocality']);
            const detail = neighborhood && neighborhood !== district2 ? `${neighborhood}, ${district2}` : district2 || neighborhood;
            label = detail ? `${detail}, ${province}` : province;
          }
        } catch { /* label stays default */ }

        if (formType === 'route') {
          setRouteGps(gps); setRouteGpsLabel(label); setRouteLocating(false);
        } else {
          setLocalGps(gps); setLocalGpsLabel(label); setLocalLocating(false);
        }
      },
      () => {
        const msg = 'Konum izni reddedildi.';
        if (formType === 'route') { setRouteGpsError(msg); setRouteLocating(false); }
        else { setLocalGpsError(msg); setLocalLocating(false); }
      }
    );
  };

  // ─── Autocomplete ─────────────────────────────────────────────────────────
  const filterDistricts = (input, city) => {
    if (input.length < 1) { setSuggestions([]); setShowSuggestions(false); return; }
    const list = city ? (DISTRICTS[city] || []) : [];
    const norm = normalize(input);
    const matches = list.filter(d => normalize(d).includes(norm));
    setSuggestions(matches.slice(0, 8));
    setShowSuggestions(matches.length > 0);
  };

  const handleDistrictInput = (e) => {
    const value = e.target.value;
    setRouteData(p => ({ ...p, district: value }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => filterDistricts(value, routeData.city), 150);
  };

  const handleSuggestionSelect = (district) => {
    setRouteData(p => ({ ...p, district }));
    setSuggestions([]); setShowSuggestions(false);
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (mode === 'route') {
      if (!routeGps) newErrors.gps = 'Başlangıç konumunuzu belirleyin';
      if (!routeData.city.trim() || !routeData.district.trim()) newErrors.dest = 'Hedef konum gerekli';
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;
      onSubmit({
        city: routeData.city,
        district: routeData.district,
        distance: 10,
        travelModes: routeData.travelModes.length ? routeData.travelModes : ['driving'],
        userLocation: routeGps,
        startLabel: routeGpsLabel || 'Mevcut Konumunuz',
        searchMode: 'route',
      });
    } else {
      if (!localGps) newErrors.gps = 'Konumunuzu GPS ile belirleyin';
      if (localData.travelModes.length === 0) newErrors.travel = 'Ulaşım tercihi seçin';
      if (localData.distance < 0.1 || localData.distance > 50) newErrors.distance = 'Mesafe 0.1-50km arasında olmalı';
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;
      onSubmit({
        city: '',
        district: '',
        distance: localData.distance,
        travelModes: localData.travelModes,
        userLocation: localGps,
        searchMode: 'local',
      });
    }
  };

  const routeCanSubmit = routeGps && routeData.city.trim() && routeData.district.trim();
  const localCanSubmit = localGps && localData.travelModes.length > 0;

  return (
    <Card className="w-full max-w-2xl" padding="lg">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Başlık */}
        <div className="text-center space-y-1">
          <h2 className="font-sf-pro font-semibold text-2xl text-dark-slate">Gezini Planla</h2>
          <p className="font-inter text-sm text-dark-slate opacity-60">Bir mod seç ve konumunu belirt</p>
        </div>

        {/* Mod Seçici */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode('route')}
            className={`p-4 rounded-button border-2 text-left transition-all
              ${mode === 'route' ? 'border-moss-green bg-moss-green text-white' : 'border-soft-mint text-dark-slate hover:border-moss-green'}`}
          >
            <div className="text-2xl mb-1">🗺️</div>
            <p className="font-sf-pro font-semibold text-sm">Rota Planla</p>
            <p className={`font-inter text-xs mt-0.5 ${mode === 'route' ? 'text-white opacity-80' : 'text-dark-slate opacity-50'}`}>
              Yol üzerindeki mekanlar
            </p>
          </button>
          <button
            type="button"
            onClick={() => setMode('local')}
            className={`p-4 rounded-button border-2 text-left transition-all
              ${mode === 'local' ? 'border-moss-green bg-moss-green text-white' : 'border-soft-mint text-dark-slate hover:border-moss-green'}`}
          >
            <div className="text-2xl mb-1">📍</div>
            <p className="font-sf-pro font-semibold text-sm">Çevre Keşfet</p>
            <p className={`font-inter text-xs mt-0.5 ${mode === 'local' ? 'text-white opacity-80' : 'text-dark-slate opacity-50'}`}>
              Konumun çevresindeki mekanlar
            </p>
          </button>
        </div>

        {/* ── ROTA KARTI ──────────────────────────────────────────────────── */}
        {mode === 'route' && (
          <div className="space-y-2">

            {/* Başlangıç */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-moss-green flex-shrink-0" />
                <label className="font-inter font-medium text-sm text-dark-slate">
                  Başlangıç Konumu <span className="text-coral-accent">*</span>
                </label>
              </div>

              {routeGps ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-button border-2 border-moss-green bg-moss-green text-white font-inter text-sm">
                    <LocateFixed className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">📍 {routeGpsLabel}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setRouteGps(null); setRouteGpsLabel(''); }}
                    className="w-10 h-10 rounded-button border-2 border-coral-accent text-coral-accent hover:bg-coral-accent hover:text-white transition-all flex-shrink-0 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleGps('route')}
                  disabled={routeLocating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-button border-2 border-moss-green text-moss-green hover:bg-moss-green hover:text-white font-inter font-medium text-sm transition-all disabled:opacity-50"
                >
                  <LocateFixed className={`w-4 h-4 ${routeLocating ? 'animate-spin' : ''}`} />
                  {routeLocating ? 'Konum alınıyor...' : 'Mevcut Konumumu Kullan'}
                </button>
              )}
              {(routeGpsError || errors.gps) && (
                <p className="font-inter text-xs text-coral-accent">{routeGpsError || errors.gps}</p>
              )}
            </div>

            {/* Bağlantı çizgisi */}
            <div className="flex items-center gap-2 py-1 pl-1">
              <div className="w-0.5 h-6 bg-soft-mint ml-1" />
            </div>

            {/* Hedef */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-coral-accent flex-shrink-0" />
                <label className="font-inter font-medium text-sm text-dark-slate">
                  Hedef Konum <span className="text-coral-accent">*</span>
                </label>
              </div>

              <select
                value={routeData.city}
                onChange={e => {
                  setRouteData(p => ({ ...p, city: e.target.value, district: '' }));
                  setSuggestions([]); setShowSuggestions(false);
                }}
                className="w-full px-4 py-3 rounded-button border-2 border-soft-mint focus:border-moss-green font-inter text-base transition-all focus:outline-none"
              >
                <option value="">Şehir Seçin</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <div className="relative">
                <input
                  type="text"
                  value={routeData.district}
                  onChange={handleDistrictInput}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder={routeData.city ? `${routeData.city} ilçesi ara...` : 'Önce şehir seçin'}
                  disabled={!routeData.city}
                  autoComplete="off"
                  className="w-full px-4 py-3 rounded-button border-2 border-soft-mint focus:border-moss-green font-inter text-base transition-all focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full bg-white border border-soft-mint rounded-button shadow-card mt-1 max-h-52 overflow-y-auto">
                    {suggestions.map(district => (
                      <button
                        key={district}
                        type="button"
                        onMouseDown={() => handleSuggestionSelect(district)}
                        className="w-full text-left px-4 py-3 hover:bg-soft-mint transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <p className="font-inter text-sm font-medium text-dark-slate">{district}</p>
                        <p className="font-inter text-xs text-dark-slate opacity-50">{routeData.city}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.dest && <p className="font-inter text-xs text-coral-accent">{errors.dest}</p>}
            </div>

            {/* Ulaşım Tercihi */}
            <div className="pt-2">
              <TravelModeSelector
                travelModes={routeData.travelModes}
                onToggle={m => setRouteData(p => ({
                  ...p,
                  travelModes: p.travelModes.includes(m)
                    ? p.travelModes.filter(x => x !== m)
                    : [...p.travelModes, m],
                }))}
              />
            </div>

          </div>
        )}

        {/* ── ÇEVRE KARTI ─────────────────────────────────────────────────── */}
        {mode === 'local' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-inter font-medium text-sm text-dark-slate block">
                Mevcut Konumunuz <span className="text-coral-accent">*</span>
              </label>
              {localGps ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-button border-2 border-moss-green bg-moss-green text-white font-inter text-sm">
                    <LocateFixed className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">📍 {localGpsLabel}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setLocalGps(null); setLocalGpsLabel(''); }}
                    className="w-10 h-10 rounded-button border-2 border-coral-accent text-coral-accent hover:bg-coral-accent hover:text-white transition-all flex-shrink-0 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleGps('local')}
                  disabled={localLocating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-button border-2 border-moss-green text-moss-green hover:bg-moss-green hover:text-white font-inter font-medium text-sm transition-all disabled:opacity-50"
                >
                  <LocateFixed className={`w-4 h-4 ${localLocating ? 'animate-spin' : ''}`} />
                  {localLocating ? 'Konum alınıyor...' : 'Mevcut Konumumu Kullan'}
                </button>
              )}
              {(localGpsError || errors.gps) && (
                <p className="font-inter text-xs text-coral-accent">{localGpsError || errors.gps}</p>
              )}
            </div>

            {/* Km Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-inter font-medium text-sm text-dark-slate">Çevre Arama Yarıçapı</label>
                <span className="font-inter font-semibold text-lg text-moss-green">{localData.distance} km</span>
              </div>
              <input
                type="range" min="0.1" max="50" step="0.5"
                value={localData.distance}
                onChange={e => setLocalData(p => ({ ...p, distance: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-soft-mint rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5
                  [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-moss-green
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:bg-ocean-blue
                  [&::-webkit-slider-thumb]:transition-colors"
              />
              <div className="flex justify-between font-inter text-xs text-dark-slate opacity-50">
                <span>0.1 km</span>
                <span>50 km</span>
              </div>
              {errors.distance && <p className="font-inter text-xs text-coral-accent">{errors.distance}</p>}
            </div>

            <TravelModeSelector
              travelModes={localData.travelModes}
              onToggle={m => setLocalData(p => ({
                ...p,
                travelModes: p.travelModes.includes(m) ? p.travelModes.filter(x => x !== m) : [...p.travelModes, m]
              }))}
              error={errors.travel}
            />

            <div className="bg-sky-light bg-opacity-20 p-3 rounded-button border border-sky-light">
              <p className="font-inter text-xs text-dark-slate">
                📍 Seçtiğiniz konumun {localData.distance}km çevresindeki mekanlar listelenir.
              </p>
            </div>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={mode === 'route' ? !routeCanSubmit : !localCanSubmit}
        >
          Devam Et ve Kategorileri Seç
        </Button>

      </form>
    </Card>
  );
};

export default LocationInput;
