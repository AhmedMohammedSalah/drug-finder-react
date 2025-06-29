import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PharmaCapsuleLoader from '../../PharmaCapsuleLoader';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoib21hcm9rc3RhciIsImEiOiJjbDYweWZnN2kxZDh2M2dvYWtsdWZmaXpkIn0.BgrSg2_-EDey-NBxWRKeTA';
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const PharmacyMap = ({ 
  mapCenter, 
  userLocation, 
  pharmacies, 
  selectedPharmacy, 
  onMapLoaded,
  onMarkerClick
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    if (!map.current && mapCenter && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [mapCenter.lng, mapCenter.lat],
        zoom: 15
      });

      map.current.on('load', () => {
        onMapLoaded(true);

        if (userLocation) {
          new mapboxgl.Marker({ color: '#4285F4', scale: 0.8 })
            .setLngLat([userLocation.lng, userLocation.lat])
            .setPopup(new mapboxgl.Popup().setHTML('<h3>Your Location</h3>'))
            .addTo(map.current);
        }
      });
    }
  }, [mapCenter, userLocation, onMapLoaded]);

  useEffect(() => {
    if (!map.current) return;

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    pharmacies.forEach(pharmacy => {
      const markerEl = document.createElement('div');
      markerEl.className = 'pharmacy-marker';
      markerEl.style.backgroundImage = `url(${pharmacy.store_logo_url})`;
      markerEl.style.backgroundSize = 'cover';
      markerEl.style.width = '40px';
      markerEl.style.height = '40px';
      markerEl.style.borderRadius = '50%';
      markerEl.style.border = '2px solid white';
      markerEl.style.cursor = 'pointer';
      markerEl.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

      if (selectedPharmacy?.store_id === pharmacy.store_id) {
        markerEl.style.border = '3px solid #10B981';
        markerEl.style.transform = 'scale(1.2)';
      }

      // [OKS] Custom popup HTML
     const popupContent = `
  <div style="min-width: 220px; font-family: 'Segoe UI', sans-serif;">
    <div style="display: flex; gap: 12px; margin-bottom: 8px;">
      <img src="${pharmacy.store_logo_url || 'https://via.placeholder.com/60'}" 
           style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover; border: 1px solid #e5e7eb;"
           alt="${pharmacy.store_name}">
      <div>
        <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #111827;">
          ${pharmacy.store_name}
        </h3>
        <div style="display: flex; align-items: center; margin-bottom: 6px;">
        
       
    </div>

    <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="#6b7280" style="margin-right: 8px; flex-shrink: 0;">
        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
      </svg>
      <div>
        <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.4;">
          ${pharmacy.address}<br>
        </p>
      </div>
    </div>

      </div>
    </div>

    <button 
      onclick="window.location.href='tel:${pharmacy.phone}'"
      style="
        width: 100%;
        padding: 8px 12px; 
        background-color: #10b981;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: background-color 0.2s;
      "
      onmouseover="this.style.backgroundColor='#059669'"
      onmouseout="this.style.backgroundColor='#10b981'"
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
      </svg>
      Call
    </button>
  </div>
`;

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(popupContent);

      const marker = new mapboxgl.Marker({ element: markerEl, anchor: 'bottom' })
        .setLngLat([pharmacy.location.lng, pharmacy.location.lat])
        .setPopup(popup);

      markerEl.addEventListener('click', () => onMarkerClick(pharmacy));

      marker.addTo(map.current);
      markers.current.push(marker);
    });

    if (selectedPharmacy) {
      map.current.flyTo({
        center: [selectedPharmacy.location.lng, selectedPharmacy.location.lat],
        zoom: 17,
        essential: true
      });
    }
  }, [pharmacies, selectedPharmacy]);

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden h-[400px] md:h-[500px]">
        <div ref={mapContainer} className="w-full h-full" />
        {!mapCenter && (
          <div className="min-h-screen bg-white">
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <PharmaCapsuleLoader />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyMap;
