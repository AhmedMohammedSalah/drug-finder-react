import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { MapPin } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoib21hcm9rc3RhciIsImEiOiJjbDYweWZnN2kxZDh2M2dvYWtsdWZmaXpkIn0.BgrSg2_-EDey-NBxWRKeTA';

const StaticMap = ({ initialLocation, markers = [], zoom = 15 }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [initialLocation.lng, initialLocation.lat],
      zoom: zoom,
      interactive: false,
    });

    map.current.on('load', () => markers.forEach(marker => {
      const el = document.createElement('div');
      ReactDOM.createRoot(el).render(
        <div className="relative">
          <MapPin className="w-6 h-6 text-red-500" />
          {marker.label && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-white text-xs font-semibold rounded shadow whitespace-nowrap">
              {marker.label}
            </div>
          )}
        </div>
      );
      new mapboxgl.Marker(el).setLngLat([marker.position.lng, marker.position.lat]).addTo(map.current);
    }));

    return () => map.current?.remove();
  }, [initialLocation, markers, zoom]);

  return <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />;
};

export default StaticMap;