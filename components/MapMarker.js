import React from 'react';
import { View, Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { MARKER_COLORS, MARKER_ICONS } from '../utils/mapConfig';

const MapMarker = ({ item, onPress, identifier }) => {
  // Get marker color and icon based on restaurant type
  const markerColor = MARKER_COLORS[item.type] || MARKER_COLORS.default;
  const markerIcon = MARKER_ICONS[item.type] || MARKER_ICONS.default;

  return (
    <Marker
      coordinate={item.coordinates}
      title={item.name}
      description={`${item.type} • ${item.price}`}
      onPress={onPress}
      tracksViewChanges={false}
      identifier={identifier || item.id}
      pinColor={markerColor}
    >
      {/* Use a simple pin instead of custom view for better visibility */}
      {/*
      <View 
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 8,
          borderWidth: 1,
          borderColor: '#ddd',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 3,
        }}
      >
        <Ionicons 
          name={markerIcon} 
          size={20} 
          color={markerColor} 
        />
      </View>
      */}
      <Callout tooltip onPress={onPress}>
        <View style={{
          backgroundColor: 'white',
          padding: 12,
          borderRadius: 8,
          width: 160,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>{item.name}</Text>
          <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{item.type} • {item.cuisine}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={{ fontSize: 12, marginLeft: 2 }}>{item.rating}</Text>
            <Text style={{ fontSize: 12, marginLeft: 8, color: '#666' }}>{item.price}</Text>
          </View>
          <Text style={{ fontSize: 11, color: '#3B82F6', marginTop: 6 }}>Tap for details</Text>
        </View>
      </Callout>
    </Marker>
  );
};

export default MapMarker; 