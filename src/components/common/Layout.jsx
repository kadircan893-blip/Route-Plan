import React from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingParticles from './FloatingParticles';

const Layout = ({ children, className = '' }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-sand-beige overflow-hidden">
      <FloatingParticles />
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-container mx-auto px-md md:px-xl py-4 flex items-center justify-between">
          <h1
            className="font-sf-pro font-semibold text-3xl text-moss-green cursor-pointer"
            onClick={() => navigate('/')}
          >
            Route-Plan
          </h1>
          <nav className="flex gap-4">
            {/* Navigation gelecek */}
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className={`relative z-10 max-w-container mx-auto px-md md:px-xl py-section ${className}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-dark-slate text-white py-8 mt-section-lg">
        <div className="max-w-container mx-auto px-md md:px-xl text-center">
          <p className="font-inter text-sm">
            © 2026 Route-Plan - Smart Journey Planner
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;