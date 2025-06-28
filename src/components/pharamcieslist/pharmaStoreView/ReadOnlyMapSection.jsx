import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Expand } from 'lucide-react';
import PortalModal from '../../PortalModal';

mapboxgl.accessToken = 'pk.eyJ1Ijoib21hcm9rc3RhciIsImEiOiJjbDYweWZnN2kxZDh2M2dvYWtsdWZmaXpkIn0.BgrSg2_-EDey-NBxWRKeTA';

const ReadOnlyMapSection = ({ latLng, showMapModal, setShowMapModal }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapContainer = useRef(null);
  const modalMapRef = useRef(null);
  const modalMapContainer = useRef(null);
  const modalMarkerRef = useRef(null);

  // Initialize main map
  useEffect(() => {
    if (!mapRef.current && mapContainer.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [latLng.lng, latLng.lat],
        zoom: 13,
        interactive: true, // Allow zooming and panning
      });

      markerRef.current = new mapboxgl.Marker({ draggable: false })
        .setLngLat([latLng.lng, latLng.lat])
        .addTo(mapRef.current);

      // Disable click interactions for editing
      mapRef.current.on('click', (e) => e.preventDefault());
    }

    return () => {
      mapRef.current?.remove();
    };
  }, [latLng]);

  // Initialize modal map
  useEffect(() => {
    if (!showMapModal) return;

    const initMap = () => {
      if (modalMapContainer.current && modalMapContainer.current.offsetWidth > 0) {
        modalMapRef.current = new mapboxgl.Map({
          container: modalMapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [latLng.lng, latLng.lat],
          zoom: 13,
          interactive: true, // Allow zooming and panning
        });

        modalMarkerRef.current = new mapboxgl.Marker({ draggable: false })
          .setLngLat([latLng.lng, latLng.lat])
          .addTo(modalMapRef.current);

        modalMapRef.current.on('click', (e) => e.preventDefault());
        modalMapRef.current.resize();
      } else {
        setTimeout(initMap, 100);
      }
    };

    initMap();

    return () => {
      modalMapRef.current?.remove();
    };
  }, [showMapModal, latLng]);

  return (
    <div className="w-full flex flex-col gap-2 h-full">
      <div className="relative h-[400px] border rounded overflow-hidden">
        <div ref={mapContainer} className="w-full h-full" />
        <button
          onClick={() => setShowMapModal(true)}
          className="absolute top-2 right-2 bg-white p-1 rounded shadow z-50"
        >
          <Expand className="w-4 h-4" />
        </button>
      </div>

      {showMapModal && (
        <PortalModal>
          <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[99999]">
            <div className="bg-white p-4 rounded-lg w-[60vw] h-[80vh] relative shadow-lg">
              <div ref={modalMapContainer} className="w-full h-full rounded-lg" />
              <div className="text-right mt-4">
                <button
                  onClick={() => setShowMapModal(false)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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

export default ReadOnlyMapSection;