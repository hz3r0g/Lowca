import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RestaurantCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity 
      className="flex-row bg-white rounded-2xl mb-4 overflow-hidden shadow-sm border border-gray-100"
      onPress={onPress}
    >
      <Image 
        source={item.image} 
        className="w-24 h-24" 
      />
      <View className="flex-1 p-3 justify-center">
        <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
        <Text className="text-sm text-gray-500 mb-1">{item.type} • {item.cuisine}</Text>
        <View className="flex-row items-center">
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text className="text-sm ml-1 mr-4">{item.rating}</Text>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text className="text-sm ml-1">{item.distance}</Text>
          <Text className="text-sm ml-4 text-gray-500">{item.price}</Text>
        </View>
      </View>
      <TouchableOpacity className="w-10 items-center justify-center">
        <Ionicons name="chevron-forward" size={24} color="#222" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default RestaurantCard; 