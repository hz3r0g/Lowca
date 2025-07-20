import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import MapFallback from './MapFallback';
import RestaurantModal from './RestaurantModal';
import { DEFAULT_REGION, MAP_TYPES, MARKER_COLORS, MARKER_ICONS, MAP_STYLE } from '../utils/mapConfig';

// Import ClusteredMapView with error handling
let ClusteredMapView;
try {
  ClusteredMapView = require('react-native-maps-super-cluster').default;
} catch (error) {
  console.log('Error importing ClusteredMapView:', error);
  // Fallback to regular MapView if ClusteredMapView fails to import
  ClusteredMapView = MapView;
}

const { width, height } = Dimensions.get('window');

const AnimatedMarker = ({ 
  item, 
  isSelected, 
  onPress, 
  markerColor, 
  markerIcon, 
  tracksViewChanges 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (isSelected) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.4,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelected]);
  
  return (
    <Marker
      coordinate={item.coordinates}
      onPress={onPress}
      tracksViewChanges={tracksViewChanges}
      anchor={{x: 0.5, y: 1}}
    >
      <Animated.View 
        style={[
          styles.markerContainer, 
          { 
            backgroundColor: markerColor,
            transform: [{ scale: scaleAnim }],
            zIndex: isSelected ? 999 : 1,
            borderWidth: isSelected ? 3 : 2,
            padding: 2,
          }
        ]}
      >
        <Ionicons name={markerIcon} size={isSelected ? 18 : 16} color="white" />
      </Animated.View>
      
      {isSelected && (
        <Callout tooltip>
          <View style={styles.calloutContainer}>
            <Text style={styles.calloutTitle}>{item.name}</Text>
            <Text style={styles.calloutSubtitle}>{item.type}</Text>
          </View>
        </Callout>
      )}
    </Marker>
  );
};

// Render cluster marker
const renderCluster = (cluster, onPress) => {
  const { pointCount, coordinate, clusterId } = cluster;
  const clusterSize = Math.min(pointCount, 50);  // Cap at 50 for size calculation
  const size = 30 + (clusterSize / 50) * 20;  // Size between 30-50 based on count
  
  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View style={[styles.clusterContainer, { width: size, height: size }]}>
        <Text style={styles.clusterText}>{pointCount}</Text>
      </View>
    </Marker>
  );
};

