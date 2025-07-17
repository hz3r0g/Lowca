import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { MAP_STYLE } from '../utils/mapConfig';

const { width, height } = Dimensions.get('window');

// Ho Chi Minh City coordinates
const HCMC = {
  latitude: 10.7769,
  longitude: 106.7009,
};

// Sample locations
const SAMPLE_LOCATIONS = [
  {
    id: '1',
    title: 'Cafe Sunshine',
    description: 'Coffee & Breakfast',
    coordinate: {
      latitude: 10.7769,
      longitude: 106.7009,
    },
    type: 'Cafe',
    rating: '4.5',
    price: '$',
  },
  {
    id: '2',
    title: 'Pho Delicious',
    description: 'Vietnamese Restaurant',
    coordinate: {
      latitude: 10.7782,
      longitude: 106.7032,
    },
    type: 'Restaurant',
    rating: '4.8',
    price: '$$',
  },
  {
    id: '3',
    title: 'Sky Lounge',
    description: 'Bar & Grill',
    coordinate: {
      latitude: 10.7755,
      longitude: 106.7050,
    },
    type: 'Bar',
    rating: '4.3',
    price: '$$$',
  },
];

const SimpleMap = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Function to handle marker press
  const handleMarkerPress = (location) => {
    setSelectedMarker(location.id);
    
    // Show alert with location info
    Alert.alert(
      location.title,
      `${location.description}\nRating: ${location.rating} • ${location.price}`,
      [
        {
          text: "View Details",
          onPress: () => {}
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          latitude: HCMC.latitude,
          longitude: HCMC.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        customMapStyle={MAP_STYLE}
      >
        {SAMPLE_LOCATIONS.map(location => (
          <Marker
            key={location.id}
            coordinate={location.coordinate}
            title={location.title}
            description={location.description}
            onCalloutPress={() => {}}
            onPress={() => handleMarkerPress(location)}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default SimpleMap; 