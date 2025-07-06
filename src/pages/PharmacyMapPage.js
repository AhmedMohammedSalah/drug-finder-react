import React from 'react';
import PharmacyLocator from '../components/client/PharmacyLocator';
import PharmacyLocatorContainer from '../components/client/PharmacyLocator/index';
const PharmacyMapPage = () => {
  return (
    <div className='bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200'>  
    
      <PharmacyLocatorContainer city="minya" />    </div>
  );
};

export default PharmacyMapPage;
