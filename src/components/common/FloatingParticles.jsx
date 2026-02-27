import React from 'react';

const PARTICLES = [
  { top: '8%',  left: '5%',  size: 80,  color: '#DFF2EA', duration: 14, delay: 0,   opacity: 0.45, blur: 30 },
  { top: '20%', left: '85%', size: 60,  color: '#A8DADC', duration: 18, delay: 2,   opacity: 0.35, blur: 25 },
  { top: '45%', left: '12%', size: 100, color: '#DFF2EA', duration: 22, delay: 4,   opacity: 0.30, blur: 40 },
  { top: '70%', left: '75%', size: 70,  color: '#5B7C6A', duration: 16, delay: 1,   opacity: 0.20, blur: 35 },
  { top: '85%', left: '30%', size: 90,  color: '#A8DADC', duration: 20, delay: 3,   opacity: 0.40, blur: 30 },
  { top: '15%', left: '50%', size: 50,  color: '#DFF2EA', duration: 13, delay: 6,   opacity: 0.50, blur: 20 },
  { top: '55%', left: '90%', size: 75,  color: '#A8DADC', duration: 19, delay: 0.5, opacity: 0.30, blur: 35 },
  { top: '35%', left: '40%', size: 55,  color: '#5B7C6A', duration: 15, delay: 5,   opacity: 0.15, blur: 45 },
  { top: '90%', left: '60%', size: 65,  color: '#DFF2EA', duration: 17, delay: 2.5, opacity: 0.40, blur: 28 },
  { top: '60%', left: '20%', size: 85,  color: '#A8DADC', duration: 21, delay: 7,   opacity: 0.25, blur: 40 },
  { top: '5%',  left: '70%', size: 45,  color: '#DFF2EA', duration: 12, delay: 3.5, opacity: 0.45, blur: 22 },
  { top: '75%', left: '45%', size: 110, color: '#5B7C6A', duration: 23, delay: 1.5, opacity: 0.15, blur: 50 },
];

const FloatingParticles = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: p.color,
            opacity: p.opacity,
            filter: `blur(${p.blur}px)`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
