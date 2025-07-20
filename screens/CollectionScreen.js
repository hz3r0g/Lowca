import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { restaurantsData, postsData } from '../utils/mockData';
import { calculateDistance, getDefaultLocation } from '../utils/locationUtils';
import * as Location from 'expo-location';

const TABS = [
  { id: 'all', label: 'Tất cả', icon: 'bookmark' },
  { id: 'places', label: 'Địa điểm', icon: 'location' },
  { id: 'posts', label: 'Bài viết', icon: 'document-text' },
];

const initialSavedRestaurantIds = ['1', '2', '4'];

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

// Giả lập danh sách id bài viết đã lưu
const initialSavedPostIds = ['p1', 'p3', 'p6'];

const CollectionScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [savedRestaurantIds, setSavedRestaurantIds] = useState(initialSavedRestaurantIds);
  const [savedPostIds, setSavedPostIds] = useState(initialSavedPostIds);
  const [bookmarkAnim] = useState({});
  const [postBookmarkAnim] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const tabUnderlineAnim = useRef(new Animated.Value(0)).current;
  const tabScales = useRef(TABS.map(() => new Animated.Value(1))).current;
  const screenWidth = Dimensions.get('window').width;
  const horizontalPadding = 32; // px, tương ứng px-4 hai bên
  const tabWidth = (screenWidth - horizontalPadding) / TABS.length;

  // Animate underline và scale khi đổi tab
  useEffect(() => {
    const idx = TABS.findIndex(tab => tab.id === activeTab);
    Animated.spring(tabUnderlineAnim, {
      toValue: idx * tabWidth,
      useNativeDriver: false,
      speed: 18,
      bounciness: 7,
    }).start();
    tabScales.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === idx ? 1.13 : 1,
        useNativeDriver: true,
        speed: 18,
        bounciness: 7,
      }).start();
    });
  }, [activeTab]);

  // Lấy vị trí hiện tại của người dùng
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          setUserLocation(getDefaultLocation());
        }
      } catch (error) {
        setUserLocation(getDefaultLocation());
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Skeleton loader component
  const SkeletonCard = () => (
    <View 
      className="flex-row items-center mb-4 bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2
      }}
    >
      <View className="w-24 h-24 ml-4 bg-gray-200" style={{ borderRadius: 16 }} />
      <View className="flex-1 p-4">
        <View className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
        <View className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
        <View className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
        <View className="flex-row mt-2">
          <View className="bg-gray-100 rounded-full px-6 py-2 mr-2" />
          <View className="bg-gray-100 rounded-full px-6 py-2" />
        </View>
      </View>
      <View className="pr-6">
        <View className="w-7 h-7 bg-gray-200 rounded-full" />
      </View>
    </View>
  );

  const savedRestaurants = restaurantsData.filter(r => savedRestaurantIds.includes(r.id));
  const savedPosts = postsData.filter(p => savedPostIds.includes(p.id));

  const handleToggleSave = (restaurantId) => {
    if (!bookmarkAnim[restaurantId]) bookmarkAnim[restaurantId] = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(bookmarkAnim[restaurantId], { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.timing(bookmarkAnim[restaurantId], { toValue: 1, duration: 120, useNativeDriver: true })
    ]).start();
    setSavedRestaurantIds((prev) =>
      prev.includes(restaurantId)
        ? prev.filter(id => id !== restaurantId)
        : [restaurantId, ...prev]
    );
  };

  // Hiệu ứng động cho icon bookmark bài viết
  const handleToggleSavePost = (postId) => {
    if (!postBookmarkAnim[postId]) postBookmarkAnim[postId] = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(postBookmarkAnim[postId], { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.timing(postBookmarkAnim[postId], { toValue: 1, duration: 120, useNativeDriver: true })
    ]).start();
    setSavedPostIds((prev) =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [postId, ...prev]
    );
  };

  const EmptyState = () => (
    <View className="items-center justify-center py-16">
      <Image source={require('../assets/img/templateposter.jpg')} style={{ width: 90, height: 90, opacity: 0.25, marginBottom: 16 }} />
      <Text className="text-lg font-bold text-gray-500 mb-2">Chưa có quán nào được lưu</Text>
      <Text className="text-gray-400 mb-4 text-center" style={{ maxWidth: 260 }}>
        Hãy khám phá và lưu lại những địa điểm bạn yêu thích!
      </Text>
      <TouchableOpacity className="bg-blue-500 px-5 py-2 rounded-full" activeOpacity={0.8}>
        <Text className="text-white font-bold">Khám phá ngay</Text>
      </TouchableOpacity>
    </View>
  );

  // Card quán đã lưu UI
  const SavedRestaurantCard = ({ item }) => {
    let distanceStr = '';
    if (userLocation && item.coordinates) {
      const d = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        item.coordinates.latitude,
        item.coordinates.longitude
      );
      distanceStr = d > 0 ? `${d.toFixed(1)}km` : '';
    }
    const [scaleAnim] = useState(new Animated.Value(1));

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 30,
        bounciness: 6,
      }).start();
    };
    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 6,
      }).start();
    };

    return (
      <TouchableOpacity
        className="flex-row items-center mb-4 bg-white rounded-3xl overflow-hidden border border-gray-100"
        style={{ 
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2
        }}
        onPress={() => navigation.navigate('RestaurantProfile', { restaurantId: item.id })}
        activeOpacity={0.85}
      >
        <Image source={require('../assets/img/templateposter.jpg')} className="w-24 h-24 ml-4" style={{ borderRadius: 16 }} />
        <View className="flex-1 p-4">
          <Text className="font-bold text-gray-800 text-base mb-1">{item.name}</Text>
          <Text className="text-sm text-gray-500 mb-2">{item.address}</Text>
          <View className="flex-row items-center mb-1">
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text className="text-xs text-yellow-700 ml-1 font-medium">{item.rating}</Text>
            <Text className="text-xs text-gray-400 ml-2">{item.ratingCount} đánh giá</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <View className="bg-blue-50 rounded-full px-3 py-1 mr-2">
              <Text className="text-xs text-blue-600 font-medium">{item.cuisine}</Text>
            </View>
            <View className="bg-emerald-50 rounded-full px-3 py-1 ml-1">
              <Text className="text-xs text-emerald-600 font-medium">{distanceStr}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity className="pr-6" onPress={() => handleToggleSave(item.id)} activeOpacity={0.7}>
          <Animated.View style={{ transform: [{ scale: bookmarkAnim[item.id] || 1 }] }}>
            <Ionicons name={savedRestaurantIds.includes(item.id) ? 'bookmark' : 'bookmark-outline'} size={28} color={savedRestaurantIds.includes(item.id) ? '#3B82F6' : '#666'} />
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Card bài viết đã lưu UI
  const SavedPostCard = ({ item }) => {
    const restaurant = restaurantsData.find(r => r.id === item.restaurantId);
    // Luôn dùng templateposter.jpg làm avatar bài viết
    const postImage = require('../assets/img/templateposter.jpg');
    return (
      <TouchableOpacity
        className="flex-row items-center mb-4 bg-white rounded-3xl overflow-hidden border border-gray-100"
        style={{ 
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2
        }}
        onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
        activeOpacity={0.85}
      >
        <Image source={postImage} className="w-24 h-24 ml-4" style={{ borderRadius: 16 }} />
        <View className="flex-1 p-4">
          <View className="flex-row items-center mb-1">
            <Text className="font-bold text-gray-800 text-base mr-2" numberOfLines={1}>{restaurant ? restaurant.name : 'Quán'}</Text>
            <Text className="text-xs text-gray-400">{item.timePosted}</Text>
          </View>
          <Text className="text-sm text-gray-700 mb-2" numberOfLines={1} ellipsizeMode="tail">{item.content}</Text>
          <View className="flex-row flex-wrap mb-2">
            {item.tags && item.tags.map(tag => (
              <View key={tag} className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-1">
                <Text className="text-xs text-gray-700">#{tag}</Text>
              </View>
            ))}
          </View>
          <View className="flex-row items-center mt-1">
            <View className="flex-row items-center mr-4">
              <Ionicons name="heart" size={16} color="#F87171" />
              <Text className="text-xs text-gray-700 ml-1">{item.likes}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="chatbubble" size={16} color="#3B82F6" />
              <Text className="text-xs text-gray-700 ml-1">{item.comments}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity className="pr-6" onPress={() => handleToggleSavePost(item.id)} activeOpacity={0.7}>
          <Animated.View style={{ transform: [{ scale: postBookmarkAnim[item.id] || 1 }] }}>
            <Ionicons name={savedPostIds.includes(item.id) ? 'bookmark' : 'bookmark-outline'} size={28} color={savedPostIds.includes(item.id) ? '#3B82F6' : '#666'} />
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (  
    <SafeAreaWrapper scrollView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 24,
        marginTop: 8
      }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937' }}>Đã lưu</Text>
        <TouchableOpacity 
          style={{
            backgroundColor: '#3B82F6',
            borderRadius: 9999,
            padding: 8
          }}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Tabs nâng cấp */}
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <View style={{ 
          position: 'relative', 
          height: 52, 
          backgroundColor: '#F3F4F6', 
          borderRadius: 24, 
          flexDirection: 'row', 
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#3B82F6',
          shadowOpacity: 0.07,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2
        }}>
          {/* Animated underline */}
          <Animated.View style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: tabWidth,
            height: 44,
            margin: 4,
            borderRadius: 22,
            backgroundColor: '#fff',
            shadowColor: '#3B82F6',
            shadowOpacity: 0.10,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
            transform: [{ translateX: tabUnderlineAnim }],
          }} />
          {TABS.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            return (
              <Animated.View 
                key={tab.id} 
                style={{ 
                  width: tabWidth, 
                  zIndex: 2, 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: 52, 
                  transform: [{ scale: tabScales[idx] }] 
                }}
              >
                <TouchableOpacity 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    borderRadius: 22, 
                    backgroundColor: 'transparent' 
                  }}
                  activeOpacity={0.85}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <Ionicons 
                    name={tab.icon + (isActive ? '' : '-outline')} 
                    size={18} 
                    color={isActive ? '#3B82F6' : '#666'} 
                  />
                  <Text 
                    style={{ 
                      fontSize: 12, 
                      marginTop: 4, 
                      fontWeight: isActive ? 'bold' : '500',
                      color: isActive ? '#3B82F6' : '#6B7280'
                    }}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>
      
      {/* Saved Restaurants */}
      {activeTab !== 'collections' && (
        <View style={{ paddingHorizontal: 16 }}>
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {activeTab === 'posts' && (
                savedPosts.length === 0 ? (
                  <EmptyState />
                ) : (
                  savedPosts.map(item => <SavedPostCard key={item.id} item={item} />)
                )
              )}
              {activeTab !== 'posts' && (
                savedRestaurants.length === 0 ? (
                  <EmptyState />
                ) : (
                  savedRestaurants.map(item => <SavedRestaurantCard key={item.id} item={item} />)
                )
              )}
            </>
          )}
        </View>
      )}
    </SafeAreaWrapper>
  );
};

export default CollectionScreen;
