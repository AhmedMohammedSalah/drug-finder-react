// src/components/shared/LoadingOverlay.jsx
import React, { useEffect } from 'react';

const LoadingOverlay = () => {
  // OPTIONAL: disable scrolling when loading is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm pointer-events-none" />

      {/* Spinner */}
      <div className="relative z-10">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default LoadingOverlay;
