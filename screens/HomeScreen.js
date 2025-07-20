import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, TextInput, ScrollView, Animated, Easing, Dimensions, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { postsData, restaurantsData, mockUser } from '../utils/mockData';
import { BlurView } from 'expo-blur';

// Dữ liệu bộ lọc ngang mới
const filters = [
  { id: 'all', name: 'Tất cả', icon: 'grid-outline' },
  { id: 'following', name: 'Đang theo dõi', icon: 'heart-outline' },
  { id: 'new', name: 'Quán mới', icon: 'star-outline' },
  { id: 'nearby', name: 'Gần đây', icon: 'location-outline' },
  { id: 'top', name: 'Đánh giá cao', icon: 'thumbs-up-outline' },
  { id: 'suggested', name: 'Đề xuất', icon: 'flame-outline' },
];

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [followedRestaurants, setFollowedRestaurants] = useState(mockUser.followedRestaurants);
  const [activeCategory, setActiveCategory] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [showTabShadow, setShowTabShadow] = useState(false);
  const [likeAnim] = useState({}); // lưu animation cho từng post
  const [fadeAnim] = useState({}); // lưu animation cho từng post
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Đặt getFilteredPosts ở đây, trước mọi useEffect
  const getFilteredPosts = () => {
    let filtered = postsData;
    if (activeFilter === 'following') {
      filtered = postsData.filter(post => followedRestaurants.includes(post.restaurantId));
    } else if (activeFilter === 'new') {
      filtered = postsData.filter(post => post.category === 'new');
    } else if (activeFilter === 'nearby') {
      filtered = postsData.filter(post => post.category === 'nearby');
    } else if (activeFilter === 'top') {
      filtered = postsData.filter(post => post.category === 'top');
    } else if (activeFilter === 'suggested') {
      filtered = postsData.filter(post => post.category === 'suggested');
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  // Khi chuyển tab, loading skeleton
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, [activeFilter]);

  // Shadow cho tab bar khi sticky
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (e) => {
        setShowTabShadow(e.nativeEvent.contentOffset.y > 2);
      },
    }
  );

  // Animation like
  const handleLike = (postId) => {
    if (!likeAnim[postId]) likeAnim[postId] = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(likeAnim[postId], { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.timing(likeAnim[postId], { toValue: 1, duration: 120, useNativeDriver: true })
    ]).start();
    // ... logic like thực tế nếu có ...
  };

  // Animation post mới
  const getFadeAnim = (postId) => {
    if (!fadeAnim[postId]) fadeAnim[postId] = new Animated.Value(1); // Khởi tạo với opacity = 1
    return fadeAnim[postId];
  };

  // Hàm lấy thông tin quán từ id
  const getRestaurantInfo = (restaurantId) => {
    return restaurantsData.find(r => r.id === restaurantId) || {};
  };

  // Modern Header Component
  const Header = () => {
    return (
      <View>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        {/* Main header */}
        <View className="pt-4 pb-2 px-4 bg-white">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Image 
                source={require('../assets/img/avatar.png')} 
                className="w-9 h-9 mr-2 rounded-full" 
                resizeMode="contain"
              />
              <Text className="text-2xl font-bold">Lowca</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity 
                className="mr-4 relative"
                onPress={() => navigation.navigate('Notifications')}
              >
                <Ionicons name="notifications-outline" size={26} color="#333" />
                <View className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="person-circle-outline" size={28} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
          {/* Search bar */}
          <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2.5 mb-4">
            <Ionicons name="search" size={20} color="#666" className="mr-2" />
            <TextInput
              className="flex-1 text-base ml-2 text-gray-800"
              placeholder="Tìm quán ăn, món ăn..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
          {/* Đã xoá tab selector cũ */}
        </View>
      </View>
    );
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      className={`mr-3 items-center ${activeCategory === item.id ? 'opacity-100' : 'opacity-60'}`}
      onPress={() => setActiveCategory(item.id)}
    >
      <View className={`w-14 h-14 rounded-2xl items-center justify-center mb-1 ${activeCategory === item.id ? 'bg-blue-500' : 'bg-gray-100'}`}>
        <Ionicons 
          name={item.icon} 
          size={24} 
          color={activeCategory === item.id ? "#fff" : "#666"} 
        />
      </View>
      <Text className={`text-xs ${activeCategory === item.id ? 'font-medium text-blue-500' : 'text-gray-600'}`}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Thêm hàm renderPostImages kiểu Facebook
  const renderPostImages = (images) => {
    const imgSrc = require('../assets/img/templateposter.jpg');
    const count = images?.length || 0;
    if (count === 1) {
      return (
        <Image source={imgSrc} className="w-full h-72" resizeMode="cover" style={{ borderRadius: 24 }} />
      );
    }
    if (count === 2) {
      return (
        <View className="flex-row w-full h-72">
          <Image source={imgSrc} className="flex-1 h-full mr-1" resizeMode="cover"
            style={{ borderTopLeftRadius: 24, borderBottomLeftRadius: 24 }} />
          <Image source={imgSrc} className="flex-1 h-full ml-1" resizeMode="cover"
            style={{ borderTopRightRadius: 24, borderBottomRightRadius: 24 }} />
        </View>
      );
    }
    if (count === 3) {
      return (
        <View className="flex-row w-full h-72">
          <Image source={imgSrc} className="flex-1 h-full mr-1" resizeMode="cover"
            style={{ borderTopLeftRadius: 24, borderBottomLeftRadius: 24 }} />
          <View className="flex-1 h-full ml-1 justify-between">
            <Image source={imgSrc} className="h-[49%] w-full mb-1" resizeMode="cover"
              style={{ borderTopRightRadius: 24 }} />
            <Image source={imgSrc} className="h-[49%] w-full mt-1" resizeMode="cover"
              style={{ borderBottomRightRadius: 24 }} />
          </View>
        </View>
      );
    }
    if (count === 4) {
      return (
        <View className="flex-wrap flex-row w-full h-72">
          <Image source={imgSrc} className="w-1/2 h-1/2 p-0.5" resizeMode="cover"
            style={{ width: '50%', height: '50%', borderTopLeftRadius: 24 }} />
          <Image source={imgSrc} className="w-1/2 h-1/2 p-0.5" resizeMode="cover"
            style={{ width: '50%', height: '50%', borderTopRightRadius: 24 }} />
          <Image source={imgSrc} className="w-1/2 h-1/2 p-0.5" resizeMode="cover"
            style={{ width: '50%', height: '50%', borderBottomLeftRadius: 24 }} />
          <Image source={imgSrc} className="w-1/2 h-1/2 p-0.5" resizeMode="cover"
            style={{ width: '50%', height: '50%', borderBottomRightRadius: 24 }} />
        </View>
      );
    }
    if (count > 4) {
      return (
        <View className="flex-wrap flex-row w-full h-72">
          <Image source={imgSrc} className="w-1/2 h-1/2 p-0.5" resizeMode="cover"
            style={{ width: '50%', height: '50%', borderTopLeftRadius: 24 }} />
          <Image source={imgSrc} className="w-1/2 h-1/2 p-0.5" resizeMode="cover"
            style={{ width: '50%', height: '50%', borderTopRightRadius: 24 }} />
          <Image source={imgSrc} className="w-1/2 h-1/2 p-0.5" resizeMode="cover"
            style={{ width: '50%', height: '50%', borderBottomLeftRadius: 24 }} />
          <View className="w-1/2 h-1/2 p-0.5 overflow-hidden items-center justify-center" style={{ width: '50%', height: '50%', borderBottomRightRadius: 24 }}>
            <Image source={imgSrc} className="absolute w-full h-full" resizeMode="cover" style={{ borderBottomRightRadius: 24 }} />
            <View className="absolute inset-0 bg-black/50 items-center justify-center flex-row" style={{ borderBottomRightRadius: 24 }}>
              <Text className="text-white text-2xl font-bold">+{count-3}</Text>
            </View>
          </View>
        </View>
      );
    }
    return null;
  };

  // Component PostItem đầy đủ
  const PostItem = ({ item, index }) => {
    const restaurant = getRestaurantInfo(item.restaurantId);
    const scaleAnim = likeAnim && likeAnim[item.id] ? likeAnim[item.id] : new Animated.Value(1);
    
    return (
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
        className={`bg-white rounded-3xl overflow-hidden ${index === 0 ? 'mt-4' : 'mt-8'} ${index === getFilteredPosts().length - 1 ? 'mb-8' : ''}`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
            {/* Restaurant header */}
            <TouchableOpacity
              activeOpacity={0.7}
              className="p-4 flex-row items-center"
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('RestaurantProfile', { restaurantId: restaurant.id });
              }}
            >
              <Image
                source={require('../assets/img/templateposter.jpg')}
                className="w-12 h-12 rounded-full border-2 border-white"
                style={{ 
                  shadowColor: "#000", 
                  shadowOffset: { width: 0, height: 1 }, 
                  shadowOpacity: 0.06, 
                  shadowRadius: 4,
                  elevation: 1,
                }}
              />
              <View className="ml-3 flex-1">
                <View className="flex-row items-center">
                  <Text className="font-bold text-gray-800 text-base">{restaurant.name || 'Quán'}</Text>
                  {restaurant.verified && (
                    <Ionicons name="checkmark-circle" size={16} color="#3B82F6" className="ml-1" />
                  )}
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text className="text-xs text-gray-500 ml-1">{restaurant.address || ''}</Text>
                  <Text className="text-xs text-gray-400 ml-2">• {item.timePosted}</Text>
                </View>
              </View>
              <TouchableOpacity className="w-8 h-8 items-center justify-center rounded-full bg-gray-50">
                <Ionicons name="ellipsis-horizontal" size={18} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Post content */}
            <View className="px-5 pb-4">
              <Text className="text-gray-800 leading-6 text-[15px]">{item.content}</Text>
              <View className="flex-row flex-wrap mt-3">
                {item.tags && item.tags.map(tag => (
                  <View key={tag} className="bg-blue-50 rounded-full px-3 py-1 mr-2 mb-1">
                    <Text className="text-xs text-blue-600 font-medium">#{tag}</Text>
                  </View>
                ))}
              </View>
              <View className="flex-row items-center mt-3">
                <View className="flex-row items-center bg-gray-50 rounded-full px-2 py-1">
                  <Ionicons name="pricetag-outline" size={14} color="#666" />
                  <Text className="text-xs text-gray-500 ml-1 font-medium">{restaurant.price || ''}</Text>
                </View>
                <View className="flex-row items-center ml-3 bg-yellow-50 rounded-full px-2 py-1">
                  <Ionicons name="star" size={14} color="#FFB800" />
                  <Text className="text-xs text-yellow-700 ml-1 font-medium">{restaurant.rating || ''}</Text>
                </View>
              </View>
            </View>

            {/* Post images */}
            <View className="relative">{renderPostImages(item.images)}</View>

            {/* Action buttons */}
            <View className="p-4 flex-row items-center justify-between bg-white">
              <View className="flex-row items-center">
                <TouchableOpacity className="flex-row items-center mr-5 bg-gray-50 px-3 py-1.5 rounded-full" onPress={() => handleLike && handleLike(item.id)} activeOpacity={0.65}>
                  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <Ionicons
                      name={item.likes > 0 ? "heart" : "heart-outline"}
                      size={20}
                      color={item.likes > 0 ? "#F87171" : "#666"}
                    />
                  </Animated.View>
                  <Text className="ml-1 text-gray-700 font-medium text-sm">{item.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center mr-5 bg-gray-50 px-3 py-1.5 rounded-full">
                  <Ionicons name="chatbubble-outline" size={18} color="#666" />
                  <Text className="ml-1 text-gray-700 font-medium text-sm">{item.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-gray-50 w-9 h-9 items-center justify-center rounded-full">
                  <Ionicons name="share-social-outline" size={18} color="#666" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity className="bg-gray-50 w-9 h-9 items-center justify-center rounded-full">
                <Ionicons
                  name={item.saved ? "bookmark" : "bookmark-outline"}
                  size={18}
                  color={item.saved ? "#3B82F6" : "#666"}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
    );
  };

  // Empty State component
  const EmptyState = ({ tab }) => (
    <View className="items-center justify-center py-16">
      <Image source={require('../assets/img/templateposter.jpg')} style={{ width: 90, height: 90, opacity: 0.25, marginBottom: 16 }} />
      <Text className="text-lg font-bold text-gray-500 mb-2">{tab === 'all' ? 'Chưa có bài đăng nào' : 'Bạn chưa theo dõi quán nào'}</Text>
      <Text className="text-gray-400 mb-4 text-center" style={{ maxWidth: 260 }}>
        {tab === 'all' ? 'Hãy là người đầu tiên chia sẻ trải nghiệm!' : 'Theo dõi các quán bạn yêu thích để xem bài đăng mới nhất.'}
      </Text>
      {tab === 'following' && (
        <TouchableOpacity className="bg-blue-500 px-5 py-2 rounded-full" activeOpacity={0.8} onPress={() => setActiveFilter('all')}>
          <Text className="text-white font-bold">Khám phá quán</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Skeleton loader
  const SkeletonPost = () => (
    <View className="mb-8 bg-gray-100 rounded-3xl overflow-hidden" style={{ height: 340 }}>
      <View className="flex-row items-center p-4">
        <View className="w-12 h-12 rounded-full bg-gray-300 mr-3" />
        <View className="flex-1">
          <View className="h-4 bg-gray-300 rounded w-2/3 mb-2" />
          <View className="h-3 bg-gray-200 rounded w-1/2" />
        </View>
      </View>
      <View className="px-5 pb-4">
        <View className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
        <View className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
        <View className="h-3 bg-gray-200 rounded w-1/3" />
      </View>
      <View className="w-full h-72 bg-gray-300" />
    </View>
  );

  return (
    <SafeAreaWrapper className="flex-1 bg-white">
      {/* Use the new Header component */}
      <Header />
      
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Categories */}
        <View className="px-4 pt-2">
          <FlatList
            data={filters}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`mr-3 items-center ${activeFilter === item.id ? 'opacity-100' : 'opacity-60'}`}
                onPress={() => setActiveFilter(item.id)}
              >
                <View className={`w-14 h-14 rounded-2xl items-center justify-center mb-1 ${activeFilter === item.id ? 'bg-blue-500' : 'bg-gray-100'}`}>
                  <Ionicons
                    name={item.icon}
                    size={24}
                    color={activeFilter === item.id ? "#fff" : "#666"}
                  />
                </View>
                <Text className={`text-xs ${activeFilter === item.id ? 'font-medium text-blue-500' : 'text-gray-600'}`}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          />

          {/* Posts Feed */}
          <View>
            {isLoading ? (
              <>
                <SkeletonPost />
                <SkeletonPost />
              </>
            ) : getFilteredPosts().length === 0 ? (
              <EmptyState tab={activeFilter} />
            ) : (
              <>
                <FlatList
                  data={getFilteredPosts()}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, index }) => <PostItem item={item} index={index} />}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                />
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
