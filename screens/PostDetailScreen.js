import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PostDetailScreen = ({ route, navigation }) => {
  // Trong thực tế, chúng ta sẽ nhận postId từ route.params và lấy dữ liệu từ API
  // Ở đây tôi sẽ sử dụng dữ liệu mẫu
  const [comment, setComment] = useState('');
  
  const post = {
    id: '1',
    restaurantName: 'The Coffee House',
    location: 'Quận 1, TP.HCM',
    timePosted: '20 phút trước',
    verified: true,
    content: 'Hương vị mới đã về! Thử ngay Cold Brew Sữa Tươi với hương vị đậm đà, thơm béo từ hạt cà phê Arabica Cầu Đất. Hương vị đặc trưng của Cold Brew kết hợp với sữa tươi béo ngậy tạo nên một trải nghiệm hoàn toàn mới lạ cho người thưởng thức.',
    images: [
      require('../assets/img/templateposter.jpg'),
      require('../assets/img/templateposter.jpg'),
      require('../assets/img/templateposter.jpg')
    ],
    likes: 245,
    comments: 32,
    saved: false,
    rating: 4.8,
    profileImage: require('../assets/img/templateposter.jpg'),
    tags: ['Cà phê', 'Đồ uống', 'Mới'],
    priceRange: '30k - 65k',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    phone: '0123 456 789',
    openHours: '07:00 - 22:00',
  };
  
  const commentsList = [
    {
      id: '1',
      username: 'nguyenvana',
      content: 'Món này ngon thật! Đã thử và rất hài lòng.',
      timePosted: '10 phút trước',
      likes: 5,
      profileImage: require('../assets/img/templateposter.jpg'),
    },
    {
      id: '2',
      username: 'tranvanb',
      content: 'Giá hơi cao nhưng chất lượng xứng đáng.',
      timePosted: '15 phút trước',
      likes: 2,
      profileImage: require('../assets/img/templateposter.jpg'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-2 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Chi tiết bài viết</Text>
        <View className="flex-1" />
        <TouchableOpacity className="ml-4">
          <Ionicons name="share-social-outline" size={24} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity className="ml-4">
          <Ionicons name="ellipsis-horizontal" size={24} color="#222" />
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1">
        {/* Restaurant header */}
        <TouchableOpacity 
          className="p-4 flex-row items-center"
          onPress={() => navigation.navigate('RestaurantProfile', { restaurantId: post.id })}
        >
          <Image 
            source={post.profileImage} 
            className="w-12 h-12 rounded-full" 
          />
          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <Text className="font-bold text-gray-800">{post.restaurantName}</Text>
              {post.verified && (
                <Ionicons name="checkmark-circle" size={16} color="#3B82F6" className="ml-1" />
              )}
            </View>
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text className="text-xs text-gray-500 ml-1">{post.location}</Text>
              <Text className="text-xs text-gray-400 ml-2">• {post.timePosted}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Post images */}
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          className="w-full h-72"
        >
          {post.images.map((image, index) => (
            <Image 
              key={index}
              source={image} 
              className="w-full h-72" 
              style={{width: 390}} // Adjust based on screen width
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        
        {/* Action buttons */}
        <View className="p-4 flex-row items-center justify-between border-b border-gray-100">
          <View className="flex-row items-center">
            <TouchableOpacity className="flex-row items-center mr-4">
              <Ionicons 
                name={post.likes > 0 ? "heart" : "heart-outline"} 
                size={24} 
                color={post.likes > 0 ? "#F87171" : "#666"} 
              />
              <Text className="ml-1 text-gray-700">{post.likes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center mr-4">
              <Ionicons name="chatbubble-outline" size={22} color="#666" />
              <Text className="ml-1 text-gray-700">{post.comments}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity>
              <Ionicons name="share-social-outline" size={22} color="#666" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity>
            <Ionicons 
              name={post.saved ? "bookmark" : "bookmark-outline"} 
              size={22} 
              color={post.saved ? "#3B82F6" : "#666"} 
            />
          </TouchableOpacity>
        </View>

        {/* Post content */}
        <View className="px-4 py-3">
          <Text className="text-gray-800 leading-5 mb-3">{post.content}</Text>
          
          <View className="flex-row flex-wrap mb-3">
            {post.tags.map(tag => (
              <TouchableOpacity key={tag} className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-1">
                <Text className="text-xs text-gray-700">#{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View className="bg-gray-50 rounded-xl p-3 mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle-outline" size={18} color="#666" />
              <Text className="font-medium text-gray-800 ml-1">Thông tin quán</Text>
            </View>
            
            <View className="flex-row items-center mb-1">
              <Ionicons name="location" size={16} color="#666" className="w-6" />
              <Text className="text-sm text-gray-700">{post.address}</Text>
            </View>
            
            <View className="flex-row items-center mb-1">
              <Ionicons name="call" size={16} color="#666" className="w-6" />
              <Text className="text-sm text-gray-700">{post.phone}</Text>
            </View>
            
            <View className="flex-row items-center mb-1">
              <Ionicons name="time" size={16} color="#666" className="w-6" />
              <Text className="text-sm text-gray-700">{post.openHours}</Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="pricetag" size={16} color="#666" className="w-6" />
              <Text className="text-sm text-gray-700">{post.priceRange}</Text>
            </View>
            
            <TouchableOpacity className="bg-blue-500 rounded-lg py-2 mt-3">
              <Text className="text-white text-center font-medium">Xem chi tiết quán</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Comments section */}
        <View className="px-4 pb-20">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-bold text-gray-800">Bình luận ({post.comments})</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Comments', { postId: post.id })}
            >
              <Text className="text-blue-500">Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          {commentsList.map(comment => (
            <View key={comment.id} className="flex-row mb-4">
              <Image 
                source={comment.profileImage} 
                className="w-8 h-8 rounded-full" 
              />
              <View className="ml-3 flex-1">
                <View className="bg-gray-100 rounded-2xl px-3 py-2">
                  <Text className="font-medium text-gray-800">{comment.username}</Text>
                  <Text className="text-gray-700">{comment.content}</Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <Text className="text-xs text-gray-500">{comment.timePosted}</Text>
                  <TouchableOpacity className="ml-4">
                    <Text className="text-xs text-gray-500">Thích</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="ml-4">
                    <Text className="text-xs text-gray-500">Trả lời</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      
      {/* Comment input */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <View className="flex-row items-center">
          <Image 
            source={require('../assets/img/templateposter.jpg')} 
            className="w-8 h-8 rounded-full" 
          />
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 ml-2 mr-2 text-gray-800"
            placeholder="Viết bình luận..."
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity 
            className={`${comment.length > 0 ? 'opacity-100' : 'opacity-50'}`}
            disabled={comment.length === 0}
          >
            <Ionicons name="send" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PostDetailScreen; 