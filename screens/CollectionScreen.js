import React from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for collections
const collectionsData = [
  {
    id: '1',
    title: 'Favorite Cafes',
    count: 12,
    image: require('../assets/img/templateposter.jpg'),
  },
  {
    id: '2',
    title: 'Must Try Foods',
    count: 8,
    image: require('../assets/img/templateposter.jpg'),
  },
  {
    id: '3',
    title: 'Weekend Getaways',
    count: 5,
    image: require('../assets/img/templateposter.jpg'),
  },
];

// Mock data for saved items
const savedItemsData = [
  {
    id: '1',
    name: 'Espresso Coffee',
    location: 'Coffee Shop, Downtown',
    image: require('../assets/img/templateposter.jpg'),
    saved: true,
  },
  {
    id: '2',
    name: 'Burger Deluxe',
    location: 'Burger Joint, Uptown',
    image: require('../assets/img/templateposter.jpg'),
    saved: true,
  },
  {
    id: '3',
    name: 'Pizza Margherita',
    location: 'Pizza Place, Midtown',
    image: require('../assets/img/templateposter.jpg'),
    saved: true,
  },
];

const CollectionScreen = () => {
  return (  
    <ScrollView className="flex-1 bg-white pt-8">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 mb-6">
        <Text className="text-2xl font-bold text-gray-800">Collections</Text>
        <TouchableOpacity className="bg-blue-500 rounded-full p-2">
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Collections */}
      <Text className="text-lg font-semibold text-gray-800 px-4 mb-3">Your Collections</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
        className="mb-8"
      >
        {collectionsData.map(collection => (
          <TouchableOpacity 
            key={collection.id} 
            className="mr-4 rounded-2xl overflow-hidden shadow-sm bg-white border border-gray-100"
            style={{ width: 160 }}
          >
            <Image source={collection.image} className="w-full h-24" />
            <View className="p-3">
              <Text className="font-bold text-gray-800">{collection.title}</Text>
              <Text className="text-sm text-gray-500">{collection.count} places</Text>
            </View>
          </TouchableOpacity>
        ))}
        
        {/* Add new collection card */}
        <TouchableOpacity 
          className="mr-4 rounded-2xl overflow-hidden shadow-sm bg-gray-50 border border-gray-200 items-center justify-center"
          style={{ width: 160, height: 112 }}
        >
          <Ionicons name="add-circle-outline" size={32} color="#666" />
          <Text className="mt-1 font-medium text-gray-700">New Collection</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Saved Items */}
      <View className="flex-row items-center justify-between px-4 mb-3">
        <Text className="text-lg font-semibold text-gray-800">Saved Items</Text>
        <TouchableOpacity>
          <Text className="text-blue-500">See All</Text>
        </TouchableOpacity>
      </View>
      
      <View className="px-4">
        {savedItemsData.map(item => (
          <TouchableOpacity 
            key={item.id} 
            className="flex-row items-center mb-4 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
          >
            <Image source={item.image} className="w-20 h-20" />
            <View className="flex-1 p-3">
              <Text className="font-bold text-gray-800">{item.name}</Text>
              <Text className="text-sm text-gray-500">{item.location}</Text>
            </View>
            <TouchableOpacity className="pr-4">
              <Ionicons name={item.saved ? "bookmark" : "bookmark-outline"} size={24} color="#3B82F6" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default CollectionScreen;
