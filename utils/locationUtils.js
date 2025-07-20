/**
 * Location utility functions
 */

// Default location (Ho Chi Minh City)
export const getDefaultLocation = () => ({
  latitude: 10.7769,
  longitude: 106.7009,
});

/**
 * Calculate distance between two coordinates in kilometers
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return 0;
  }
  
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  
  return parseFloat(distance.toFixed(2));
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

/**
 * Convert degrees to radians
 * @param {number} deg - Degrees
 * @returns {number} Radians
 */
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * Open Google Maps with directions from current location to destination
 * @param {Object} destination - Destination coordinates {latitude, longitude}
 * @param {string} destinationName - Name of destination for label
 * @param {Object} startLocation - Optional starting coordinates {latitude, longitude}
 * @param {string} travelMode - Optional travel mode (driving, walking, bicycling, transit)
 * @returns {string} URL to open
 */
import { Linking, Platform } from 'react-native';

export const openMapsWithDirections = (destination, destinationName, startLocation = null, travelMode = 'driving') => {
  if (!destination) return;
  
  const { latitude, longitude } = destination;
  
  // Format destination for URL
  const destinationCoords = `${latitude},${longitude}`;
  
  // Encode the destination name for URL
  const encodedName = encodeURIComponent(destinationName);
  
  // Format starting location if provided
  const startParam = startLocation 
    ? `${startLocation.latitude},${startLocation.longitude}` 
    : 'current+location';
  
  if (Platform.OS === 'ios') {
    // For iOS, try Google Maps first (if installed)
    const googleMapsUrl = `comgooglemaps://?saddr=${startParam}&daddr=${destinationCoords}&q=${encodedName}&directionsmode=${travelMode}`;
    
    Linking.canOpenURL(googleMapsUrl)
      .then(supported => {
        if (supported) {
          // Google Maps is installed, use it
          Linking.openURL(googleMapsUrl);
        } else {
          // Fallback to Apple Maps (doesn't support search term with coordinates as well as Google)
          const appleMapsUrl = `maps://app?saddr=${startParam}&daddr=${destinationCoords}&q=${encodedName}`;
          Linking.openURL(appleMapsUrl).catch(err => {
            // Final fallback to web
            openGoogleMapsWeb(startParam, destinationCoords, destinationName, travelMode);
          });
        }
      })
      .catch(error => {
        // Fallback to web URL
        openGoogleMapsWeb(startParam, destinationCoords, destinationName, travelMode);
      });
  } else {
    // For Android - try using the geo: intent first with label
    const geoUrl = `geo:${latitude},${longitude}?q=${encodedName}`;
    
    // Then try Google Maps app with navigation
    const googleMapsUrl = `google.navigation:q=${destinationCoords}&mode=${travelMode}`;
    
    // Try the geo intent first
    Linking.canOpenURL(geoUrl)
      .then(supported => {
        if (supported) {
          // First try showing the location with name
          Linking.openURL(geoUrl)
            .then(() => {
              // After a short delay, open directions if needed
              if (travelMode !== 'view') {
                setTimeout(() => {
                  Linking.openURL(googleMapsUrl).catch(() => {
                    openGoogleMapsWeb(startParam, destinationCoords, destinationName, travelMode);
                  });
                }, 1000);
              }
            })
            .catch(() => {
              // If showing location fails, try navigation directly
              Linking.openURL(googleMapsUrl).catch(() => {
                openGoogleMapsWeb(startParam, destinationCoords, destinationName, travelMode);
              });
            });
        } else {
          // If geo intent not supported, try Google Maps app directly
          Linking.canOpenURL(googleMapsUrl)
            .then(supported => {
              if (supported) {
                Linking.openURL(googleMapsUrl);
              } else {
                // Final fallback to web
                openGoogleMapsWeb(startParam, destinationCoords, destinationName, travelMode);
              }
            })
            .catch(() => {
              openGoogleMapsWeb(startParam, destinationCoords, destinationName, travelMode);
            });
        }
      })
      .catch(error => {
        openGoogleMapsWeb(startParam, destinationCoords, destinationName, travelMode);
      });
  }
};

/**
 * Open Google Maps in web browser with directions
 */
const openGoogleMapsWeb = (startParam, destinationCoords, destinationName, travelMode) => {
  // For web URL, we include both the coordinates and the search term
  const encodedName = encodeURIComponent(destinationName);
  
  // Combine coordinates with name for more accurate results
  const destinationParam = `${destinationCoords}`;
  
  const url = `https://www.google.com/maps/dir/?api=1&origin=${startParam}&destination=${destinationParam}&destination_place_id=&travelmode=${travelMode}&query=${encodedName}`;
  
  Linking.openURL(url);
}; 