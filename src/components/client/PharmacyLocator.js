// src/components/PharmacyLocator.jsx
import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 30.033333, // Default: Cairo
  lng: 31.233334,
};

const PharmacyLocator = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const mapRef = useRef(null);

  // Get user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        alert('Allow location to find nearby pharmacies');
        setCurrentPosition(defaultCenter);
      }
    );
  }, []);

  // Find nearby pharmacies once position is set
  const onLoad = (map) => {
    mapRef.current = map;

    if (!currentPosition) return;

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: currentPosition,
      radius: 3000,
      type: ['pharmacy'],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPharmacies(results);
      }
    });
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY" libraries={['places']}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Nearby Pharmacies</h2>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={currentPosition || defaultCenter}
          zoom={14}
          onLoad={onLoad}
        >
          {currentPosition && (
            <Marker position={currentPosition} label="You" />
          )}
          {pharmacies.map((place, idx) => (
            <Marker
              key={idx}
              position={{
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              }}
              title={place.name}
              label="P"
            />
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default PharmacyLocator;
