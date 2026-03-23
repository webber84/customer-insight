
import React, { useState } from 'react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackText: string;
  size?: number;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, alt, className, fallbackText 
}) => {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className={`${className} bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden`}>
        <span className="font-bold text-lg">{fallbackText.substring(0, 1).toUpperCase()}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};
