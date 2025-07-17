import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <TouchableOpacity className="flex-row p-3 border-b border-gray-100">
      <Image 
        source={item.image} 
        className="w-20 h-20 rounded-lg"
        resizeMode="cover"
      />
      <View className="flex-1 ml-3 justify-center">
        <Text className="font-bold text-gray-800">{item.name}</Text>
        <Text className="text-gray-500 text-sm mb-1">{item.description}</Text>
        <View className="flex-row items-center mb-1">
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text className="text-gray-700 text-xs ml-1">{item.rating}</Text>
          <Text className="text-gray-500 text-xs ml-1">({item.reviews} đánh giá)</Text>
        </View>
        <Text className="font-medium text-gray-800">{item.price.toLocaleString()} đ</Text>
      </View>
      <TouchableOpacity className="self-center bg-blue-500 rounded-full p-2 ml-2">
        <Ionicons name="add" size={18} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-2 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Trang quán</Text>
        <View className="flex-1" />
        <TouchableOpacity className="ml-4">
          <Ionicons name="share-social-outline" size={24} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity className="ml-4">
          <Ionicons name="ellipsis-horizontal" size={24} color="#222" />
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1">
        {/* Cover Image */}
        <View className="relative h-40">
          <Image 
            source={restaurant.coverImage} 
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
        </View>
        
        {/* Profile Info */}
        <View className="px-4 pt-3 pb-4 border-b border-gray-200">
          <View className="flex-row">
            <Image 
              source={restaurant.profileImage} 
              className="w-20 h-20 rounded-full border-4 border-white -mt-10"
            />
            <View className="flex-1 ml-3 mt-1">
              <View className="flex-row items-center">
                <Text className="text-xl font-bold text-gray-800">{restaurant.name}</Text>
                {restaurant.verified && (
                  <Ionicons name="checkmark-circle" size={18} color="#3B82F6" className="ml-1" />
                )}
              </View>
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text className="text-sm text-gray-500 ml-1">{restaurant.location}</Text>
              </View>
            </View>
            <TouchableOpacity className="bg-blue-500 rounded-lg px-4 py-2 self-start">
              <Text className="text-white font-medium">Theo dõi</Text>
            </TouchableOpacity>
          </View>
          
          <Text className="text-gray-700 mt-3 mb-3">{restaurant.bio}</Text>
          
          <View className="flex-row items-center">
            <View className="flex-row items-center mr-4">
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text className="text-gray-800 font-medium ml-1">{restaurant.rating}</Text>
              <Text className="text-gray-500 text-sm ml-1">({restaurant.reviews})</Text>
            </View>
            <View className="flex-row items-center mr-4">
              <Ionicons name="pricetag-outline" size={16} color="#666" />
              <Text className="text-gray-700 ml-1">{restaurant.priceRange}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text className="text-gray-700 ml-1">{restaurant.openHours}</Text>
            </View>
          </View>
          
          <View className="flex-row mt-4">
            <View className="flex-1 items-center">
              <Text className="font-bold text-gray-800">{restaurant.posts}</Text>
              <Text className="text-gray-500 text-sm">Bài viết</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="font-bold text-gray-800">{restaurant.followers.toLocaleString()}</Text>
              <Text className="text-gray-500 text-sm">Người theo dõi</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="font-bold text-gray-800">{restaurant.following}</Text>
              <Text className="text-gray-500 text-sm">Đang theo dõi</Text>
            </View>
          </View>
          
          <View className="flex-row mt-4">
            <TouchableOpacity className="flex-1 bg-blue-500 rounded-lg py-2 mr-2">
              <View className="flex-row items-center justify-center">
                <Ionicons name="call" size={18} color="#fff" />
                <Text className="text-white font-medium ml-2">Gọi điện</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-blue-500 rounded-lg py-2 ml-2">
              <View className="flex-row items-center justify-center">
                <Ionicons name="navigate" size={18} color="#fff" />
                <Text className="text-white font-medium ml-2">Chỉ đường</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="py-3 border-b border-gray-200"
        >
          {restaurant.categories.map((category, index) => (
            <View 
              key={index} 
              className="bg-gray-100 rounded-full px-4 py-1 mx-2"
            >
              <Text className="text-gray-700">{category}</Text>
            </View>
          ))}
        </ScrollView>
        
        {/* Tabs */}
        <View className="flex-row border-b border-gray-200">
          <TouchableOpacity 
            className={`flex-1 items-center py-3 ${activeTab === 'posts' ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setActiveTab('posts')}
          >
            <Ionicons 
              name="grid" 
              size={22} 
              color={activeTab === 'posts' ? "#3B82F6" : "#666"} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 items-center py-3 ${activeTab === 'menu' ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setActiveTab('menu')}
          >
            <Ionicons 
              name="restaurant" 
              size={22} 
              color={activeTab === 'menu' ? "#3B82F6" : "#666"} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 items-center py-3 ${activeTab === 'info' ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setActiveTab('info')}
          >
            <Ionicons 
              name="information-circle" 
              size={22} 
              color={activeTab === 'info' ? "#3B82F6" : "#666"} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        {activeTab === 'posts' && (
          <View className="flex-row flex-wrap">
            {postsData.map((item, index) => renderGridItem({ item, index }))}
          </View>
        )}
        
        {activeTab === 'menu' && (
          <View>
            <View className="flex-row items-center justify-between px-4 py-3 bg-gray-50">
              <Text className="font-bold text-gray-800">Menu</Text>
              <TouchableOpacity>
                <Text className="text-blue-500">Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            {menuItems.map(item => renderMenuItem({ item }))}
          </View>
        )}
        
        {activeTab === 'info' && (
          <View className="p-4">
            <View className="mb-4">
              <Text className="font-bold text-gray-800 mb-2">Địa chỉ</Text>
              <View className="flex-row">
                <Ionicons name="location" size={18} color="#666" className="mt-1" />
                <Text className="text-gray-700 ml-2 flex-1">{restaurant.address}</Text>
              </View>
            </View>
            
            <View className="mb-4">
              <Text className="font-bold text-gray-800 mb-2">Giờ mở cửa</Text>
              <View className="flex-row">
                <Ionicons name="time" size={18} color="#666" className="mt-1" />
                <Text className="text-gray-700 ml-2">{restaurant.openHours}</Text>
              </View>
            </View>
            
            <View className="mb-4">
              <Text className="font-bold text-gray-800 mb-2">Liên hệ</Text>
              <View className="flex-row mb-2">
                <Ionicons name="call" size={18} color="#666" className="mt-1" />
                <Text className="text-gray-700 ml-2">{restaurant.phone}</Text>
              </View>
              <View className="flex-row">
                <Ionicons name="globe" size={18} color="#666" className="mt-1" />
                <Text className="text-blue-500 ml-2">{restaurant.website}</Text>
              </View>
            </View>
            
            <TouchableOpacity className="bg-blue-500 rounded-lg py-3 mt-2">
              <Text className="text-white text-center font-medium">Đánh giá quán</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RestaurantProfileScreen; 