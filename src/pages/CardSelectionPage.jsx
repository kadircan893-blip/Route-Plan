import { useState } from 'react';
import Layout from '../components/common/Layout';
import useAppStore from '../store/appStore';

const ALL_CATEGORIES = [
  {
    id: 'restoranlar', label: 'Restoranlar', emoji: '🍴', desc: 'Yemek mekanlarını keşfet',
    filters: [
      { keyword: 'burger',  label: 'Burger', emoji: '🍔' },
      { keyword: 'pizza',   label: 'Pizza',  emoji: '🍕' },
      { keyword: 'döner',   label: 'Döner',  emoji: '🥙' },
      { keyword: 'pide',    label: 'Pide',   emoji: '🫓' },
      { keyword: 'kebap',   label: 'Kebap',  emoji: '🌯' },
      { keyword: 'sushi',   label: 'Sushi',  emoji: '🍣' },
      { keyword: 'balık',   label: 'Balık',  emoji: '🐟' },
    ],
  },
  {
    id: 'kahve-brunch', label: 'Kahve & Brunch', emoji: '☕', desc: 'Kafe ve brunch mekanları',
    filters: [
      { keyword: 'kahve',   label: 'Kahve',   emoji: '☕' },
      { keyword: 'tatlı',   label: 'Tatlı',   emoji: '🍰' },
      { keyword: 'pastane', label: 'Pastane', emoji: '🥐' },
    ],
  },
  { id: 'publar',           label: 'Pub',              emoji: '🍻', desc: 'Bar ve pub mekanları'        },
  { id: 'muze-gezisi',      label: 'Müze Gezisi',       emoji: '🖼️', desc: 'Müzeleri keşfedin'           },
  { id: 'tarihi-gezi',      label: 'Tarihi Gezi',       emoji: '🏛️', desc: 'Tarihi yerleri keşfedin'     },
  { id: 'otel',             label: 'Otel',              emoji: '🏨', desc: 'Konaklama seçenekleri'       },
  { id: 'supermarket',      label: 'Süpermarket',       emoji: '🛒', desc: 'Yakındaki marketler'         },
  { id: 'sahiller',         label: 'Plaj & Sahil',      emoji: '🏖️', desc: 'Deniz ve plaj keyfi'         },
  { id: 'doga-yuruyusu',    label: 'Doğa Yürüyüşü',    emoji: '🥾', desc: 'Doğa yürüyüş rotaları'      },
  { id: 'kamp',             label: 'Kamp Alanı',        emoji: '⛺', desc: 'Kamp alanlarını keşfedin'   },
  { id: 'benzin-istasyonu', label: 'Benzin İstasyonu',  emoji: '⛽', desc: 'Yakındaki istasyonlar'       },
  { id: 'park',             label: 'Park',              emoji: '🌳', desc: 'Yakındaki parklar'           },
];

const CardSelectionPage = ({ onCategoriesSubmit }) => {
  const [selectedCats, setSelectedCats] = useState(new Set());
  const [activeFilters, setActiveFilters] = useState({});
  const locationData = useAppStore(s => s.locationData);

  const toggleCat = (id) => {
    setSelectedCats(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setActiveFilters(f => { const n = { ...f }; delete n[id]; return n; });
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleFilter = (catId, keyword) => {
    setActiveFilters(prev => {
      const curr = prev[catId] || [];
      return {
        ...prev,
        [catId]: curr.includes(keyword) ? curr.filter(k => k !== keyword) : [...curr, keyword],
      };
    });
  };

  const totalSelected = selectedCats.size;

  const handleSubmit = () => {
    onCategoriesSubmit([...selectedCats], { ...activeFilters });
  };

  const selectedFilterable = ALL_CATEGORIES.filter(c => c.filters && selectedCats.has(c.id));

  const destination = locationData?.city && locationData?.district
    ? `${locationData.district}, ${locationData.city}`
    : null;

  const isLocal = locationData?.searchMode === 'local';

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-4 pb-6">

        {/* Başlık */}
        <div>
          <h2 className="font-sf-pro font-semibold text-2xl text-dark-slate">Kategori Seç</h2>
          {destination && (
            <p className="font-inter text-sm text-dark-slate opacity-60 mt-1">
              {isLocal
                ? `${destination} çevresindeki mekanlar listelenecek`
                : `${destination} rotasındaki mekanlar listelenecek`}
            </p>
          )}
        </div>

        {/* Tüm kategoriler — 2 sütun grid */}
        <div className="grid grid-cols-2 gap-3">
          {ALL_CATEGORIES.map(({ id, label, emoji, desc }) => {
            const active = selectedCats.has(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleCat(id)}
                className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all
                  ${active
                    ? 'border-moss-green bg-moss-green/5 shadow-soft'
                    : 'border-soft-mint bg-white hover:border-moss-green hover:bg-soft-mint/20'
                  }`}
              >
                {active && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-moss-green rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
                <span className="text-3xl flex-shrink-0">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-sf-pro font-semibold text-sm leading-tight ${active ? 'text-moss-green' : 'text-dark-slate'}`}>
                    {label}
                  </p>
                  <p className="font-inter text-xs text-dark-slate opacity-50 mt-0.5 line-clamp-1">{desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filtre paneli — seçilen filtre içerikli kategoriler için */}
        {selectedFilterable.length > 0 && (
          <div className="space-y-3">
            {selectedFilterable.map(cat => (
              <div key={cat.id} className="bg-white rounded-2xl border border-soft-mint shadow-soft p-4">
                <p className="font-inter font-medium text-sm text-dark-slate mb-3">
                  {cat.emoji} {cat.label} Filtreleri
                  <span className="font-normal opacity-50 ml-1">(isteğe bağlı)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {cat.filters.map(({ keyword, label, emoji }) => {
                    const active = (activeFilters[cat.id] || []).includes(keyword);
                    return (
                      <button
                        key={keyword}
                        type="button"
                        onClick={() => toggleFilter(cat.id, keyword)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full border-2 transition-all
                          ${active
                            ? 'border-moss-green bg-moss-green text-white shadow-soft'
                            : 'border-soft-mint text-dark-slate hover:border-moss-green hover:bg-soft-mint/20'
                          }`}
                      >
                        <span className="text-base leading-none">{emoji}</span>
                        <span className="font-inter font-medium text-xs">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Seçim özeti */}
        {totalSelected > 0 && (
          <div className="bg-moss-green/5 border border-moss-green/20 rounded-xl px-4 py-3">
            <p className="font-inter text-sm text-moss-green font-medium">
              {totalSelected} kategori seçildi
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={totalSelected === 0}
          className="w-full py-4 bg-moss-green text-white font-sf-pro font-semibold text-base rounded-button shadow-soft transition-all hover:bg-ocean-blue active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Mekanları Bul
          {totalSelected > 0 && <span className="ml-2 opacity-80">({totalSelected} kategori)</span>}
        </button>

      </div>
    </Layout>
  );
};

export default CardSelectionPage;
