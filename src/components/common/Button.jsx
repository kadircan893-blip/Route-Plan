import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
}) => {
  
  const baseStyles = 'px-6 h-12 rounded-button font-inter font-semibold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-moss-green text-white hover:bg-ocean-blue shadow-soft',
    secondary: 'bg-soft-mint text-dark-slate hover:bg-moss-green hover:text-white',
    outline: 'bg-transparent border border-moss-green text-moss-green hover:bg-moss-green hover:text-white',
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;