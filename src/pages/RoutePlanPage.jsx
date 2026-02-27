import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import useAppStore from '../store/appStore';
import { searchPlacesByCategories } from '../services/api/googlePlacesAPI';
import { generateOptimalRoute } from '../services/utils/routeGenerator';
import { haversineDistance, formatDistance } from '../services/utils/distanceCalculator';

const CATEGORY_META = {
  'restoranlar':       { label: 'Restoranlar',     emoji: '🍴' },
  'kahve-brunch':      { label: 'Kahve & Brunch',  emoji: '☕' },
  'publar':            { label: 'Pub',             emoji: '🍻' },
  'muze-gezisi':       { label: 'Müze',            emoji: '🖼️' },
  'tarihi-gezi':       { label: 'Tarihi Yer',      emoji: '🏛️' },
  'otel':              { label: 'Otel',            emoji: '🏨' },
  'supermarket':       { label: 'Süpermarket',     emoji: '🛒' },
  'sahiller':          { label: 'Plaj & Sahil',    emoji: '🏖️' },
  'doga-yuruyusu':     { label: 'Doğa Yürüyüşü',  emoji: '🥾' },
  'kamp':              { label: 'Kamp Alanı',      emoji: '⛺' },
  'benzin-istasyonu':  { label: 'Benzin İstasyonu',emoji: '⛽' },
  'park':              { label: 'Park',            emoji: '🌳' },
};

