import React from 'react';
import CategoryCard from './CategoryCard';

const CardGrid = ({ categories, selectedCards, onCardSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          isSelected={selectedCards.includes(category.id)}
          onSelect={onCardSelect}
        />
      ))}
    </div>
  );
};

export default CardGrid;