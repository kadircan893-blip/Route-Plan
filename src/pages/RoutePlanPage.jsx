import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import RouteList from '../components/route/RouteList';
import AIRecommendation from '../components/route/AIRecommendation';
import Notification from '../components/ui/Notification';
import useAppStore from '../store/appStore';
import { searchPlacesByCategories } from '../services/api/googlePlacesAPI';
import { generateOptimalRoute } from '../services/utils/routeGenerator';
import { generateAIRoute } from '../services/api/claudeAPI';

const RoutePlanPage = () => {
  const navigate = useNavigate();
  const {
    locationData,
    selectedCategories,
    places,
    setPlaces,
    coordinates,
    setCoordinates,
    selectedPlaces,
    addPlace,
    removePlace,
    isLoadingPlaces,
    setIsLoadingPlaces,
    error,
    setError,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('places');
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    if (!locationData || !selectedCategories.length) {
      navigate('/');
      return;
    }
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      setIsLoadingPlaces(true);
      setError(null);
      const result = await searchPlacesByCategories(locationData, selectedCategories);
      setCoordinates(result.coordinates);
      setPlaces(result.places);
    } catch (err) {
      setError('Yerler yüklenirken hata oluştu. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  const handlePlaceSelect = (place) => {
    const isSelected = selectedPlaces.some(p => p.id === place.id);
    if (isSelected) {
      removePlace(place.id);
    } else {
      addPlace(place);
    }
  };

  const handleCreateRoute = () => {
    if (selectedPlaces.length === 0) {
      alert('Lütfen en az bir yer seçin!');
      return;
    }
    setActiveTab('route');
  };

  const handleGenerateAI = async () => {
    try {
      setIsLoadingAI(true);
      setShowAIModal(true);
      const aiResult = await generateAIRoute(locationData, selectedCategories, places);
      setAiRecommendation(aiResult);
    } catch (error) {
      console.error('AI tavsiyesi oluşturulamadı:', error);
      alert('AI tavsiyesi oluşturulamadı. Lütfen daha sonra tekrar deneyin.');
      setShowAIModal(false);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const optimalRoute = generateOptimalRoute(selectedPlaces);

  return (
    <Layout>
      <div className="space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-sf-pro font-semibold text-3xl md:text-4xl text-dark-slate">
            Gezi Rotanı Oluştur
          </h1>
          {locationData && (
            <p className="font-inter text-base text-dark-slate opacity-75">
              📍 {locationData.city}, {locationData.district} · {locationData.distance}km yarıçap
            </p>
          )}
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setActiveTab('places')}
            className={`px-6 py-3 rounded-button font-inter font-medium text-base transition-all
              ${activeTab === 'places'
                ? 'bg-moss-green text-white shadow-soft'
                : 'bg-soft-mint text-dark-slate hover:bg-moss-green hover:text-white'
              }`}
          >
            🗺️ Yerler
          </button>
          <button
            onClick={() => setActiveTab('route')}
            className={`px-6 py-3 rounded-button font-inter font-medium text-base transition-all
              ${activeTab === 'route'
                ? 'bg-moss-green text-white shadow-soft'
                : 'bg-soft-mint text-dark-slate hover:bg-moss-green hover:text-white'
              }`}
          >
            🧭 Rotam ({selectedPlaces.length})
          </button>
        </div>

        {/* Loading */}
        {isLoadingPlaces && (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-soft-mint border-t-moss-green rounded-full animate-spin mx-auto mb-4" />
            <p className="font-inter text-base text-dark-slate">
              Yakınındaki yerler aranıyor...
            </p>
          </div>
        )}

        {/* Hata */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-card p-4 text-center">
            <p className="font-inter text-sm text-red-600">{error}</p>
            <Button variant="outline" onClick={fetchPlaces} className="mt-3">
              Tekrar Dene
            </Button>
          </div>
        )}

        {/* Yerler Tab */}
        {!isLoadingPlaces && !error && activeTab === 'places' && (
          <div className="space-y-6">
            <RouteList
              places={places}
              selectedPlaces={selectedPlaces}
              onPlaceSelect={handlePlaceSelect}
              coordinates={coordinates}
            />
            {selectedPlaces.length > 0 && (
              <div className="sticky bottom-6 flex justify-center">
                <Button
                  variant="primary"
                  onClick={handleCreateRoute}
                  className="shadow-lg px-8"
                >
                  🧭 Rotayı Oluştur ({selectedPlaces.length} yer seçildi)
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Rota Tab */}
        {activeTab === 'route' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {selectedPlaces.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-6xl mb-4">🧭</p>
                <h3 className="font-sf-pro font-semibold text-xl text-dark-slate mb-2">
                  Henüz yer seçmediniz
                </h3>
                <p className="font-inter text-sm text-dark-slate opacity-75 mb-4">
                  Yerler sekmesinden gitmek istediğiniz yerleri seçin
                </p>
                <Button variant="primary" onClick={() => setActiveTab('places')}>
                  Yer Seçmeye Git
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-soft-mint p-5 rounded-card">
                  <h2 className="font-sf-pro font-semibold text-xl text-dark-slate mb-1">
                    🗺️ Gezi Rotanız
                  </h2>
                  <p className="font-inter text-sm text-dark-slate opacity-75">
                    {optimalRoute.length} durak · Optimize edilmiş rota
                  </p>
                </div>

                {optimalRoute.map((place, index) => (
                  <div key={place.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-moss-green rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      {index < optimalRoute.length - 1 && (
                        <div className="w-0.5 h-full bg-soft-mint mt-2" />
                      )}
                    </div>
                    <div className="bg-white rounded-card shadow-soft p-4 flex-1 mb-4">
                      <h3 className="font-sf-pro font-semibold text-lg text-dark-slate">
                        {place.name}
                      </h3>
                      <p className="font-inter text-sm text-dark-slate opacity-75 mt-1">
                        📍 {place.address}
                      </p>
                      {place.rating > 0 && (
                        <p className="font-inter text-sm text-coral-accent mt-1">
                          ⭐ {place.rating.toFixed(1)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setActiveTab('places')} fullWidth>
                    Düzenle
                  </Button>
                  <Button variant="primary" onClick={() => navigate('/map')} fullWidth>
                    Haritada Gör
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Notification */}
        <Notification
          onClick={handleGenerateAI}
          hasRecommendation={!isLoadingPlaces && Object.keys(places).length > 0}
        />

        {/* AI Recommendation Modal */}
        {showAIModal && (
          <AIRecommendation
            recommendation={aiRecommendation}
            onClose={() => setShowAIModal(false)}
            isLoading={isLoadingAI}
          />
        )}

      </div>
    </Layout>
  );
};

export default RoutePlanPage;