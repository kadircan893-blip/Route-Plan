import React from 'react';
import { X, Sparkles, Clock, MapPin, Lightbulb } from 'lucide-react';
import Button from '../common/Button';

const AIRecommendation = ({ recommendation, onClose, isLoading }) => {
  
  if (!recommendation) return null;

  const { aiRecommendation } = recommendation;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-card shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-moss-green text-white p-6 rounded-t-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <div>
              <h2 className="font-sf-pro font-semibold text-2xl">
                AI'ın Tavsiyesi
              </h2>
              <p className="font-inter text-sm opacity-90">
                Sizin için özel olarak oluşturuldu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 border-4 border-soft-mint border-t-moss-green rounded-full animate-spin mx-auto mb-4" />
            <p className="font-inter text-base text-dark-slate">
              AI rotanızı oluşturuyor...
            </p>
          </div>
        )}

        {/* Content */}
        {!isLoading && aiRecommendation && (
          <div className="p-6 space-y-6">
            
            {/* Title & Description */}
            <div className="space-y-3">
              <h3 className="font-sf-pro font-semibold text-2xl text-dark-slate">
                {aiRecommendation.title}
              </h3>
              <p className="font-inter text-base text-dark-slate leading-relaxed">
                {aiRecommendation.description}
              </p>
            </div>

            {/* Why This Route */}
            <div className="bg-sky-light bg-opacity-20 p-4 rounded-button border border-sky-light">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-ocean-blue mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-inter font-medium text-sm text-dark-slate mb-1">
                    Neden Bu Rota?
                  </p>
                  <p className="font-inter text-sm text-dark-slate opacity-75">
                    {aiRecommendation.whyThisRoute}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Duration */}
            {aiRecommendation.totalDuration && (
              <div className="flex items-center gap-2 text-dark-slate">
                <Clock className="w-5 h-5 text-moss-green" />
                <span className="font-inter font-medium text-base">
                  Tahmini Süre: {aiRecommendation.totalDuration}
                </span>
              </div>
            )}

            {/* Route Stops */}
            <div className="space-y-4">
              <h4 className="font-sf-pro font-semibold text-xl text-dark-slate">
                🗺️ Rota Durakları
              </h4>
              
              {aiRecommendation.stops?.map((stop, index) => (
                <div key={index} className="flex gap-4">
                  {/* Stop Number */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-coral-accent rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {stop.order}
                    </div>
                    {index < aiRecommendation.stops.length - 1 && (
                      <div className="w-0.5 h-full bg-soft-mint mt-2" />
                    )}
                  </div>

                  {/* Stop Info */}
                  <div className="bg-sand-beige p-4 rounded-card flex-1 mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-sf-pro font-semibold text-lg text-dark-slate">
                        {stop.placeName}
                      </h5>
                      {stop.duration && (
                        <span className="font-inter text-xs text-dark-slate opacity-75 bg-white px-2 py-1 rounded-full">
                          ⏱️ {stop.duration}
                        </span>
                      )}
                    </div>
                    
                    <span className="inline-block px-2 py-1 bg-soft-mint text-moss-green font-inter text-xs rounded-full mb-2">
                      {stop.category}
                    </span>
                    
                    <p className="font-inter text-sm text-dark-slate mb-2">
                      {stop.description}
                    </p>
                    
                    {stop.tip && (
                      <div className="bg-white p-3 rounded-button border border-soft-mint mt-2">
                        <p className="font-inter text-xs text-dark-slate">
                          💡 <strong>İpucu:</strong> {stop.tip}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Best Time to Visit */}
            {aiRecommendation.bestTimeToVisit && (
              <div className="bg-soft-mint p-4 rounded-card">
                <p className="font-inter font-medium text-sm text-dark-slate mb-1">
                  🕐 En İyi Ziyaret Zamanı
                </p>
                <p className="font-inter text-sm text-dark-slate opacity-75">
                  {aiRecommendation.bestTimeToVisit}
                </p>
              </div>
            )}

            {/* General Tips */}
            {aiRecommendation.generalTips && aiRecommendation.generalTips.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-sf-pro font-semibold text-lg text-dark-slate">
                  💡 Genel İpuçları
                </h4>
                <ul className="space-y-2">
                  {aiRecommendation.generalTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-moss-green mt-1">✓</span>
                      <span className="font-inter text-sm text-dark-slate">
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-4">
              <Button variant="primary" onClick={onClose} fullWidth>
                Anladım
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;