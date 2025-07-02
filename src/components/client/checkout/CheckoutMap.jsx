import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoib21hcm9rc3RhciIsImEiOiJjbDYweWZnN2kxZDh2M2dvYWtsdWZmaXpkIn0.BgrSg2_-EDey-NBxWRKeTA';
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const CheckoutMap = ({ initialLocation, onLocationSelect, onClose }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: initialLocation ? [initialLocation.lng, initialLocation.lat] : [0, 0],
        zoom: initialLocation ? 15 : 1
      });

      map.current.on('load', () => {
        if (initialLocation) {
          addMarker(initialLocation.lng, initialLocation.lat);
        }

        map.current.on('click', (e) => {
          const { lng, lat } = e.lngLat;
          setSelectedLocation({ lng, lat });
          addMarker(lng, lat);
        });
      });
    }
  }, [initialLocation]);

  const addMarker = (lng, lat) => {
    if (marker.current) {
      marker.current.remove();
    }

    marker.current = new mapboxgl.Marker({ color: '#3B82F6' })
      .setLngLat([lng, lat])
      .addTo(map.current);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation.lat, selectedLocation.lng);
    }
  };

  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="w-full h-96 md:h-[500px] rounded-lg" />
      
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={!selectedLocation}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
};

export default CheckoutMap;