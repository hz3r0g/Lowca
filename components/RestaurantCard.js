import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CATEGORY_COLORS = {
  food: '#EF4444', // red
  drink: '#3B82F6', // blue
  snack: '#F59E0B', // amber
  specialty: '#10B981', // emerald
  atmosphere: '#8B5CF6', // violet
  default: '#6B7280', // gray
};

const CATEGORY_ICONS = {
  food: 'restaurant',
  drink: 'cafe',
  snack: 'fast-food',
  specialty: 'star',
  atmosphere: 'image',
  default: 'location',
};

const RestaurantCard = ({ item, onPress }) => {
  // Format price range for display
  const formatPriceRange = (priceString) => {
    if (!priceString || !priceString.includes('-')) {
      return formatPrice(priceString);
    }
    
    const [min, max] = priceString.split('-').map(p => parseInt(p));
    
    // If min and max are close, just show one price
    if (max <= min * 1.2) {
      return `~ ${formatPrice(min)}`;
    }
    
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  };
  
  // Format single price
  const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(parseInt(price));
  };

  // Get category color
  const getCategoryColor = (category) => {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    return CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
  };

  return (
    <TouchableOpacity 
      className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
      style={styles.cardShadow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row">
        <View className="relative">
          <Image
            source={item.image || { uri: 'https://via.placeholder.com/100x100?text=Restaurant' }}
            className="w-24 h-24 rounded-lg m-2"
            style={{ width: 100, height: 100 }}
          />
          <View 
            style={[
              styles.categoryBadge, 
              {backgroundColor: getCategoryColor(item.mainCategory)}
            ]}
          >
            <Ionicons 
              name={getCategoryIcon(item.mainCategory)} 
              size={12} 
              color="white" 
            />
          </View>
        </View>
        <View className="flex-1 p-2 justify-between">
          <View>
            <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>{item.name}</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="star" size={16} color="#FBBF24" />
              <Text className="text-sm text-gray-700 ml-1">{item.rating}</Text>
              <Text className="text-sm text-gray-500 mx-1">•</Text>
              <Text className="text-sm text-gray-500">{item.type}</Text>
            </View>
            <Text className="text-sm text-gray-500 mt-1">{item.cuisine}</Text>
          </View>
          
          <View className="flex-row justify-between items-center mt-2">
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text className="text-xs text-gray-500 ml-1" numberOfLines={1}>
                {item.address ? item.address.split(',')[0] : 'Location unavailable'}
              </Text>
            </View>
            <View className="flex-row items-center">
              {item.distance && (
                <View className="flex-row items-center mr-2">
                  <Ionicons name="navigate" size={12} color="#6B7280" />
                  <Text className="text-xs text-gray-500 ml-1">{item.distance} km</Text>
                </View>
              )}
              <Text className="text-sm font-semibold text-blue-500">
                {formatPriceRange(item.price)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {item.featured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>Nổi bật</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FBBF24',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default RestaurantCard; 