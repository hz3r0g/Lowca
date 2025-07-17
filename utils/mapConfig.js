/**
 * Map configuration options
 */

// Default map region (Ho Chi Minh City)
export const DEFAULT_REGION = {
  latitude: 10.7769,
  longitude: 106.7009,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

// Map types
export const MAP_TYPES = {
  STANDARD: 'standard',
  SATELLITE: 'satellite',
  HYBRID: 'hybrid',
};

// Map marker colors by type
export const MARKER_COLORS = {
  Cafe: '#3B82F6',       // Blue
  Restaurant: '#EF4444', // Red
  'Fast Food': '#F59E0B', // Orange
  Bar: '#8B5CF6',        // Purple
  Bakery: '#EC4899',     // Pink
  default: '#10B981',    // Green (default)
};

// Map marker icons by type
export const MARKER_ICONS = {
  Cafe: 'cafe',
  Restaurant: 'restaurant',
  'Fast Food': 'fast-food',
  Bar: 'beer',
  Bakery: 'pizza',
  default: 'restaurant',
};

// Custom map style to hide default POIs and only show roads
export const MAP_STYLE = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]; 