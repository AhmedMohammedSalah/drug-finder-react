import React from 'react';
import PharmacyLocator from '../components/client/PharmacyLocator';

const PharmacyMapPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Nearest Pharmacies</h1>
      <p className="text-gray-600 mb-6">Use the map below to locate pharmacies near you.</p>
      
<PharmacyLocator city="minya" />    </div>
  );
};

export default PharmacyMapPage;
