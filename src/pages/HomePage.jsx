import React from 'react';
import Layout from '../components/common/Layout';
import HeroSection from '../components/home/HeroSection';
import LocationInput from '../components/home/LocationInput';

export default function HomePage({ onLocationSubmit }) {
  const handleLocationSubmit = (data) => {
    console.log('Konum Bilgileri:', data);
    onLocationSubmit(data);
  };

  return (
    <Layout>
      <div className="space-y-section-lg">
      
        <HeroSection />
        
       
        <div className="flex justify-center">
          <LocationInput onSubmit={handleLocationSubmit} />
        </div>

        
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-sf-pro font-semibold text-2xl text-dark-slate">
            Nasıl Çalışır?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-card shadow-soft">
              <div className="w-12 h-12 bg-moss-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold text-xl">1</span>
              </div>
              <h3 className="font-inter font-semibold text-lg text-dark-slate mb-2">
                Konum Belirle
              </h3>
              <p className="font-inter text-sm text-dark-slate">
                Şehir, ilçe ve gezi mesafenizi girin
              </p>
            </div>

            <div className="bg-white p-6 rounded-card shadow-soft">
              <div className="w-12 h-12 bg-ocean-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold text-xl">2</span>
              </div>
              <h3 className="font-inter font-semibold text-lg text-dark-slate mb-2">
                Tercihlerini Seç
              </h3>
              <p className="font-inter text-sm text-dark-slate">
                İlginizi çeken kategorileri belirleyin
              </p>
            </div>

            <div className="bg-white p-6 rounded-card shadow-soft">
              <div className="w-12 h-12 bg-coral-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold text-xl">3</span>
              </div>
              <h3 className="font-inter font-semibold text-lg text-dark-slate mb-2">
                Rotanı Al
              </h3>
              <p className="font-inter text-sm text-dark-slate">
                AI destekli özel rotanızı keşfedin
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

