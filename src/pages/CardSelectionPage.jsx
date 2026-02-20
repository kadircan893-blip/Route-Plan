import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import CardGrid from '../components/cards/CardGrid';
import { getCardGroups } from '../constants/categories';
import useAppStore from '../store/appStore';

const CardSelectionPage = ({ onCategoriesSubmit }) => {
  const navigate = useNavigate();
  const { locationData } = useAppStore();
  const cardGroups = getCardGroups();

  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);

  const currentGroup = cardGroups[currentGroupIndex];
  const isLastGroup = currentGroupIndex === cardGroups.length - 1;
  const progress = ((currentGroupIndex + 1) / cardGroups.length) * 100;

  const handleCardSelect = (categoryId) => {
    setSelectedCards(prev => {
      if (prev.includes(categoryId)) {
        // Seçimi kaldır
        return prev.filter(id => id !== categoryId);
      } else {
        // Seçim ekle
        return [...prev, categoryId];
      }
    });
  };

  const handleNext = () => {
    if (isLastGroup) {
      console.log('Seçilen Kategoriler:', selectedCards);
      onCategoriesSubmit(selectedCards);
    } else {
      setCurrentGroupIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(prev => prev - 1);
    } else {
      navigate('/');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-sf-pro font-semibold text-3xl md:text-4xl text-dark-slate">
            İlgi Alanlarınızı Seçin
          </h1>
          <p className="font-inter text-base text-dark-slate opacity-75">
            {locationData?.city && locationData?.district 
              ? `${locationData.city}, ${locationData.district} - ${locationData.distance}km yarıçapında`
              : 'Geziniz için ilginizi çeken kategorileri seçin'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-inter text-sm text-dark-slate">
              Grup {currentGroupIndex + 1} / {cardGroups.length}
            </span>
            <span className="font-inter text-sm font-semibold text-moss-green">
              {selectedCards.length} kategori seçildi
            </span>
          </div>
          <div className="w-full h-3 bg-soft-mint rounded-full overflow-hidden">
            <div 
              className="h-full bg-moss-green transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card Grid */}
        <CardGrid
          categories={currentGroup}
          selectedCards={selectedCards}
          onCardSelect={handleCardSelect}
        />

        {/* Info Box */}
        <div className="bg-sky-light bg-opacity-20 p-4 rounded-button border border-sky-light max-w-2xl mx-auto">
          <p className="font-inter text-sm text-dark-slate text-center">
            💡 <strong>İpucu:</strong> Kartların üzerine geldiğinizde ters dönecektir. 
            İstediğiniz kadar kategori seçebilir veya hiç seçmeden geçebilirsiniz.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="min-w-32"
          >
            {currentGroupIndex === 0 ? 'Ana Sayfa' : 'Geri'}
          </Button>
          
          <Button 
            variant="primary" 
            onClick={handleNext}
            className="min-w-32"
          >
            {isLastGroup ? 'Rotayı Oluştur' : 'Sonraki'}
          </Button>
        </div>

        {/* Selected Categories Summary */}
        {selectedCards.length > 0 && (
          <div className="bg-white p-6 rounded-card shadow-soft max-w-3xl mx-auto">
            <h3 className="font-sf-pro font-semibold text-lg text-dark-slate mb-3">
              Seçtiğiniz Kategoriler:
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedCards.map(cardId => {
                const category = cardGroups.flat().find(cat => cat.id === cardId);
                return (
                  <span 
                    key={cardId}
                    className="px-3 py-1 bg-soft-mint text-moss-green font-inter text-sm font-medium rounded-full"
                  >
                    {category?.emoji} {category?.title}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CardSelectionPage;