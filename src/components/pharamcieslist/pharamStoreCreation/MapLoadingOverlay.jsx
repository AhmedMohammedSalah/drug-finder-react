import React from 'react';

const MapLoadingOverlay = () => (
  <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center rounded-2xl">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default MapLoadingOverlay;
