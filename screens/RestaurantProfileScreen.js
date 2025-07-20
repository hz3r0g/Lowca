import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { mockUser } from '../utils/mockData';

const RestaurantProfileScreen = ({ route, navigation }) => {
  // Trong thực tế, chúng ta sẽ nhận restaurantId từ route.params và lấy dữ liệu từ API
  // Ở đây tôi sẽ sử dụng dữ liệu mẫu
  const [activeTab, setActiveTab] = useState('posts');
  
  const restaurant = {
    id: '1',
    name: 'The Coffee House',
    verified: true,
    bio: 'Chuỗi cà phê Việt Nam với hơn 100 cửa hàng trên toàn quốc. Phục vụ cà phê, trà, bánh ngọt và đồ ăn nhẹ.',
    location: 'Quận 1, TP.HCM',
    followers: 12500,
    following: 245,
    posts: 328,
    rating: 4.8,
    reviews: 1240,
    coverImage: require('../assets/img/templateposter.jpg'),
    profileImage: require('../assets/img/templateposter.jpg'),
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    phone: '0123 456 789',
    website: 'thecoffeehouse.com',
    openHours: '07:00 - 22:00',
    priceRange: '30k - 65k',
    categories: ['Cà phê', 'Trà', 'Bánh ngọt', 'Đồ ăn nhẹ'],
  };
  
  const postsData = [
    {
      id: '1',
      images: [require('../assets/img/templateposter.jpg')],
      likes: 245,
      comments: 32,
    },
    {
      id: '2',
      images: [require('../assets/img/templateposter.jpg')],
      likes: 189,
      comments: 27,
    },
    {
      id: '3',
      images: [require('../assets/img/templateposter.jpg')],
      likes: 156,
      comments: 18,
    },
    {
      id: '4',
      images: [require('../assets/img/templateposter.jpg')],
      likes: 132,
      comments: 15,
    },
    {
      id: '5',
      images: [require('../assets/img/templateposter.jpg')],
      likes: 110,
      comments: 12,
    },
    {
      id: '6',
      images: [require('../assets/img/templateposter.jpg')],
      likes: 98,
      comments: 10,
    },
  ];
  
  const menuItems = [
    {
      id: '1',
      name: 'Cold Brew Sữa Tươi',
      price: 49000,
      image: require('../assets/img/templateposter.jpg'),
      description: 'Đá xay cà phê thơm ngon',
      rating: 4.8,
      reviews: 124,
    },
    {
      id: '2',
      name: 'Cà Phê Sữa Đá',
      price: 29000,
      image: require('../assets/img/templateposter.jpg'),
      description: 'Cà phê truyền thống Việt Nam',
      rating: 4.9,
      reviews: 256,
    },
    {
      id: '3',
      name: 'Trà Sen Vàng',
      price: 45000,
      image: require('../assets/img/templateposter.jpg'),
      description: 'Trà hương sen thanh mát',
      rating: 4.7,
      reviews: 112,
    },
  ];

  const [isFollowed, setIsFollowed] = useState(mockUser.followedRestaurants.includes(restaurant.id));

  const handleFollow = () => {
    setIsFollowed(!isFollowed);
    // Sau này sẽ gọi API/Firebase để cập nhật trạng thái theo dõi
  };

  const renderGridItem = ({ item, index }) => (
    <TouchableOpacity 
      className="relative"
      style={{ 
        width: '33%', 
        aspectRatio: 1,
        padding: index % 3 === 1 ? 1 : 0,
        paddingLeft: index % 3 === 0 ? 0 : 1,
        paddingRight: index % 3 === 2 ? 0 : 1,
        marginBottom: 2
      }}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
    >
      <Image 
        source={item.images[0]} 
        className="w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute bottom-1 left-1 flex-row items-center">
        <Ionicons name="heart" size={12} color="#fff" />
        <Text className="text-white text-xs ml-1">{item.likes}</Text>
      </View>
      <View className="absolute bottom-1 right-1 flex-row items-center">
        <Ionicons name="chatbubble" size={12} color="#fff" />
        <Text className="text-white text-xs ml-1">{item.comments}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity className="flex-row p-4" activeOpacity={0.8}>
      <Image 
        source={item.image} 
        className="w-20 h-20 rounded-2xl"
        resizeMode="cover"
      />
      <View className="flex-1 ml-4 justify-center">
        <Text className="font-bold text-gray-800 text-base">{item.name}</Text>
        <Text className="text-gray-500 text-sm mb-2 leading-5">{item.description}</Text>
        <View className="flex-row items-center mb-2">
          <Ionicons name="star" size={16} color="#FFB800" />
          <Text className="text-gray-700 text-sm ml-1 font-medium">{item.rating}</Text>
          <Text className="text-gray-500 text-xs ml-1">({item.reviews} đánh giá)</Text>
        </View>
        <Text className="font-bold text-gray-800 text-lg">{item.price.toLocaleString()} đ</Text>
      </View>
      <TouchableOpacity className="self-center bg-blue-500 rounded-full p-3 ml-2" activeOpacity={0.8}>
        <Ionicons name="add" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaWrapper className="flex-1 bg-white">
      {/* Header với shadow */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#222" />
        </TouchableOpacity>
        <View className="flex-1 ml-3">
          <Text className="text-lg font-bold text-gray-800">Trang quán</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-gray-50 mr-2" activeOpacity={0.7}>
          <Ionicons name="share-social-outline" size={20} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-gray-50" activeOpacity={0.7}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#222" />
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Cover Image với gradient đẹp */}
        <View className="relative h-48">
          <Image 
            source={restaurant.coverImage} 
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </View>
        
        {/* Profile Info với shadow */}
        <View className="px-4 pt-3 pb-6 bg-white -mt-6 rounded-t-3xl relative z-10"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
          }}>
          <View className="flex-row">
            <Image 
              source={restaurant.profileImage} 
              className="w-24 h-24 rounded-full border-4 border-white -mt-12"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            />
            <View className="flex-1 ml-4 mt-1">
              <View className="flex-row items-center">
                <Text className="text-2xl font-bold text-gray-800">{restaurant.name}</Text>
                {restaurant.verified && (
                  <Ionicons name="checkmark-circle" size={20} color="#3B82F6" className="ml-2" />
                )}
              </View>
              <View className="flex-row items-center mt-1">
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text className="text-sm text-gray-500 ml-1">{restaurant.location}</Text>
              </View>
            </View>
            <TouchableOpacity
              className={`rounded-full px-6 py-3 self-start ${isFollowed ? 'bg-gray-100' : 'bg-blue-500'}`}
              onPress={handleFollow}
              activeOpacity={0.8}
            >
              <Text className={`font-bold ${isFollowed ? 'text-gray-700' : 'text-white'}`}>
                {isFollowed ? 'Đã theo dõi' : 'Theo dõi'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text className="text-gray-700 mt-4 mb-4 leading-6 text-[15px]">{restaurant.bio}</Text>
          
          {/* Stats với styling đẹp */}
          <View className="flex-row items-center justify-between bg-gray-50 rounded-2xl p-4 mb-4">
            <View className="flex-row items-center">
              <Ionicons name="star" size={18} color="#FFB800" />
              <Text className="text-gray-800 font-bold ml-1 text-lg">{restaurant.rating}</Text>
              <Text className="text-gray-500 text-sm ml-1">({restaurant.reviews})</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="pricetag-outline" size={18} color="#666" />
              <Text className="text-gray-700 ml-1 font-medium">{restaurant.priceRange}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text className="text-gray-700 ml-1 font-medium">{restaurant.openHours}</Text>
            </View>
          </View>
          
          {/* Stats grid */}
          <View className="flex-row bg-white rounded-2xl overflow-hidden mb-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
            }}>
            <View className="flex-1 items-center py-4 border-r border-gray-100">
              <Text className="font-bold text-gray-800 text-xl">{restaurant.posts}</Text>
              <Text className="text-gray-500 text-sm">Bài viết</Text>
            </View>
            <View className="flex-1 items-center py-4 border-r border-gray-100">
              <Text className="font-bold text-gray-800 text-xl">{restaurant.followers.toLocaleString()}</Text>
              <Text className="text-gray-500 text-sm">Người theo dõi</Text>
            </View>
            <View className="flex-1 items-center py-4">
              <Text className="font-bold text-gray-800 text-xl">{restaurant.following}</Text>
              <Text className="text-gray-500 text-sm">Đang theo dõi</Text>
            </View>
          </View>
          
          {/* Action buttons */}
          <View className="flex-row">
            <TouchableOpacity className="flex-1 bg-blue-500 rounded-2xl py-4 mr-2 active:opacity-80" activeOpacity={0.8}>
              <View className="flex-row items-center justify-center">
                <Ionicons name="call" size={20} color="#fff" />
                <Text className="text-white font-bold ml-2">Gọi điện</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-gray-100 rounded-2xl py-4 ml-2 active:opacity-80" activeOpacity={0.8}>
              <View className="flex-row items-center justify-center">
                <Ionicons name="navigate" size={20} color="#3B82F6" />
                <Text className="text-blue-500 font-bold ml-2">Chỉ đường</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Categories với styling đẹp */}
        <View className="py-4 bg-white">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="px-4"
          >
            {restaurant.categories.map((category, index) => (
              <View 
                key={`category-${index}`}
                className="bg-blue-50 rounded-full px-4 py-2 mx-1"
              >
                <Text className="text-blue-600 font-medium">{category}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        
        {/* Tabs với styling đẹp */}
        <View className="flex-row bg-white border-b border-gray-100"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }}>
          <TouchableOpacity 
            className={`flex-1 items-center py-4 ${activeTab === 'posts' ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setActiveTab('posts')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="grid" 
              size={24} 
              color={activeTab === 'posts' ? "#3B82F6" : "#666"} 
            />
            <Text className={`text-xs mt-1 ${activeTab === 'posts' ? 'text-blue-500 font-bold' : 'text-gray-500'}`}>
              Bài viết
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 items-center py-4 ${activeTab === 'menu' ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setActiveTab('menu')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="restaurant" 
              size={24} 
              color={activeTab === 'menu' ? "#3B82F6" : "#666"} 
            />
            <Text className={`text-xs mt-1 ${activeTab === 'menu' ? 'text-blue-500 font-bold' : 'text-gray-500'}`}>
              Menu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 items-center py-4 ${activeTab === 'info' ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setActiveTab('info')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="information-circle" 
              size={24} 
              color={activeTab === 'info' ? "#3B82F6" : "#666"} 
            />
            <Text className={`text-xs mt-1 ${activeTab === 'info' ? 'text-blue-500 font-bold' : 'text-gray-500'}`}>
              Thông tin
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        {activeTab === 'posts' && (
          <View>
            <FlatList
              data={postsData}
              renderItem={renderGridItem}
              keyExtractor={item => item.id}
              numColumns={3}
              scrollEnabled={false}
            />
          </View>
        )}
        
        {activeTab === 'menu' && (
          <View className="bg-gray-50">
            <View className="flex-row items-center justify-between px-4 py-4 bg-white mb-2">
              <Text className="font-bold text-gray-800 text-lg">Menu</Text>
              <TouchableOpacity className="bg-blue-50 rounded-full px-4 py-2" activeOpacity={0.7}>
                <Text className="text-blue-500 font-bold">Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            {menuItems.map(item => (
              <View key={`menu-item-${item.id}`} className="bg-white mb-2 mx-4 rounded-2xl overflow-hidden"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.06,
                  shadowRadius: 4,
                  elevation: 2,
                }}>
                {renderMenuItem({ item })}
              </View>
            ))}
          </View>
        )}
        
        {activeTab === 'info' && (
          <View className="p-4 bg-gray-50">
            <View className="bg-white rounded-2xl p-6 mb-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 4,
                elevation: 2,
              }}>
              <View className="mb-6">
                <Text className="font-bold text-gray-800 text-lg mb-3">Địa chỉ</Text>
                <View className="flex-row">
                  <Ionicons name="location" size={20} color="#666" className="mt-1" />
                  <Text className="text-gray-700 ml-3 flex-1 leading-6">{restaurant.address}</Text>
                </View>
              </View>
              
              <View className="mb-6">
                <Text className="font-bold text-gray-800 text-lg mb-3">Giờ mở cửa</Text>
                <View className="flex-row">
                  <Ionicons name="time" size={20} color="#666" className="mt-1" />
                  <Text className="text-gray-700 ml-3">{restaurant.openHours}</Text>
                </View>
              </View>
              
              <View className="mb-6">
                <Text className="font-bold text-gray-800 text-lg mb-3">Liên hệ</Text>
                <View className="flex-row mb-3">
                  <Ionicons name="call" size={20} color="#666" className="mt-1" />
                  <Text className="text-gray-700 ml-3">{restaurant.phone}</Text>
                </View>
                <View className="flex-row">
                  <Ionicons name="globe" size={20} color="#666" className="mt-1" />
                  <Text className="text-blue-500 ml-3">{restaurant.website}</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity className="bg-blue-500 rounded-2xl py-4 active:opacity-80" activeOpacity={0.8}>
              <Text className="text-white text-center font-bold text-lg">Đánh giá quán</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default RestaurantProfileScreen; 