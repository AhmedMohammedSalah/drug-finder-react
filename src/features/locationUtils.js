/**
 *  [OKS] Location Utilities - Reusable geolocation functions
 */

/**
 * [OKS] Calculates distance between two coordinates in kilometers (Haversine formula)
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * [OKS]  Gets user's current location with error handling
 * @returns {Promise<{lat: number, lng: number}>} User's coordinates
 * @throws {Error} When geolocation is not available or permission denied
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        let errorMessage;
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for geolocation";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get location timed out";
            break;
          default:
            errorMessage = "An unknown error occurred";
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

/**
 * [OKS] calculate map position for markers relative to center
 * @param {Object} location - {lat, lng} of the point
 * @param {Object} center - {lat, lng} of map center
 * @param {number} zoomFactor - Adjusts spread of markers
 * @returns {{left: number, top: number}} CSS percentages for positioning
 */
export const calculateMarkerPosition = (location, center, zoomFactor = 5000) => {
  const lngDiff = location.lng - center.lng;
  const latDiff = location.lat - center.lat;
  return {
    left: 50 + (lngDiff * zoomFactor),
    top: 50 - (latDiff * zoomFactor)
  };
};

/**
 * [OKS] generates google maps directions URL
 * @param {Object} from - {lat, lng} of starting point
 * @param {Object} to - {lat, lng} of destination
 * @returns {string} Google Maps directions URL
 */
export const getDirectionsUrl = (from, to) => {
  return `https://www.google.com/maps/dir/${from.lat},${from.lng}/${to.lat},${to.lng}`;
};

// [OKS] Default Minya coordinates for fallback
export const DEFAULT_LOCATION = {
    lat: 28.1041,
    lng: 30.5559,
};

//// [OKS] format distance function
export const formatDistance = (km) => {
  return km >= 1 ? `${km.toFixed(1)} km` : `${Math.round(km * 1000)} m`;
};
