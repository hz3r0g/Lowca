import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, Modal, ScrollView, Dimensions, ActivityIndicator, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

// Import components
import RestaurantCard from '../components/RestaurantCard';
import FilterOption from '../components/FilterOption';
import MapViewContainer from '../components/MapViewContainer';
import SimpleMap from '../components/SimpleMap';
import PriceRangeSelector from '../components/PriceRangeSelector';
import DistanceSlider from '../components/DistanceSlider';
import CategorySelector from '../components/CategorySelector';

// Import utils
import { calculateDistance, getDefaultLocation } from '../utils/locationUtils';
import { restaurantsData, priceRanges, distanceRanges, cuisineCategories, categoryData } from '../utils/mockData';

const { width } = Dimensions.get('window');

const RECENT_FILTERS_KEY = 'recent_filters';
const MAX_RECENT_FILTERS = 3;

// Thêm hàm kiểm tra openNow
function isOpenNow(openHours) {
  if (!openHours) return false;
  // openHours dạng '7:00 - 22:00' hoặc '6:00 - 14:00'
  const now = new Date();
  const [open, close] = openHours.split('-').map(s => s.trim());
  if (!open || !close) return false;
  const [openH, openM] = open.split(':').map(Number);
  const [closeH, closeM] = close.split(':').map(Number);
  const openMinutes = openH * 60 + (openM || 0);
  const closeMinutes = closeH * 60 + (closeM || 0);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  // Nếu giờ đóng < giờ mở (qua đêm)
  if (closeMinutes <= openMinutes) {
    return nowMinutes >= openMinutes || nowMinutes < closeMinutes;
  }
  return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
}

const FindScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(true); // Default to map view
  
  // Current applied filters
  const [selectedPrice, setSelectedPrice] = useState('any');
  const [selectedDistance, setSelectedDistance] = useState(0);
  const [selectedMainCategory, setSelectedMainCategory] = useState('all'); // Default to "All" category
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  
  // Temporary filters (only applied when user clicks "Apply Filters")
  const [tempPrice, setTempPrice] = useState('any');
  const [tempDistance, setTempDistance] = useState(0);
  const [tempMainCategory, setTempMainCategory] = useState('all');
  const [tempSubCategories, setTempSubCategories] = useState([]);
  const [tempOnlyOpenNow, setTempOnlyOpenNow] = useState(false);
  
  const [filteredResults, setFilteredResults] = useState(restaurantsData);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useSimpleMap, setUseSimpleMap] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [recentFilters, setRecentFilters] = useState([]);
  const [showRecentFilters, setShowRecentFilters] = useState(false);
  
  // Suggested popular filter combinations
  const popularFilters = [
    { 
      name: 'Quán cà phê yên tĩnh', 
      filters: { 
        mainCategory: 'drink', 
        subCategories: ['coffee', 'quiet'],
        price: 'any',
        distance: 0
      } 
    },
    { 
      name: 'Nhà hàng view đẹp', 
      filters: { 
        mainCategory: 'food', 
        subCategories: ['view'],
        price: 'any',
        distance: 0
      } 
    },
    { 
      name: 'Ăn vặt dưới 50K', 
      filters: { 
        mainCategory: 'snack', 
        subCategories: [],
        price: '0-50000',
        distance: 0
      } 
    },
  ];

  // Initialize temp filters with current filters when modal opens
  useEffect(() => {
    if (showFilters) {
      setTempPrice(selectedPrice);
      setTempDistance(selectedDistance);
      setTempMainCategory(selectedMainCategory);
      setTempSubCategories([...selectedSubCategories]);
      setTempOnlyOpenNow(onlyOpenNow);
    }
  }, [showFilters]);

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
    
    // Filter by price - updated to support price ranges
    if (selectedPrice !== 'any') {
      const [selectedMinPrice, selectedMaxPrice] = selectedPrice.split('-').map(p => parseInt(p));
      
      results = results.filter(item => {
        // Parse restaurant price range
        const [itemMinPrice, itemMaxPrice] = item.price.split('-').map(p => parseInt(p));
        
        // Check if there's an overlap between the two price ranges
        // A restaurant is a match if its price range overlaps with the selected price range
        return !(selectedMaxPrice < itemMinPrice || selectedMinPrice > itemMaxPrice);
      });
    }
    
    // Filter by main category (only if not "all")
    if (selectedMainCategory && selectedMainCategory !== 'all') {
      results = results.filter(item => item.mainCategory === selectedMainCategory);
    }
    
    // Filter by subcategories
    if (selectedSubCategories.length > 0) {
      results = results.filter(item => {
        // Restaurant matches only if it has ALL of the selected subcategories
        return selectedSubCategories.every(subCat => item.subCategories.includes(subCat));
      });
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

    // Filter by onlyOpenNow
    if (onlyOpenNow) {
      results = results.filter(item => isOpenNow(item.openHours));
    }
    
    setFilteredResults(results);
  }, [searchQuery, selectedPrice, selectedDistance, selectedMainCategory, selectedSubCategories, userLocation, onlyOpenNow]);

  // Load recent filters from storage
  useEffect(() => {
    const loadRecentFilters = async () => {
      try {
        const savedFilters = await AsyncStorage.getItem(RECENT_FILTERS_KEY);
        if (savedFilters) {
          setRecentFilters(JSON.parse(savedFilters));
        } else {
        }
      } catch (error) {
        // Fallback to empty array if AsyncStorage fails
        setRecentFilters([]);
      }
    };
    
    loadRecentFilters();
  }, []);

  // Save current filter as recent when applying filters
  const saveFilterAsRecent = async (filterValues) => {
    const { price, distance, mainCategory, subCategories, onlyOpenNow } = filterValues;
    if (price === 'any' && distance === 0 && 
        mainCategory === 'all' && subCategories.length === 0 &&
        onlyOpenNow === false) {
      return; // Don't save default filters
    }
    try {
      const newFilter = {
        id: Date.now().toString(),
        name: getFilterName(filterValues),
        filters: {
          price,
          distance,
          mainCategory,
          subCategories,
          onlyOpenNow,
        }
      };
      let updatedRecentFilters = [newFilter, ...recentFilters.filter(f => {
        const a = f.filters;
        const b = newFilter.filters;
        return !(
          a.price === b.price &&
          a.distance === b.distance &&
          a.mainCategory === b.mainCategory &&
          a.onlyOpenNow === b.onlyOpenNow &&
          Array.isArray(a.subCategories) && Array.isArray(b.subCategories) &&
          a.subCategories.length === b.subCategories.length &&
          a.subCategories.every((v, i) => v === b.subCategories[i])
        );
      })].slice(0, MAX_RECENT_FILTERS);
      setRecentFilters(updatedRecentFilters);
      await AsyncStorage.setItem(RECENT_FILTERS_KEY, JSON.stringify(updatedRecentFilters));
    } catch (error) {
    }
  };
  
  // Generate a name for the filter based on selected values
  const getFilterName = (filterValues) => {
    // If no argument, fallback to old behavior for compatibility
    const price = filterValues?.price ?? selectedPrice;
    const distance = filterValues?.distance ?? selectedDistance;
    const mainCategory = filterValues?.mainCategory ?? selectedMainCategory;
    const subCategories = filterValues?.subCategories ?? selectedSubCategories;
    const onlyOpen = filterValues?.onlyOpenNow ?? onlyOpenNow;

    const parts = [];
    if (mainCategory !== 'all') {
      const category = categoryData.find(cat => cat.id === mainCategory);
      if (category) parts.push(category.name);
    }
    if (subCategories.length > 0) {
      const subCatNames = subCategories.map(getSubCategoryName);
      parts.push(subCatNames.join(', '));
    }
    if (price !== 'any') {
      parts.push(formatPriceRange(price));
    }
    if (distance > 0) {
      parts.push(`${distance}km`);
    }
    if (onlyOpen) {
      parts.push('Mở cửa');
    }
    return parts.length > 0 ? parts.join(' • ') : 'Bộ lọc tùy chỉnh';
  };
  
  // Apply a saved filter
  const applyRecentFilter = (filter) => {
    setSelectedPrice(filter.filters.price);
    setSelectedDistance(filter.filters.distance);
    setSelectedMainCategory(filter.filters.mainCategory);
    setSelectedSubCategories(filter.filters.subCategories);
    setOnlyOpenNow(filter.filters.onlyOpenNow);
    setShowRecentFilters(false);
  };
  
  // Apply a popular filter
  const applyPopularFilter = (filter) => {
    setSelectedPrice(filter.filters.price);
    setSelectedDistance(filter.filters.distance);
    setSelectedMainCategory(filter.filters.mainCategory);
    setSelectedSubCategories(filter.filters.subCategories);
    setOnlyOpenNow(filter.filters.onlyOpenNow);
  };

  // Apply all filters at once
  const applyAllFilters = async () => {
    setSelectedPrice(tempPrice);
    setSelectedDistance(tempDistance);
    setSelectedMainCategory(tempMainCategory);
    setSelectedSubCategories(tempSubCategories);
    setOnlyOpenNow(tempOnlyOpenNow);
    setShowFilters(false);
    // Lưu bộ lọc gần đây và cập nhật lại state
    const filterValues = {
      price: tempPrice,
      distance: tempDistance,
      mainCategory: tempMainCategory,
      subCategories: tempSubCategories,
      onlyOpenNow: tempOnlyOpenNow,
    };
    setTimeout(async () => {
      await saveFilterAsRecent(filterValues);
      // Đọc lại recentFilters từ AsyncStorage để đảm bảo cập nhật
      try {
        const savedFilters = await AsyncStorage.getItem(RECENT_FILTERS_KEY);
        if (savedFilters) {
          setRecentFilters(JSON.parse(savedFilters));
        } else {
        }
      } catch (error) {
      }
    }, 500);
  };

  // Cancel filter changes
  const cancelFilters = () => {
    setTempPrice(selectedPrice);
    setTempDistance(selectedDistance);
    setTempMainCategory(selectedMainCategory);
    setTempSubCategories([...selectedSubCategories]);
    setTempOnlyOpenNow(onlyOpenNow);
    setShowFilters(false);
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedPrice('any');
    setSelectedDistance(0);
    setSelectedMainCategory('all');
    setSelectedSubCategories([]);
    setOnlyOpenNow(false);
  };

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format price range for display
  const formatPriceRange = (priceRange) => {
    if (priceRange === 'any') return 'Mọi giá';
    
    const [min, max] = priceRange.split('-').map(p => parseInt(p));
    
    if (min === 0) {
      return `Dưới ${formatPrice(max)}`;
    }
    
    if (max === 1000000) {
      return `Trên ${formatPrice(min)}`;
    }
    
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  };
  
  // Get subcategory name from ID
  const getSubCategoryName = (subCategoryId) => {
    for (const category of categoryData) {
      const subCategory = category.subcategories.find(sub => sub.id === subCategoryId);
      if (subCategory) {
        return subCategory.name;
      }
    }
    return subCategoryId;
  };

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

  // Count active temporary filters
  const activeTempFiltersCount = 
    (tempPrice !== 'any' ? 1 : 0) + 
    (tempDistance > 0 ? 1 : 0) + 
    (tempSubCategories.length > 0 ? 1 : 0) +
    (tempOnlyOpenNow ? 1 : 0);
    
  // Count active filters
  const activeFiltersCount = 
    (selectedPrice !== 'any' ? 1 : 0) + 
    (selectedDistance > 0 ? 1 : 0) + 
    (selectedMainCategory !== 'all' ? 1 : 0) +
    (selectedSubCategories.length > 0 ? 1 : 0) +
    (onlyOpenNow ? 1 : 0);

  // Render filter content for modal
  const renderFilterContent = () => {
    return (
      <>
        <CategorySelector
          selectedCategory={tempMainCategory}
          selectedSubCategories={tempSubCategories}
          onCategoryChange={setTempMainCategory}
          onSubCategoriesChange={setTempSubCategories}
        />
        
        <PriceRangeSelector 
          selectedPrice={tempPrice} 
          onSelectPrice={setTempPrice} 
        />
        
        <View style={{ marginBottom: 24 }}>
          <DistanceSlider
            value={tempDistance}
            onValueChange={setTempDistance}
            maximumValue={20}
          />
        </View>

        <TouchableOpacity 
          className="flex-row items-center justify-between bg-gray-100 rounded-full px-4 py-2 mb-4"
          onPress={() => setTempOnlyOpenNow(!tempOnlyOpenNow)}
        >
          <Text className="text-gray-800 font-medium">Chỉ xem nhà hàng mở cửa</Text>
          <Ionicons 
            name={tempOnlyOpenNow ? "checkbox-outline" : "checkbox"} 
            size={20} 
            color="#3B82F6" 
          />
      </TouchableOpacity>
      </>
  );
  };

  return (  
    <SafeAreaWrapper>
      <View className="flex-1 bg-white pt-8 px-4">
        <View className="flex-row items-center justify-between mb-6 mt-2">
          <Text className="text-2xl font-bold text-gray-800">Tìm địa điểm</Text>
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
            placeholder="Tìm nhà hàng, quán cà phê..."
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
        <View className="flex-row items-center mb-4 flex-wrap">
          <TouchableOpacity 
            className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mr-2 mb-2"
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="options" size={18} color="#3B82F6" />
            <Text className="text-blue-500 font-medium ml-2">Bộ lọc</Text>
            
            {/* Badge for active filters count */}
            {activeFiltersCount > 0 && (
              <View className="bg-blue-500 rounded-full w-5 h-5 items-center justify-center ml-2">
                <Text className="text-white text-xs font-bold">
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          {recentFilters.length > 0 && (
            <TouchableOpacity 
              className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mr-2 mb-2"
              onPress={() => setShowRecentFilters(true)}
            >
              <Ionicons name="time-outline" size={18} color="#3B82F6" />
              <Text className="text-blue-500 font-medium ml-2">Gần đây</Text>
            </TouchableOpacity>
          )}
          
          {activeFiltersCount > 0 && (
            <TouchableOpacity 
              className="flex-row items-center bg-red-100 rounded-full px-4 py-2 mr-2 mb-2"
              onPress={resetAllFilters}
            >
              <Ionicons name="refresh" size={18} color="#EF4444" />
              <Text className="text-red-500 font-medium ml-2">Xóa bộ lọc</Text>
            </TouchableOpacity>
          )}
          
          {/* Active filter chips */}
          {selectedPrice !== 'any' && (
            <TouchableOpacity 
              className="flex-row items-center bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2"
              onPress={() => setSelectedPrice('any')}
            >
              <Text className="text-blue-600 font-medium mr-1">
                {formatPriceRange(selectedPrice)}
              </Text>
              <Ionicons name="close-circle" size={16} color="#3B82F6" />
            </TouchableOpacity>
          )}
          
          {selectedDistance > 0 && (
            <TouchableOpacity 
              className="flex-row items-center bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2"
              onPress={() => setSelectedDistance(0)}
            >
              <Text className="text-blue-600 font-medium mr-1">
                {`${selectedDistance} km`}
              </Text>
              <Ionicons name="close-circle" size={16} color="#3B82F6" />
            </TouchableOpacity>
          )}
          
          {selectedMainCategory !== 'all' && (
            <TouchableOpacity 
              className="flex-row items-center bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2"
              onPress={() => setSelectedMainCategory('all')}
            >
              <Text className="text-blue-600 font-medium mr-1">
                {categoryData.find(cat => cat.id === selectedMainCategory)?.name || ''}
              </Text>
              <Ionicons name="close-circle" size={16} color="#3B82F6" />
          </TouchableOpacity>
          )}
          
          {selectedSubCategories.length > 0 && selectedSubCategories.map(subCat => (
            <TouchableOpacity 
              key={subCat}
              className="flex-row items-center bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2"
              onPress={() => {
                const newSubCats = selectedSubCategories.filter(id => id !== subCat);
                setSelectedSubCategories(newSubCats);
              }}
            >
              <Text className="text-blue-600 font-medium mr-1">
                {getSubCategoryName(subCat)}
              </Text>
              <Ionicons name="close-circle" size={16} color="#3B82F6" />
          </TouchableOpacity>
          ))}

          {onlyOpenNow && (
            <TouchableOpacity 
              className="flex-row items-center bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2"
              onPress={() => setOnlyOpenNow(false)}
            >
              <Text className="text-blue-600 font-medium mr-1">
                Chỉ xem nhà hàng mở cửa
              </Text>
              <Ionicons name="close-circle" size={16} color="#3B82F6" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Recent Filters Modal */}
        <Modal
          visible={showRecentFilters}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowRecentFilters(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-800">Bộ lọc gần đây</Text>
                <TouchableOpacity onPress={() => setShowRecentFilters(false)}>
                  <Ionicons name="close" size={24} color="#222" />
                </TouchableOpacity>
              </View>
              
              {recentFilters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  className="flex-row items-center justify-between bg-blue-50 rounded-xl p-4 mb-3"
                  onPress={() => applyRecentFilter(filter)}
                >
                  <View className="flex-1">
                    <Text className="text-gray-800 font-semibold">{filter.name}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#3B82F6" />
                </TouchableOpacity>
              ))}
              
              <Text className="text-lg font-semibold text-gray-800 mt-4 mb-3">Đề xuất phổ biến</Text>
              
              {popularFilters.map((filter, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center justify-between bg-gray-50 rounded-xl p-4 mb-3"
                  onPress={() => {
                    applyPopularFilter(filter);
                    setShowRecentFilters(false);
                  }}
                >
                  <View className="flex-1">
                    <Text className="text-gray-800 font-semibold">{filter.name}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#3B82F6" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Filter Modal */}
        <Modal
          visible={showFilters}
          transparent={true}
          animationType="slide"
          onRequestClose={cancelFilters}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-6 h-3/4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-800">Bộ lọc</Text>
                <TouchableOpacity onPress={cancelFilters}>
                  <Ionicons name="close" size={24} color="#222" />
                </TouchableOpacity>
              </View>
              
              {/* Selected filters summary */}
              {activeTempFiltersCount > 0 && (
                <View className="mb-4 p-3 bg-blue-50 rounded-xl">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-blue-800 font-medium">Bộ lọc đã chọn:</Text>
                    <TouchableOpacity 
                      className="bg-white border border-blue-300 rounded-full px-3 py-1"
                      onPress={() => {
                        setTempPrice('any');
                        setTempDistance(0);
                        setTempMainCategory('all');
                        setTempSubCategories([]);
                        setTempOnlyOpenNow(false);
                      }}
                    >
                      <Text className="text-blue-600 text-xs font-medium">Xóa tất cả</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row flex-wrap">
                    {tempMainCategory !== 'all' && (
                      <View className="bg-white border border-blue-200 rounded-full px-3 py-1 mr-2 mb-1">
                        <Text className="text-blue-600 font-medium">
                          {categoryData.find(cat => cat.id === tempMainCategory)?.name || ''}
                        </Text>
                      </View>
                    )}
                    
                    {tempPrice !== 'any' && (
                      <View className="bg-white border border-blue-200 rounded-full px-3 py-1 mr-2 mb-1">
                        <Text className="text-blue-600 font-medium">
                          Giá: {formatPriceRange(tempPrice)}
                        </Text>
                      </View>
                    )}
                    
                    {tempDistance > 0 && (
                      <View className="bg-white border border-blue-200 rounded-full px-3 py-1 mr-2 mb-1">
                        <Text className="text-blue-600 font-medium">
                          Khoảng cách: {tempDistance} km
                        </Text>
                      </View>
                    )}

                    {tempOnlyOpenNow && (
                      <View className="bg-white border border-blue-200 rounded-full px-3 py-1 mr-2 mb-1">
                        <Text className="text-blue-600 font-medium">
                          Chỉ xem nhà hàng mở cửa
                        </Text>
                      </View>
                    )}
                    
                    {tempSubCategories.length > 0 && tempSubCategories.map(subCat => (
                      <View key={subCat} className="bg-white border border-blue-200 rounded-full px-3 py-1 mr-2 mb-1">
                        <Text className="text-blue-600 font-medium">
                          {getSubCategoryName(subCat)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              {/* Thay thế ScrollView bằng FlatList để tránh lỗi nested VirtualizedLists */}
              <FlatList
                data={[{ key: 'filterContent' }]}
                renderItem={() => renderFilterContent()}
                keyExtractor={(item) => item.key}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={() => (
                  <TouchableOpacity 
                    className="bg-blue-500 rounded-full py-3 items-center mt-4 mb-4"
                    onPress={applyAllFilters}
                  >
                    <Text className="text-white font-bold text-lg">Áp dụng bộ lọc</Text>
                  </TouchableOpacity>
                )}
              />
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
                    <Text style={{ color: 'white' }}>Lỗi bản đồ. Hãy thử SimpleMap.</Text>
                  </View>
                )}
              </>
            )}
          </View>
        ) : (
          <>
            {/* Results Count */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-800">
                {filteredResults.length} {filteredResults.length === 1 ? 'Kết quả' : 'Kết quả'}
              </Text>
              
              {filteredResults.length > 0 && (
                <TouchableOpacity 
                  className="flex-row items-center" 
                  onPress={() => setShowMap(true)}
                >
                  <Text className="text-blue-500 font-medium mr-1">Xem bản đồ</Text>
                  <Ionicons name="map" size={16} color="#3B82F6" />
                </TouchableOpacity>
              )}
            </View>
            
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
            <View className="flex-1 justify-center items-center p-6">
              <Ionicons name="search-outline" size={64} color="#CBD5E0" />
              <Text className="text-xl font-bold text-gray-500 mt-4">Không tìm thấy kết quả</Text>
              <Text className="text-sm text-gray-400 text-center mt-2 mb-6">
                Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
              </Text>
              <TouchableOpacity
                className="bg-blue-500 rounded-full py-3 px-6"
                onPress={resetAllFilters}
              >
                <Text className="text-white font-medium">Xóa tất cả bộ lọc</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
    </SafeAreaWrapper>
  );
};

export default FindScreen;
