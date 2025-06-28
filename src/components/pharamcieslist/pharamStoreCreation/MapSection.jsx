// 📦 components/pharamcieslist/pharamStoreCreation/MapSection.jsx
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Crosshair, Expand } from 'lucide-react';
import PortalModal from '../../PortalModal';

mapboxgl.accessToken = 'pk.eyJ1Ijoib21hcm9rc3RhciIsImEiOiJjbDYweWZnN2kxZDh2M2dvYWtsdWZmaXpkIn0.BgrSg2_-EDey-NBxWRKeTA';

const MapSection = ({
  latLng,
  setLatLng,
  handleLatChange,
  handleLngChange,
  showMapModal,
  setShowMapModal,
  canEdit,
}) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapContainer = useRef(null);

  const modalMapRef = useRef(null);
  const modalMapContainer = useRef(null);
  const modalMarkerRef = useRef(null);

  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // INITIAL MAP
  useEffect(() => {
    if (!mapRef.current && mapContainer.current) {
      // INIT MAP
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [latLng.lng, latLng.lat],
        zoom: 13,
      });
  
      markerRef.current = new mapboxgl.Marker()
        .setLngLat([latLng.lng, latLng.lat])
        .addTo(mapRef.current);
    }
  
    // HANDLE EDIT MODE: dynamically add/remove click handler
    let clickHandler;
  
    if (mapRef.current) {
      if (canEdit) {
        clickHandler = (e) => {
          const { lng, lat } = e.lngLat;
          setLatLng({ lat, lng });
        };
        mapRef.current.on('click', clickHandler);
      } else {
        // Remove any existing click handler if present
        mapRef.current.off('click', clickHandler);
      }
    }
  
    return () => {
      if (clickHandler && mapRef.current) {
        mapRef.current.off('click', clickHandler);
      }
    };
  }, [canEdit, latLng.lat, latLng.lng]);
  

  // UPDATE MARKER POSITION
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([latLng.lng, latLng.lat]);
      mapRef.current?.flyTo({ center: [latLng.lng, latLng.lat], zoom: 13 });
    }
  }, [latLng]);

  // GET CURRENT LOCATION (only if requested)
  const getCurrentLocation = () => {
    if (!canEdit) return;

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

    let clickHandler;

    const initMap = () => {
      if (modalMapContainer.current && modalMapContainer.current.offsetWidth > 0) {
        modalMapRef.current = new mapboxgl.Map({
          container: modalMapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [latLng.lng, latLng.lat],
          zoom: 13,
        });

        modalMarkerRef.current = new mapboxgl.Marker()
          .setLngLat([latLng.lng, latLng.lat])
          .addTo(modalMapRef.current);

        if (canEdit) {
          clickHandler = (e) => {
            const { lng, lat } = e.lngLat;
            setLatLng({ lat, lng });
          };
          modalMapRef.current.on('click', clickHandler);
        }

        modalMapRef.current.resize();
      } else {
        setTimeout(initMap, 100);
      }
    };

    initMap();

    return () => {
      if (clickHandler) modalMapRef.current?.off('click', clickHandler);
      modalMapRef.current?.remove();
    };
  }, [showMapModal, canEdit]);

  useEffect(() => {
    if (showMapModal && modalMarkerRef.current && modalMapRef.current) {
      modalMarkerRef.current.setLngLat([latLng.lng, latLng.lat]);
      modalMapRef.current.flyTo({ center: [latLng.lng, latLng.lat], zoom: 13 });
    }
  }, [latLng, showMapModal]);

  return (
    <div className="w-full flex flex-col gap-2 z-0 h-full">
      {/* MAIN MAP DISPLAY */}
      <div className="relative h-[400px] border rounded overflow-hidden">
        <div ref={mapContainer} className="w-full h-full" />

        {canEdit && (
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
        )}

        <button
          onClick={() => setShowMapModal(true)}
          className="absolute top-2 right-2 bg-white p-1 rounded shadow z-50"
        >
          <Expand className="w-4 h-4" />
        </button>
      </div>

      {/* HIDE COORDINATES INPUTS IF NOT IN EDIT MODE */}
      {canEdit && (
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
      )}

      {/* MODAL FULLSCREEN MAP */}
      {showMapModal && (
        <PortalModal>
          <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[99999]">
            <div className="bg-white p-4 rounded-lg w-[60vw] h-[80vh] relative shadow-lg">
              <div ref={modalMapContainer} className="w-full h-full rounded-lg" />
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
