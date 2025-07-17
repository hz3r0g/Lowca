import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

const ClusterMarker = ({ count, coordinate, onPress }) => {
  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.text}>{count}</Text>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ClusterMarker; 