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
  'Nhà hàng': '#EF4444',     // Đỏ
  'Quán ăn': '#F97316',      // Cam
  'Quán cà phê': '#3B82F6',  // Xanh dương
  'Quán nước': '#06B6D4',    // Xanh lam
  'Quán ăn vặt': '#F59E0B',  // Vàng cam
  'Quán bar': '#8B5CF6',     // Tím
  'Tiệm bánh': '#EC4899',    // Hồng
  default: '#10B981',        // Xanh lá (mặc định)
};

// Map marker icons by category
export const MARKER_ICONS = {
  food: 'restaurant',         // Quán ăn
  drink: 'cafe',              // Quán nước
  snack: 'fast-food',         // Ăn vặt
  specialty: 'nutrition',     // Đặc sản
  atmosphere: 'image',        // Không gian
  default: 'location',        // Mặc định
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