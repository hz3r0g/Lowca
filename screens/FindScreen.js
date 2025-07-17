import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, Modal, ScrollView, Dimensions, ActivityIndicator, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

// Import components
import RestaurantCard from '../components/RestaurantCard';
import FilterOption from '../components/FilterOption';
import MapViewContainer from '../components/MapViewContainer';
import SimpleMap from '../components/SimpleMap';

// Import utils
import { calculateDistance, getDefaultLocation } from '../utils/locationUtils';
import { restaurantsData, priceRanges, distanceRanges, cuisineCategories } from '../utils/mockData';

const { width } = Dimensions.get('window');

const FindScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(true); // Default to map view
  const [selectedPrice, setSelectedPrice] = useState('any');
  const [selectedDistance, setSelectedDistance] = useState(0);
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [filteredResults, setFilteredResults] = useState(restaurantsData);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useSimpleMap, setUseSimpleMap] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Request location permissions and get user location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status === 'granted');
        
        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          // Default to Ho Chi Minh City if permission denied
          setUserLocation(getDefaultLocation());
        }
      } catch (error) {
        setUserLocation(getDefaultLocation());
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Apply filters to search results
  useEffect(() => {
    if (!userLocation) {
      return;
    }

    let results = restaurantsData;
    
    // Filter by search query
    if (searchQuery) {
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by price
    if (selectedPrice !== 'any') {
      results = results.filter(item => item.price === selectedPrice);
    }
    
    // Filter by cuisine
    if (selectedCuisine !== 'all') {
      results = results.filter(item => item.cuisine === selectedCuisine);
    }
    
    // Filter by distance
    if (selectedDistance > 0) {
      results = results.filter(item => {
        const distance = calculateDistance(
          userLocation.latitude, 
          userLocation.longitude,
          item.coordinates.latitude,
          item.coordinates.longitude
        );
        return distance <= selectedDistance;
      });
    }
    
    setFilteredResults(results);
  }, [searchQuery, selectedPrice, selectedDistance, selectedCuisine, userLocation]);

  // Handle navigation to restaurant profile
  const handleRestaurantPress = (id) => {
    navigation.navigate('RestaurantProfile', { id });
  };

  const handleMapError = () => {
    setMapError(true);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (  
    <View className="flex-1 bg-white pt-8 px-4">
      <View className="flex-row items-center justify-between mb-6 mt-2">
        <Text className="text-2xl font-bold text-gray-800">Find Places</Text>
        <View className="flex-row">
          <TouchableOpacity 
            className="p-2 bg-gray-100 rounded-full mr-2"
            onPress={() => setUseSimpleMap(!useSimpleMap)}
          >
            <Ionicons name={useSimpleMap ? "map" : "map-outline"} size={24} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="p-2 bg-gray-100 rounded-full"
            onPress={() => setShowMap(!showMap)}
          >
            <Ionicons name={showMap ? "list" : "map"} size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Search Bar */}
      <View className="flex-row items-center bg-gray-100 rounded-full px-4 mb-4">
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          className="flex-1 py-3 px-2 text-base"
          placeholder="Search for restaurants, cafes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Filter Button */}
      <TouchableOpacity 
        className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-4 self-start"
        onPress={() => setShowFilters(!showFilters)}
      >
        <Ionicons name="options" size={18} color="#3B82F6" />
        <Text className="text-blue-500 font-medium ml-2">Filters</Text>
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-3/4">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-800">Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color="#222" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Price Range */}
              <Text className="text-lg font-semibold text-gray-800 mb-3">Price Range</Text>
              <View className="flex-row flex-wrap mb-6">
                {priceRanges.map((price) => (
                  <FilterOption
                    key={price.value}
                    label={price.label}
                    isSelected={selectedPrice === price.value}
                    onPress={() => setSelectedPrice(price.value)}
                  />
                ))}
              </View>
              
              {/* Distance */}
              <Text className="text-lg font-semibold text-gray-800 mb-3">Distance</Text>
              <View className="flex-row flex-wrap mb-6">
                {distanceRanges.map((distance) => (
                  <FilterOption
                    key={distance.value}
                    label={distance.label}
                    isSelected={selectedDistance === distance.value}
                    onPress={() => setSelectedDistance(distance.value)}
                  />
                ))}
              </View>
              
              {/* Cuisine Categories */}
              <Text className="text-lg font-semibold text-gray-800 mb-3">Cuisine</Text>
              <View className="flex-row flex-wrap mb-6">
                {cuisineCategories.map((cuisine) => (
                  <FilterOption
                    key={cuisine.value}
                    label={cuisine.label}
                    isSelected={selectedCuisine === cuisine.value}
                    onPress={() => setSelectedCuisine(cuisine.value)}
                  />
                ))}
              </View>
            </ScrollView>
            
            <TouchableOpacity 
              className="bg-blue-500 rounded-full py-3 items-center"
              onPress={() => setShowFilters(false)}
            >
              <Text className="text-white font-bold text-lg">Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Map or List View */}
      {showMap ? (
        <View className="flex-1 rounded-2xl overflow-hidden">
          {userLocation && (
            <>
              {useSimpleMap ? (
                <SimpleMap />
              ) : (
                <MapViewContainer
                  userLocation={userLocation}
                  locationPermission={locationPermission}
                  filteredResults={filteredResults}
                  onRestaurantPress={handleRestaurantPress}
                  onMapError={handleMapError}
                />
              )}
              {mapError && (
                <View 
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    alignSelf: 'center',
                    backgroundColor: 'rgba(255, 0, 0, 0.7)',
                    padding: 10,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: 'white' }}>Map error occurred. Try SimpleMap.</Text>
                </View>
              )}
            </>
          )}
        </View>
      ) : (
        <>
          {/* Results Count */}
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            {filteredResults.length} {filteredResults.length === 1 ? 'Result' : 'Results'}
          </Text>
          
          {/* Results List */}
          {filteredResults.length > 0 ? (
            <FlatList
              data={filteredResults}
              renderItem={({ item }) => (
                <RestaurantCard 
                  item={item} 
                  onPress={() => handleRestaurantPress(item.id)}
                />
              )}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Ionicons name="search-outline" size={64} color="#CBD5E0" />
              <Text className="text-lg text-gray-500 mt-4">No results found</Text>
              <Text className="text-sm text-gray-400 text-center mt-2">
                Try adjusting your filters or search terms
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default FindScreen;
