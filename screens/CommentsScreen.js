import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const CommentsScreen = ({ route, navigation }) => {
  // Trong thực tế, chúng ta sẽ nhận postId từ route.params và lấy dữ liệu từ API
  // Ở đây tôi sẽ sử dụng dữ liệu mẫu
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      username: 'nguyenvana',
      content: 'Món này ngon thật! Đã thử và rất hài lòng.',
      timePosted: '10 phút trước',
      likes: 5,
      profileImage: require('../assets/img/templateposter.jpg'),
      isLiked: false,
      replies: [
        {
          id: '1.1',
          username: 'thecoffeehouse',
          content: 'Cảm ơn bạn đã ghé quán và để lại đánh giá tích cực!',
          timePosted: '5 phút trước',
          likes: 2,
          profileImage: require('../assets/img/templateposter.jpg'),
          isLiked: false,
        }
      ]
    },
    {
      id: '2',
      username: 'tranvanb',
      content: 'Giá hơi cao nhưng chất lượng xứng đáng.',
      timePosted: '15 phút trước',
      likes: 2,
      profileImage: require('../assets/img/templateposter.jpg'),
      isLiked: true,
      replies: []
    },
    {
      id: '3',
      username: 'lethic',
      content: 'Không gian quán rất đẹp và thoáng mát. Nhân viên phục vụ nhiệt tình. Sẽ quay lại lần sau!',
      timePosted: '30 phút trước',
      likes: 8,
      profileImage: require('../assets/img/templateposter.jpg'),
      isLiked: false,
      replies: []
    },
    {
      id: '4',
      username: 'phamd',
      content: 'Đồ uống ở đây rất ngon, đặc biệt là Cold Brew Sữa Tươi. Nhưng hơi đông vào cuối tuần.',
      timePosted: '1 giờ trước',
      likes: 12,
      profileImage: require('../assets/img/templateposter.jpg'),
      isLiked: false,
      replies: [
        {
          id: '4.1',
          username: 'thecoffeehouse',
          content: 'Cảm ơn bạn đã ghé quán! Chúng tôi sẽ cố gắng cải thiện dịch vụ vào cuối tuần.',
          timePosted: '45 phút trước',
          likes: 3,
          profileImage: require('../assets/img/templateposter.jpg'),
          isLiked: false,
        }
      ]
    },
    {
      id: '5',
      username: 'trinhhoang',
      content: 'Bánh ngọt ở đây cũng rất ngon, đặc biệt là bánh tiramisu.',
      timePosted: '2 giờ trước',
      likes: 7,
      profileImage: require('../assets/img/templateposter.jpg'),
      isLiked: false,
      replies: []
    },
  ]);
  
  const [replyingTo, setReplyingTo] = useState(null);
  
  const handleLike = (commentId, isReply = false, parentId = null) => {
    if (isReply) {
      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  isLiked: !reply.isLiked
                };
              }
              return reply;
            })
          };
        }
        return comment;
      }));
    } else {
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          };
        }
        return comment;
      }));
    }
  };
  
  const handleReply = (username, commentId) => {
    setReplyingTo({ username, commentId });
    // Focus on the comment input
  };
  
  const handleSubmitComment = () => {
    if (comment.trim() === '') return;
    
    if (replyingTo) {
      // Add reply to the specific comment
      setComments(comments.map(c => {
        if (c.id === replyingTo.commentId) {
          return {
            ...c,
            replies: [
              ...c.replies,
              {
                id: `${c.id}.${c.replies.length + 1}`,
                username: 'currentuser', // In a real app, this would be the logged-in user
                content: comment,
                timePosted: 'Vừa xong',
                likes: 0,
                profileImage: require('../assets/img/templateposter.jpg'),
                isLiked: false,
              }
            ]
          };
        }
        return c;
      }));
      setReplyingTo(null);
    } else {
      // Add new comment
      setComments([
        {
          id: `${comments.length + 1}`,
          username: 'currentuser', // In a real app, this would be the logged-in user
          content: comment,
          timePosted: 'Vừa xong',
          likes: 0,
          profileImage: require('../assets/img/templateposter.jpg'),
          isLiked: false,
          replies: []
        },
        ...comments
      ]);
    }
    
    setComment('');
  };

  const renderComment = ({ item }) => (
    <View className="mb-4">
      <View className="flex-row">
        <Image 
          source={item.profileImage} 
          className="w-10 h-10 rounded-full" 
        />
        <View className="ml-3 flex-1">
          <View className="bg-gray-100 rounded-2xl px-3 py-2">
            <Text className="font-medium text-gray-800">{item.username}</Text>
            <Text className="text-gray-700">{item.content}</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Text className="text-xs text-gray-500">{item.timePosted}</Text>
            <TouchableOpacity 
              className="ml-4 flex-row items-center"
              onPress={() => handleLike(item.id)}
            >
              <Text className={`text-xs ${item.isLiked ? 'text-blue-500' : 'text-gray-500'}`}>
                Thích{item.likes > 0 ? ` (${item.likes})` : ''}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="ml-4"
              onPress={() => handleReply(item.username, item.id)}
            >
              <Text className="text-xs text-gray-500">Trả lời</Text>
            </TouchableOpacity>
          </View>
          
          {/* Replies */}
          {item.replies.length > 0 && (
            <View className="mt-2 pl-4 border-l-2 border-gray-200">
              {item.replies.map(reply => (
                <View key={reply.id} className="mb-2">
                  <View className="flex-row">
                    <Image 
                      source={reply.profileImage} 
                      className="w-8 h-8 rounded-full" 
                    />
                    <View className="ml-2 flex-1">
                      <View className="bg-gray-100 rounded-2xl px-3 py-2">
                        <Text className="font-medium text-gray-800">{reply.username}</Text>
                        <Text className="text-gray-700">{reply.content}</Text>
                      </View>
                      <View className="flex-row items-center mt-1">
                        <Text className="text-xs text-gray-500">{reply.timePosted}</Text>
                        <TouchableOpacity 
                          className="ml-4 flex-row items-center"
                          onPress={() => handleLike(reply.id, true, item.id)}
                        >
                          <Text className={`text-xs ${reply.isLiked ? 'text-blue-500' : 'text-gray-500'}`}>
                            Thích{reply.likes > 0 ? ` (${reply.likes})` : ''}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-2 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Bình luận ({comments.length})</Text>
      </View>
      
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Comment input */}
      <View className="border-t border-gray-200 px-4 py-2">
        {replyingTo && (
          <View className="flex-row items-center justify-between bg-gray-100 rounded-lg px-3 py-2 mb-2">
            <Text className="text-gray-700">
              Đang trả lời <Text className="font-medium">@{replyingTo.username}</Text>
            </Text>
            <TouchableOpacity onPress={() => setReplyingTo(null)}>
              <Ionicons name="close" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        )}
        <View className="flex-row items-center">
          <Image 
            source={require('../assets/img/templateposter.jpg')} 
            className="w-8 h-8 rounded-full" 
          />
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 ml-2 mr-2 text-gray-800"
            placeholder={replyingTo ? `Trả lời ${replyingTo.username}...` : "Viết bình luận..."}
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity 
            className={`${comment.length > 0 ? 'opacity-100' : 'opacity-50'}`}
            disabled={comment.length === 0}
            onPress={handleSubmitComment}
          >
            <Ionicons name="send" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CommentsScreen; 