import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Crosshair, Expand } from 'lucide-react';
import PortalModal from '../../PortalModal'; // adjust path if needed


mapboxgl.accessToken = 'pk.eyJ1Ijoib21hcm9rc3RhciIsImEiOiJjbDYweWZnN2kxZDh2M2dvYWtsdWZmaXpkIn0.BgrSg2_-EDey-NBxWRKeTA';

const MapSection = ({
  latLng,
  setLatLng,
  handleLatChange,
  handleLngChange,
  showMapModal,
  setShowMapModal
}) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapContainer = useRef(null);

  const modalMapRef = useRef(null);
  const modalMapContainer = useRef(null);
  const modalMarkerRef = useRef(null);

  const [isGettingLocation, setIsGettingLocation] = useState(false); // NEW

  // INITIAL MAP LOAD
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [latLng.lng, latLng.lat],
      zoom: 13
    });

    markerRef.current = new mapboxgl.Marker()
      .setLngLat([latLng.lng, latLng.lat])
      .addTo(mapRef.current);

    mapRef.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      setLatLng({ lat, lng });
    });
  }, []);

  // UPDATE MARKER ON latLng CHANGE
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([latLng.lng, latLng.lat]);
      mapRef.current?.flyTo({ center: [latLng.lng, latLng.lat], zoom: 13 });
    }
  }, [latLng]);

  // GET CURRENT LOCATION
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLatLng({ lat: latitude, lng: longitude });
        setIsGettingLocation(false);
      },
      () => {
        alert('Could not get location.');
        setIsGettingLocation(false);
      }
    );
  };

  // MODAL MAP
  useEffect(() => {
    if (!showMapModal) return;
  
    const initMap = () => {
      if (modalMapContainer.current && modalMapContainer.current.offsetWidth > 0) {
        modalMapRef.current = new mapboxgl.Map({
          container: modalMapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [latLng.lng, latLng.lat],
          zoom: 13
        });
  
        modalMarkerRef.current = new mapboxgl.Marker()
          .setLngLat([latLng.lng, latLng.lat])
          .addTo(modalMapRef.current);
  
        modalMapRef.current.on('click', (e) => {
          const { lng, lat } = e.lngLat;
          setLatLng({ lat, lng });
        });
  
        // force resize
        modalMapRef.current.resize();
      } else {
        // Try again after a short delay
        setTimeout(initMap, 100);
      }
    };
  
    initMap();
  
    return () => modalMapRef.current?.remove();
  }, [showMapModal]);
  
  

  useEffect(() => {
    if (showMapModal && modalMarkerRef.current && modalMapRef.current) {
      modalMarkerRef.current.setLngLat([latLng.lng, latLng.lat]);
      modalMapRef.current.flyTo({ center: [latLng.lng, latLng.lat], zoom: 13 });
    }
  }, [latLng, showMapModal]);

  return (
    <div className="w-full lg:w-1/2 flex flex-col gap-2 z-0">
      {/* MAIN MAP */}
      <div className="relative h-[400px] border rounded overflow-hidden">
        <div ref={mapContainer} className="w-full h-full" />

        {/* GET LOCATION BUTTON */}
        <button
          onClick={getCurrentLocation}
          className="absolute bottom-2 left-2 bg-white p-1 rounded shadow z-50 flex items-center justify-center w-8 h-8"
          disabled={isGettingLocation}
        >
          {isGettingLocation ? (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Crosshair className="w-4 h-4" />
          )}
        </button>

        {/* EXPAND BUTTON */}
        <button
          onClick={() => setShowMapModal(true)}
          className="absolute top-2 right-2 bg-white p-1 rounded shadow z-50"
        >
          <Expand className="w-4 h-4" />
        </button>
      </div>

      {/* COORDINATES INPUT */}
      <div className="flex gap-2">
        <input
          type="number"
          value={latLng.lat}
          onChange={handleLatChange}
          className="w-1/2 p-2 border rounded"
          placeholder="Latitude"
        />
        <input
          type="number"
          value={latLng.lng}
          onChange={handleLngChange}
          className="w-1/2 p-2 border rounded"
          placeholder="Longitude"
        />
      </div>

      {/* MODAL */}
      {showMapModal && (
  <PortalModal>
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[99999]">
      <div className="bg-white p-4 rounded-lg w-[60vw] h-[80vh] relative shadow-lg">
        <div
          ref={modalMapContainer}
          className="w-full h-full rounded-lg"
        />
        <div className="text-right mt-4">
          <button
            onClick={() => setShowMapModal(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </PortalModal>
)}


    </div>
  );
};

export default MapSection;
