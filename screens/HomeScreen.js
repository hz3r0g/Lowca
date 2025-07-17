import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dữ liệu danh mục
const categories = [
  { id: '1', name: 'Tất cả', icon: 'grid-outline', active: true },
  { id: '2', name: 'Quán mới', icon: 'star-outline' },
  { id: '3', name: 'Gần đây', icon: 'location-outline' },
  { id: '4', name: 'Đánh giá cao', icon: 'thumbs-up-outline' },
  { id: '5', name: 'Đề xuất', icon: 'flame-outline' },
];

// Dữ liệu bài đăng từ các quán F&B
const postsData = [
  {
    id: '1',
    restaurantName: 'The Coffee House',
    location: 'Quận 1, TP.HCM',
    timePosted: '20 phút trước',
    verified: true,
    content: 'Hương vị mới đã về! Thử ngay Cold Brew Sữa Tươi với hương vị đậm đà, thơm béo từ hạt cà phê Arabica Cầu Đất.',
    images: [require('../assets/img/templateposter.jpg')],
    likes: 245,
    comments: 32,
    saved: false,
    rating: 4.8,
    profileImage: require('../assets/img/templateposter.jpg'),
    tags: ['Cà phê', 'Đồ uống', 'Mới'],
    priceRange: '30k - 65k',
  },
  {
    id: '2',
    restaurantName: 'Phúc Long Coffee & Tea',
    location: 'Quận 3, TP.HCM',
    timePosted: '1 giờ trước',
    verified: true,
    content: 'Ưu đãi mới: Mua 1 tặng 1 cho tất cả các loại trà sữa vào thứ 3 hàng tuần. Áp dụng tại tất cả các chi nhánh trên toàn quốc!',
    images: [require('../assets/img/templateposter.jpg'), require('../assets/img/templateposter.jpg')],
    likes: 189,
    comments: 27,
    saved: true,
    rating: 4.6,
    profileImage: require('../assets/img/templateposter.jpg'),
    tags: ['Trà sữa', 'Ưu đãi', 'Khuyến mãi'],
    priceRange: '25k - 60k',
  },
  {
    id: '3',
    restaurantName: 'Bếp Của Gấu',
    location: 'Quận 7, TP.HCM',
    timePosted: '3 giờ trước',
    verified: false,
    content: 'Món mới ra lò: Mì Ý sốt bò băm đậm đà với phô mai Parmesan thượng hạng. Còn chần chừ gì nữa, đến ngay với Bếp Của Gấu!',
    images: [require('../assets/img/templateposter.jpg')],
    likes: 156,
    comments: 18,
    saved: false,
    rating: 4.5,
    profileImage: require('../assets/img/templateposter.jpg'),
    tags: ['Món Âu', 'Mì Ý', 'Món mới'],
    priceRange: '65k - 120k',
  },
];

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('1');

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

  const renderPostItem = ({ item, navigation }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
      className="mb-6 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
    >
      {/* Restaurant header */}
      <TouchableOpacity
        activeOpacity={0.7}
        className="p-4 flex-row items-center"
        onPress={(e) => {
          e.stopPropagation();
          navigation.navigate('RestaurantProfile', { restaurantId: item.id });
        }}
      >
        <Image 
          source={item.profileImage} 
          className="w-12 h-12 rounded-full" 
        />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <Text className="font-bold text-gray-800">{item.restaurantName}</Text>
            {item.verified && (
              <Ionicons name="checkmark-circle" size={16} color="#3B82F6" className="ml-1" />
            )}
          </View>
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text className="text-xs text-gray-500 ml-1">{item.location}</Text>
            <Text className="text-xs text-gray-400 ml-2">• {item.timePosted}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Post content */}
      <View className="px-4 mb-3">
        <Text className="text-gray-800 leading-5">{item.content}</Text>
        
        <View className="flex-row flex-wrap mt-2">
          {item.tags.map(tag => (
            <View key={tag} className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-1">
              <Text className="text-xs text-gray-700">#{tag}</Text>
            </View>
          ))}
        </View>
        
        <View className="flex-row items-center mt-2">
          <Ionicons name="pricetag-outline" size={14} color="#666" />
          <Text className="text-xs text-gray-500 ml-1">{item.priceRange}</Text>
          <View className="flex-row items-center ml-3">
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text className="text-xs text-gray-700 ml-1">{item.rating}</Text>
          </View>
        </View>
      </View>

      {/* Post images */}
      {item.images.length === 1 ? (
        <Image 
          source={item.images[0]} 
          className="w-full h-64" 
          resizeMode="cover"
        />
      ) : (
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          className="w-full h-64"
        >
          {item.images.map((image, index) => (
            <Image 
              key={index}
              source={image} 
              className="w-full h-64" 
              style={{width: 390}} // Adjust based on screen width
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      {/* Action buttons */}
      <View className="p-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity className="flex-row items-center mr-4">
            <Ionicons 
              name={item.likes > 0 ? "heart" : "heart-outline"} 
              size={24} 
              color={item.likes > 0 ? "#F87171" : "#666"} 
            />
            <Text className="ml-1 text-gray-700">{item.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center mr-4">
            <Ionicons name="chatbubble-outline" size={22} color="#666" />
            <Text className="ml-1 text-gray-700">{item.comments}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Ionicons name="share-social-outline" size={22} color="#666" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity>
          <Ionicons 
            name={item.saved ? "bookmark" : "bookmark-outline"} 
            size={22} 
            color={item.saved ? "#3B82F6" : "#666"} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-2">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Ionicons name="restaurant-outline" size={28} color="#222" className="mr-1" />
              <Text className="text-3xl font-bold text-gray-800 ml-0.5">Lowca</Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity className="relative mr-1">
                <Ionicons name="notifications-outline" size={26} color="#222" />
                <View className="absolute top-0 right-0 bg-red-500 rounded-full w-2.5 h-2.5" />
              </TouchableOpacity>
              <TouchableOpacity className="ml-4 bg-gray-100 rounded-full p-1">
                <Ionicons name="person-outline" size={22} color="#222" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-6">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              className="flex-1 ml-2 text-base"
              placeholder="Tìm quán ăn, món ăn..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          {/* Categories */}
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          />

          {/* Stories/Highlights */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="mb-6"
          >
            {/* Add Story */}
            <View className="items-center mr-4">
              <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center border-2 border-dashed border-gray-300">
                <Ionicons name="add" size={24} color="#666" />
              </View>
              <Text className="text-xs text-gray-600 mt-1">Thêm</Text>
            </View>
            
            {/* Story items */}
            {postsData.map((item, index) => (
              <View key={index} className="items-center mr-4">
                <View className="w-16 h-16 rounded-full border-2 border-blue-500 p-0.5">
                  <Image 
                    source={item.profileImage} 
                    className="w-full h-full rounded-full" 
                  />
                </View>
                <Text className="text-xs text-gray-600 mt-1" numberOfLines={1}>
                  {item.restaurantName.split(' ')[0]}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Posts Feed */}
        <View className="px-4">
          {postsData.map(item => (
            <React.Fragment key={item.id}>
              {renderPostItem({item, navigation})}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