const MapViewContainer = ({ 
  userLocation, 
  locationPermission, 
  filteredResults, 
  onRestaurantPress,
  onMapError
}) => {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapType, setMapType] = useState(MAP_TYPES.STANDARD);
  const [mapError, setMapError] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [region, setRegion] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [markerTracksViewChanges, setMarkerTracksViewChanges] = useState(true);
  const [useClusteredMap, setUseClusteredMap] = useState(true);

  // Try to use clustered map, fall back to regular map if it fails
  useEffect(() => {
    try {
      // Check if ClusteredMapView is actually MapView (fallback)
      if (ClusteredMapView === MapView) {
        setUseClusteredMap(false);
      }
    } catch (error) {
      console.log('Error checking ClusteredMapView:', error);
      setUseClusteredMap(false);
    }
  }, []);

  // Reset error state after 5 seconds when retry is triggered
  useEffect(() => {
    if (mapError) {
      const timer = setTimeout(() => {
        setMapLoading(true);
        setMapError(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mapError]);

  // Khi filteredResults thay đổi, bật tracksViewChanges=true trong 600ms đầu
  useEffect(() => {
    setMarkerTracksViewChanges(true);
    const timer = setTimeout(() => {
      setMarkerTracksViewChanges(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [filteredResults]);

  const toggleMapType = () => {
    setMapType(mapType === MAP_TYPES.STANDARD ? MAP_TYPES.SATELLITE : MAP_TYPES.STANDARD);
  };

  const handleMapError = () => {
    setMapError(true);
    setMapLoading(false);
    if (onMapError) {
      onMapError();
    }
  };

  const handleRetry = () => {
    setMapError(false);
    setMapLoading(true);
    // Force re-render of the map
    setMapReady(false);
  };

  // Helper to get real map ref (for ClusteredMapView or MapView)
  const getRealMapRef = () => {
    if (mapRef.current && typeof mapRef.current.getMapRef === 'function') {
      return mapRef.current.getMapRef();
    }
    return mapRef.current;
  };

  const goToUserLocation = () => {
    const realMapRef = getRealMapRef();
    if (realMapRef && userLocation && typeof realMapRef.animateToRegion === 'function') {
      realMapRef.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
  };

  // Function to get marker icon based on restaurant type
  const getMarkerIcon = (restaurant) => {
    return MARKER_ICONS[restaurant.mainCategory] || MARKER_ICONS.default;
  };

  // Function to get marker color based on restaurant type
  const getMarkerColor = (restaurant) => {
    return MARKER_COLORS[restaurant.mainCategory] || MARKER_COLORS.default;
  };

  // Function to handle marker press
  const handleMarkerPress = (item) => {
    setSelectedMarkerId(item.id);
    setSelectedRestaurant(item);
    setModalVisible(true);
    
    // Center the map on the selected marker
    const realMapRef = getRealMapRef();
    if (realMapRef && typeof realMapRef.animateToRegion === 'function') {
      realMapRef.animateToRegion({
        latitude: item.coordinates.latitude,
        longitude: item.coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedMarkerId(null);
  };

  // Function to handle view details button press
  const handleViewDetails = (id) => {
    setModalVisible(false);
    setSelectedMarkerId(null);
    onRestaurantPress(id);
  };

  // Đặt renderMarker vào trong component để truy cập được state
  const renderMarker = (data) => {
    const item = data.item || data;
    return (
      <AnimatedMarker
        key={`${item.id}-${item.coordinates.latitude}-${item.coordinates.longitude}`}
        item={item}
        isSelected={selectedMarkerId === item.id}
        onPress={() => handleMarkerPress(item)}
        markerColor={getMarkerColor(item)}
        markerIcon={getMarkerIcon(item)}
        tracksViewChanges={markerTracksViewChanges}
      />
    );
  };

  // Force update markers when map is ready or region changes
  useEffect(() => {
    if ((mapReady && useClusteredMap) || region) {
      setMarkerTracksViewChanges(true);
      const timer = setTimeout(() => {
        setMarkerTracksViewChanges(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mapReady, useClusteredMap, region]);

  // Convert filtered results to points for clustering (only if using clustered map)
  const points = useClusteredMap ? filteredResults.map(item => ({
    ...item,
    location: {
      latitude: item.coordinates.latitude,
      longitude: item.coordinates.longitude,
    }
  })) : [];

  if (mapError) {
    return <MapFallback onRetry={handleRetry} />;
  }

  // Create initial region from user location or default
  const initialRegion = userLocation ? {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: DEFAULT_REGION.latitudeDelta,
    longitudeDelta: DEFAULT_REGION.longitudeDelta,
  } : DEFAULT_REGION;

  return (
    <View style={styles.container}>
      {useClusteredMap ? (
        <ClusteredMapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={locationPermission}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          loadingEnabled={true}
          mapType={mapType}
          customMapStyle={MAP_STYLE}
          onMapReady={() => {
            setMapReady(true);
            setMapLoading(false);
          }}
          onRegionChangeComplete={handleRegionChange}
          onError={handleMapError}
          data={points}
          renderMarker={renderMarker}
          renderCluster={renderCluster}
          clusteringEnabled={true}
          radius={50}
          maxZoom={16}
          minPoints={2}
          extent={512}
          nodeSize={40}
          edgePadding={{ top: 75, left: 75, bottom: 75, right: 75 }}
          spiderLineColor="#3B82F6"
          preserveClusterPressBehavior={true}
        />
      ) : (
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={locationPermission}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          loadingEnabled={true}
          mapType={mapType}
          customMapStyle={MAP_STYLE}
          onMapReady={() => {
            setMapReady(true);
            setMapLoading(false);
          }}
          onRegionChangeComplete={handleRegionChange}
          onError={handleMapError}
        >
          {filteredResults.map((item) => (
            <AnimatedMarker
              key={item.id}
              item={item}
              isSelected={selectedMarkerId === item.id}
              onPress={() => handleMarkerPress(item)}
              markerColor={getMarkerColor(item)}
              markerIcon={getMarkerIcon(item)}
              tracksViewChanges={markerTracksViewChanges}
            />
          ))}
        </MapView>
      )}

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={goToUserLocation}
        >
          <Ionicons name="navigate" size={24} color="#3B82F6" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={toggleMapType}
        >
          <Ionicons name={mapType === MAP_TYPES.STANDARD ? "layers" : "map"} size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Results Count Badge */}
      <View style={styles.countBadge}>
        <Text style={styles.countText}>
          {filteredResults.length} {filteredResults.length === 1 ? 'Kết quả' : 'Kết quả'}
        </Text>
      </View>

      {/* Restaurant Modal */}
      {selectedRestaurant && (
        <RestaurantModal
          visible={modalVisible}
          restaurant={selectedRestaurant}
          onClose={handleCloseModal}
          onViewDetails={() => handleViewDetails(selectedRestaurant.id)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  calloutContainer: {
    width: 160,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  calloutSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    alignItems: 'center',
  },
  mapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  countBadge: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  clusterContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clusterText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default MapViewContainer; 