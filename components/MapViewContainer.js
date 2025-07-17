import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import MapFallback from './MapFallback';
import RestaurantModal from './RestaurantModal';
import { DEFAULT_REGION, MAP_TYPES, MARKER_COLORS, MAP_STYLE } from '../utils/mapConfig';

const { width, height } = Dimensions.get('window');

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

  // Ensure markers are visible by fitting to markers when map is ready
  useEffect(() => {
    if (mapReady && mapRef.current && filteredResults.length > 0) {
      try {
        // Force delay to ensure map is fully loaded
        setTimeout(() => {
          // Simple approach - just zoom to include all points
          const coordinates = filteredResults.map(item => ({
            latitude: item.coordinates.latitude,
            longitude: item.coordinates.longitude,
          }));
          
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }, 1500);
      } catch (error) {
        handleMapError();
      }
    }
  }, [mapReady, filteredResults]);

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

  const goToUserLocation = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion({
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

  // Function to handle marker press
  const handleMarkerPress = (item) => {
    setSelectedRestaurant(item);
    setModalVisible(true);
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Function to handle view details button press
  const handleViewDetails = (id) => {
    setModalVisible(false);
    onRestaurantPress(id);
  };

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
          <Marker 
            key={item.id}
            coordinate={item.coordinates}
            pinColor={MARKER_COLORS[item.type] || MARKER_COLORS.default}
            onPress={() => handleMarkerPress(item)}
          />
        ))}
      </MapView>

      {mapLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      )}

      {/* Map Controls */}
      {mapReady && (
        <>
          <View style={styles.mapControls}>
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={toggleMapType}
            >
              <Ionicons 
                name={mapType === MAP_TYPES.STANDARD ? 'layers-outline' : 'map-outline'} 
                size={22} 
                color="#3B82F6" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={goToUserLocation}
            >
              <Ionicons 
                name="locate" 
                size={22} 
                color="#3B82F6" 
              />
            </TouchableOpacity>
          </View>

          {/* Results Count Overlay */}
          <View style={styles.resultsCount}>
            <Text style={styles.resultsText}>
              {filteredResults.length} {filteredResults.length === 1 ? 'Result' : 'Results'}
            </Text>
          </View>
        </>
      )}

      {/* Debug Overlay */}
      <View style={styles.debugOverlay}>
        <Text style={styles.debugText}>Map Ready: {mapReady ? 'Yes' : 'No'}</Text>
        <Text style={styles.debugText}>Results: {filteredResults.length}</Text>
      </View>

      {/* Restaurant Modal */}
      <RestaurantModal
        visible={modalVisible}
        restaurant={selectedRestaurant}
        onClose={handleCloseModal}
        onViewDetails={handleViewDetails}
        userLocation={userLocation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapControls: {
    position: 'absolute',
    top: 10,
    right: 10,
    alignItems: 'center',
  },
  mapButton: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  resultsCount: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resultsText: {
    fontWeight: '600',
    color: '#333',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  debugOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  debugText: {
    color: 'white',
    fontSize: 12,
  }
});

export default MapViewContainer; 