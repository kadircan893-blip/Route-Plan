import React from 'react';

const Card = ({ 
  children, 
  className = '',
  padding = 'md',
  hover = false,
  onClick,
}) => {
  
  const paddingStyles = {
    sm: 'p-md',
    md: 'p-5',
    lg: 'p-6',
  };
  
  const baseStyles = 'bg-white rounded-card shadow-card transition-all duration-200';
  const hoverStyles = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
  
  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${paddingStyles[padding]} ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;