// Rota: origin → waypoints → destination, travelMode ile
const buildRouteMapsUrl = (stops, userLocation, destinationCoords, travelMode = 'driving') => {
  if (!userLocation) return null;
  const origin = `${userLocation.lat},${userLocation.lng}`;
  let dest, waypointList;
  if (destinationCoords) {
    dest = `${destinationCoords.lat},${destinationCoords.lng}`;
    waypointList = stops;
  } else if (stops.length > 0) {
    const last = stops[stops.length - 1];
    dest = `${last.location.lat},${last.location.lng}`;
    waypointList = stops.slice(0, -1);
  } else {
    return null;
  }
  const waypoints = waypointList.map(p => `${p.location.lat},${p.location.lng}`).join('|');
  let url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&travelmode=${travelMode}`;
  if (waypoints) url += `&waypoints=${encodeURIComponent(waypoints)}`;
  return url;
};

// ─── Ana sayfa ─────────────────────────────────────────────────────────────
const RoutePlanPage = () => {
  const navigate = useNavigate();
  const locationData       = useAppStore(s => s.locationData);
  const selectedCategories = useAppStore(s => s.selectedCategories);
  const categoryKeywords   = useAppStore(s => s.categoryKeywords);

  // 'loading' | 'selecting' | 'done' | 'error'
  const [phase, setPhase]                         = useState('loading');
  const [allPlaces, setAllPlaces]                 = useState({});
  const [selectedIds, setSelectedIds]             = useState(new Set());
  const [routeStops, setRouteStops]               = useState([]);
  const [destinationCoords, setDestinationCoords] = useState(null);

  const isRouteMode = locationData?.searchMode === 'route';
  const userRef     = locationData?.userLocation ?? null;
  const travelMode  = locationData?.travelModes?.[0] ?? 'driving';

  useEffect(() => {
    if (!locationData || !selectedCategories?.length) { navigate('/'); return; }

    let cancelled = false;

    const run = async () => {
      try {
        const result = await searchPlacesByCategories(locationData, selectedCategories, categoryKeywords);
        if (cancelled) return;
        setDestinationCoords(result.coordinates ?? null);
        setAllPlaces(result.places);
        setSelectedIds(new Set());
        setPhase('selecting');
      } catch {
        if (!cancelled) setPhase('error');
      }
    };

    run();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Seçim değiştir ────────────────────────────────────────────────────────
  const togglePlace = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Seçimden rotayı oluştur ───────────────────────────────────────────────
  const handleBuildRoute = () => {
    const picks = selectedCategories.flatMap(catId =>
      (allPlaces[catId] || [])
        .slice(0, 5)
        .filter(p => selectedIds.has(p.id))
        .map(p => ({ ...p, categoryId: catId }))
    );
    const ordered = generateOptimalRoute(picks, userRef ?? null);
    setRouteStops(ordered);
    setPhase('done');
  };

  // ────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ────────────────────────────────────────────────────────────────────────

  // ── Yükleniyor ─────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto flex flex-col items-center py-24">
          <div className="w-14 h-14 border-4 border-moss-green border-t-transparent rounded-full animate-spin" />
          <h2 className="font-sf-pro font-semibold text-xl text-dark-slate mt-8">
            {isRouteMode ? 'Güzergah Üzerindeki Mekanlar Aranıyor' : 'Çevrenizdeki Mekanlar Aranıyor'}
          </h2>
          <p className="font-inter text-sm text-dark-slate opacity-50 mt-2">
            {selectedCategories?.length || 0} kategori taranıyor…
          </p>
        </div>
      </Layout>
    );
  }

  // ── Hata ───────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-20">
          <p className="text-5xl mb-4">😕</p>
          <h2 className="font-sf-pro font-semibold text-xl text-dark-slate mb-2">Bir sorun oluştu</h2>
          <p className="font-inter text-sm text-dark-slate opacity-50 mb-6">
            Mekanlar yüklenirken hata oluştu.
          </p>
          <button onClick={() => navigate('/card-selection')}
            className="px-6 py-3 bg-moss-green text-white font-sf-pro font-semibold rounded-button shadow-soft hover:bg-ocean-blue transition-all">
            Geri Dön
          </button>
        </div>
      </Layout>
    );
  }

  // ── SEÇİM FAZI ─────────────────────────────────────────────────────────
  if (phase === 'selecting') {
    const totalShown = selectedCategories.reduce((acc, catId) =>
      acc + (allPlaces[catId] || []).slice(0, 5).length, 0
    );

    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-4 pb-6">

          {/* Başlık */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-sf-pro font-semibold text-2xl text-dark-slate">Mekanlarınızı Seçin</h2>
              <p className="font-inter text-sm text-dark-slate opacity-60 mt-1">
                {totalShown} mekan bulundu · {selectedIds.size} seçildi
              </p>
            </div>
            <button
              onClick={() => navigate('/card-selection')}
              className="flex-shrink-0 px-4 py-2 bg-white border border-soft-mint rounded-xl font-inter text-sm text-dark-slate hover:border-moss-green transition-all shadow-soft"
            >
              ← Kategoriler
            </button>
          </div>

          {/* Kategori bazlı mekan listesi */}
          {selectedCategories.map(catId => {
            const places = (allPlaces[catId] || []).slice(0, 5);
            if (!places.length) return null;
            const meta = CATEGORY_META[catId] ?? { label: catId, emoji: '📍' };

            return (
              <div key={catId} className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <span className="text-xl">{meta.emoji}</span>
                  <span className="font-sf-pro font-semibold text-sm text-dark-slate">{meta.label}</span>
                  <span className="font-inter text-xs text-dark-slate opacity-40">({places.length})</span>
                </div>

                {places.map(place => {
                  const selected = selectedIds.has(place.id);
                  const dist = userRef
                    ? haversineDistance(userRef.lat, userRef.lng, place.location.lat, place.location.lng)
                    : null;

                  return (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => togglePlace(place.id)}
                      className={`relative w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all
                        ${selected
                          ? 'border-moss-green bg-moss-green/5 shadow-soft'
                          : 'border-soft-mint bg-white hover:border-moss-green hover:bg-soft-mint/10'
                        }`}
                    >
                      <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                        ${selected ? 'bg-moss-green border-moss-green' : 'border-dark-slate/20'}`}>
                        {selected && <span className="text-white text-xs font-bold">✓</span>}
                      </div>

                      <div className="flex-1 min-w-0 pr-7">
                        <p className={`font-sf-pro font-semibold text-sm leading-tight ${selected ? 'text-moss-green' : 'text-dark-slate'}`}>
                          {place.name}
                        </p>
                        {place.address && (
                          <p className="font-inter text-xs text-dark-slate opacity-50 mt-0.5 line-clamp-1">
                            {place.address}
                          </p>
                        )}
                        {dist !== null && (
                          <span className="inline-block mt-1 font-inter text-xs text-moss-green font-medium">
                            {formatDistance(dist)}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* Rotayı Oluştur butonu */}
          <div className="sticky bottom-4 pt-2">
            <button
              type="button"
              onClick={handleBuildRoute}
              disabled={selectedIds.size === 0}
              className="w-full py-4 bg-moss-green text-white font-sf-pro font-semibold text-base rounded-button shadow-soft transition-all hover:bg-ocean-blue active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Rotayı Oluştur
              {selectedIds.size > 0 && <span className="ml-2 opacity-80">({selectedIds.size} mekan)</span>}
            </button>
          </div>

        </div>
      </Layout>
    );
  }

  // ── SONUÇ FAZI ─────────────────────────────────────────────────────────
  const startLabel = locationData?.startLabel || 'Mevcut Konumunuz';
  const endLabel   = locationData?.city && locationData?.district
    ? `${locationData.district}, ${locationData.city}`
    : 'Hedef Konum';

  const travelModeLabel = travelMode === 'walking' ? 'Yürüme' : 'Araçla';

  const mapsUrl = buildRouteMapsUrl(
    routeStops,
    userRef,
    isRouteMode ? destinationCoords : null,
    travelMode
  );

  // Mekan seçilmedi
  if (!routeStops.length) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="font-sf-pro font-semibold text-xl text-dark-slate mb-2">Mekan Seçilmedi</h2>
          <p className="font-inter text-sm text-dark-slate opacity-50 mb-6">
            Rotanıza en az bir mekan ekleyin.
          </p>
          <button onClick={() => setPhase('selecting')}
            className="px-6 py-3 bg-moss-green text-white font-sf-pro font-semibold rounded-button shadow-soft hover:bg-ocean-blue transition-all">
            ← Mekan Seçimine Dön
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-4 pb-6">

        {/* Başlık */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-sf-pro font-semibold text-2xl text-dark-slate">Rotanız Hazır</h2>
            <p className="font-inter text-sm text-dark-slate opacity-60 mt-1">
              {isRouteMode
                ? `${routeStops.length} durak · ${startLabel} → ${endLabel}`
                : `${routeStops.length} durak · ${travelModeLabel} · ${locationData?.distance ?? ''}km çevresinde`}
            </p>
          </div>
          <button
            onClick={() => setPhase('selecting')}
            className="flex-shrink-0 px-4 py-2 bg-white border border-soft-mint rounded-xl font-inter text-sm text-dark-slate hover:border-moss-green transition-all shadow-soft"
          >
            ← Mekanlar
          </button>
        </div>

        {/* ═══ ROTA GÖRÜNÜMÜ ═══ */}
        <div>
          {/* Başlangıç */}
          <div className="bg-white rounded-2xl shadow-soft border border-soft-mint p-4 flex items-center gap-4">
            <div className="w-9 h-9 bg-moss-green rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-base">▶</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-inter text-xs text-moss-green font-semibold uppercase tracking-wide mb-0.5">Başlangıç</p>
              <p className="font-sf-pro font-semibold text-base text-dark-slate leading-tight truncate">{startLabel}</p>
            </div>
          </div>
          <div className="flex py-0.5 pl-[18px]"><div className="w-0.5 h-5 bg-moss-green/25 rounded-full" /></div>

          {/* Duraklar */}
          {routeStops.map((place, index) => {
            const meta = CATEGORY_META[place.categoryId] ?? { label: place.categoryId, emoji: '📍' };
            const dist = userRef
              ? haversineDistance(userRef.lat, userRef.lng, place.location.lat, place.location.lng)
              : null;
            return (
              <div key={place.id}>
                <div className="bg-white rounded-2xl shadow-soft border border-soft-mint p-4 flex items-start gap-4">
                  <div className="w-9 h-9 bg-moss-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white font-sf-pro font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base leading-none">{meta.emoji}</span>
                      <span className="font-inter text-xs text-moss-green font-semibold uppercase tracking-wide">{meta.label}</span>
                      {dist !== null && (
                        <span className="ml-auto font-inter text-xs text-dark-slate opacity-40">{formatDistance(dist)}</span>
                      )}
                    </div>
                    <p className="font-sf-pro font-semibold text-base text-dark-slate leading-tight">{place.name}</p>
                    {place.address && (
                      <p className="font-inter text-xs text-dark-slate opacity-50 mt-1 line-clamp-2">{place.address}</p>
                    )}
                  </div>
                </div>
                {(isRouteMode || index < routeStops.length - 1) && (
                  <div className="flex py-0.5 pl-[18px]"><div className="w-0.5 h-5 bg-moss-green/25 rounded-full" /></div>
                )}
              </div>
            );
          })}

          {/* Bitiş — sadece rota modunda */}
          {isRouteMode && (
            <div className="bg-white rounded-2xl shadow-soft border border-soft-mint p-4 flex items-center gap-4">
              <div className="w-9 h-9 bg-coral-accent rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-base">■</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-inter text-xs text-coral-accent font-semibold uppercase tracking-wide mb-0.5">Bitiş</p>
                <p className="font-sf-pro font-semibold text-base text-dark-slate leading-tight truncate">{endLabel}</p>
              </div>
            </div>
          )}
        </div>

        {/* Ulaşım modu etiketi */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm">{travelMode === 'walking' ? '🚶' : '🚗'}</span>
          <span className="font-inter text-xs text-dark-slate opacity-50">{travelModeLabel} rotası</span>
        </div>

        {/* Google Maps butonu */}
        {mapsUrl && (
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 bg-moss-green text-white font-sf-pro font-semibold text-base rounded-button shadow-soft transition-all hover:bg-ocean-blue active:scale-[0.98]">
            <span>🗺️</span>
            <span>Google Maps&apos;te {travelModeLabel} Rotasını Aç</span>
          </a>
        )}

        <button onClick={() => navigate('/')}
          className="w-full py-3 bg-white border border-soft-mint text-dark-slate font-inter text-sm rounded-button hover:border-moss-green transition-all">
          Yeni Arama Yap
        </button>

      </div>
    </Layout>
  );
};

export default RoutePlanPage;
