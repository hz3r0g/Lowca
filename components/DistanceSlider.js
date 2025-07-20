import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const DistanceSlider = ({ value, onValueChange, maximumValue = 20 }) => {
  const [distance, setDistance] = useState(value || 0);
  
  // Update local state when prop changes
  useEffect(() => {
    setDistance(value);
  }, [value]);
  
  // Handle slider change
  const handleSliderChange = (newValue) => {
    setDistance(newValue);
    onValueChange(newValue);
  };
  
  // Format the distance label
  const formatDistanceLabel = () => {
    if (distance === 0) {
      return 'Bất kỳ khoảng cách';
    } else if (distance === maximumValue) {
      return `${distance}+ km`;
    } else {
      return `${distance} km`;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Khoảng cách</Text>
        <Text style={styles.valueLabel}>{formatDistanceLabel()}</Text>
      </View>
      
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={maximumValue}
        step={1}
        value={distance}
        onValueChange={handleSliderChange}
        minimumTrackTintColor="#4A7DFF"
        maximumTrackTintColor="#E5E7EB"
        thumbTintColor="#4A7DFF"
      />
      
      <View style={styles.labelsContainer}>
        <Text style={styles.label}>Bất kỳ</Text>
        <Text style={styles.label}>{maximumValue}+ km</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  valueLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A7DFF',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default DistanceSlider; 