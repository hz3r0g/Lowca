import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { calculateDistance, formatDistance, openMapsWithDirections } from '../utils/locationUtils';

const { width } = Dimensions.get('window');

const RestaurantModal = ({ visible, restaurant, onClose, onViewDetails, userLocation }) => {
  if (!restaurant) return null;
  
  // Xử lý an toàn cho hình ảnh
  const getImageSource = () => {
    try {
      return require('../assets/img/phuclong.jpg');
    } catch (error) {
      return null;
    }
  };
  
  // Tính khoảng cách từ vị trí người dùng đến nhà hàng
  const distance = userLocation && restaurant.coordinates 
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        restaurant.coordinates.latitude,
        restaurant.coordinates.longitude
      )
    : null;
    
  // Mở Google Maps để chỉ đường
  const handleGetDirections = () => {
    // Tạo tên địa điểm đầy đủ cho Google Maps
    const fullAddress = `${restaurant.name}, ${restaurant.address || '123 Example Street, District 1'}, Ho Chi Minh City`;
    
    openMapsWithDirections(
      restaurant.coordinates,
      fullAddress,
      userLocation
    );
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          
          {/* Restaurant image */}
          <View style={styles.imageContainer}>
            <Image source={getImageSource()} style={styles.image} />
          </View>
          
          {/* Restaurant info */}
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{restaurant.name}</Text>
            
            <View style={styles.detailRow}>
              <View style={styles.tagContainer}>
                <Text style={styles.tag}>{restaurant.type}</Text>
              </View>
              <View style={styles.tagContainer}>
                <Text style={styles.tag}>{restaurant.cuisine}</Text>
              </View>
              <Text style={styles.price}>{restaurant.price}</Text>
            </View>
            
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{restaurant.rating}</Text>
              <Text style={styles.ratingCount}>(120+ ratings)</Text>
              
              {distance && (
                <View style={styles.distanceContainer}>
                  <Ionicons name="location" size={14} color="#3B82F6" />
                  <Text style={styles.distanceText}>{formatDistance(distance)}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.addressContainer}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.address}>{restaurant.address || '123 Example Street, District 1'}</Text>
            </View>
            
            <View style={styles.featureRow}>
              <View style={styles.feature}>
                <Ionicons name="time-outline" size={16} color="#3B82F6" />
                <Text style={styles.featureText}>20-30 min</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="bicycle-outline" size={16} color="#3B82F6" />
                <Text style={styles.featureText}>Free Delivery</Text>
              </View>
            </View>
            
            {/* Action buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]}
                onPress={onClose}
              >
                <Text style={styles.secondaryButtonText}>Close</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]}
                onPress={() => onViewDetails(restaurant.id)}
              >
                <Text style={styles.primaryButtonText}>View Details</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            {/* Directions button */}
            <TouchableOpacity 
              style={styles.directionsButton}
              onPress={handleGetDirections}
            >
              <Ionicons name="navigate" size={18} color="#fff" />
              <Text style={styles.directionsButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  tag: {
    fontSize: 12,
    color: '#4B5563',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  distanceText: {
    fontSize: 12,
    color: '#3B82F6',
    marginLeft: 2,
    fontWeight: '500',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 10,
  },
  featureText: {
    fontSize: 12,
    color: '#3B82F6',
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    flex: 1,
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    flex: 1,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    marginRight: 4,
  },
  secondaryButtonText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  directionsButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionsButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default RestaurantModal; 