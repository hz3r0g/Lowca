import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StatusBar, Animated, Easing, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

// Mock data for notifications
const mockNotifications = [
  {
    id: '1',
    type: 'like',
    title: 'Nguyễn Văn A đã thích bài viết của bạn',
    content: 'Phở Hà Nội - Hương vị mới đã về!',
    time: '5 phút trước',
    read: false,
    image: require('../assets/img/avatar.png'),
    relatedId: 'post-123'
  },
  {
    id: '2',
    type: 'comment',
    title: 'Trần Thị B đã bình luận về bài viết của bạn',
    content: 'Món này trông ngon quá! Cho mình xin địa chỉ với.',
    time: '30 phút trước',
    read: false,
    image: require('../assets/img/avatar.png'),
    relatedId: 'post-123'
  },
  {
    id: '3',
    type: 'follow',
    title: 'Lê Văn C đã theo dõi bạn',
    content: '',
    time: '2 giờ trước',
    read: true,
    image: require('../assets/img/avatar.png'),
    relatedId: 'user-456'
  },
  {
    id: '4',
    type: 'new_restaurant',
    title: 'Quán mới gần bạn',
    content: 'Bún Bò Huế 79 vừa mở cách bạn 1.2km',
    time: '1 ngày trước',
    read: true,
    image: require('../assets/img/templateposter.jpg'),
    relatedId: 'restaurant-789'
  },
  {
    id: '5',
    type: 'promotion',
    title: 'Ưu đãi đặc biệt',
    content: 'Giảm 15% tại Phở Hà Nội vào cuối tuần này',
    time: '2 ngày trước',
    read: true,
    image: require('../assets/img/templateposter.jpg'),
    relatedId: 'promo-101'
  },
  {
    id: '6',
    type: 'system',
    title: 'Cập nhật ứng dụng',
    content: 'Lowca đã được cập nhật lên phiên bản mới nhất',
    time: '1 tuần trước',
    read: true,
    image: null,
    relatedId: 'system-202'
  },
];

// Group notifications by date
const groupNotificationsByDate = (notifications) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const groups = {
    'Hôm nay': [],
    'Hôm qua': [],
    'Tuần này': [],
    'Tháng này': [],
  };
  
  notifications.forEach(notification => {
    // This is a simplified grouping logic
    if (notification.time.includes('phút') || notification.time.includes('giờ')) {
      groups['Hôm nay'].push(notification);
    } else if (notification.time.includes('1 ngày')) {
      groups['Hôm qua'].push(notification);
    } else if (notification.time.includes('ngày') || notification.time.includes('tuần')) {
      groups['Tuần này'].push(notification);
    } else {
      groups['Tháng này'].push(notification);
    }
  });
  
  // Remove empty groups
  return Object.entries(groups)
    .filter(([_, notifications]) => notifications.length > 0)
    .map(([title, data]) => ({ title, data }));
};

const SCREEN_WIDTH = Dimensions.get('window').width;

// NotificationItem component để dùng hook hợp lệ
const NotificationItem = ({ item, index, onPress, getNotificationIcon }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(20)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 60,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY },
          { scale: scaleAnim },
        ],
        marginHorizontal: 12,
        marginTop: 12,
        borderRadius: 18,
        backgroundColor: !item.read ? '#EFF6FF' : '#fff',
        shadowColor: !item.read ? '#3B82F6' : '#000',
        shadowOffset: { width: 0, height: !item.read ? 4 : 1 },
        shadowOpacity: !item.read ? 0.10 : 0.04,
        shadowRadius: !item.read ? 10 : 4,
        elevation: !item.read ? 4 : 1,
      }}
    >
      <Pressable
        android_ripple={{ color: '#DBEAFE' }}
        style={{ borderRadius: 18 }}
        onPress={() => onPress(item, scaleAnim)}
      >
        <View className="flex-row p-4 items-center">
          <View className="mr-3 mt-1">
            {getNotificationIcon(item.type)}
          </View>
          <View className="flex-1">
            <Text className={`text-gray-800 ${!item.read ? 'font-bold' : 'font-medium'}`}>{item.title}</Text>
            {item.content ? (
              <Text className="text-gray-500 mt-1" numberOfLines={2}>{item.content}</Text>
            ) : null}
            <Text className="text-gray-400 text-xs mt-1">{item.time}</Text>
          </View>
          {item.image && (
            <View className="ml-2">
              <Image
                source={item.image}
                className="w-12 h-12 rounded-lg"
                resizeMode="cover"
              />
            </View>
          )}
          {!item.read && (
            <View className="w-2 h-2 rounded-full bg-blue-500 absolute top-4 right-4" />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const NotificationsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'
  const [notifications, setNotifications] = useState(mockNotifications);
  const underlineAnim = useRef(new Animated.Value(0)).current;

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(item => !item.read);

  // Group notifications
  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  // Mark all as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(item => ({
      ...item,
      read: true
    }));
    setNotifications(updatedNotifications);
  };

  // Mark a single notification as read
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(item => 
      item.id === id ? { ...item, read: true } : item
    );
    setNotifications(updatedNotifications);
  };

  // Handle notification press
  const handleNotificationPress = (notification, scaleAnim) => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true })
    ]).start(() => {
      markAsRead(notification.id);
      if (notification.type === 'like' || notification.type === 'comment') {
        navigation.navigate('PostDetail', { postId: notification.relatedId });
      } else if (notification.type === 'follow') {
        navigation.navigate('Profile', { userId: notification.relatedId });
      } else if (notification.type === 'new_restaurant' || notification.type === 'promotion') {
        navigation.navigate('RestaurantProfile', { restaurantId: notification.relatedId });
      }
    });
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Ionicons name="heart" size={20} color="#F87171" />;
      case 'comment':
        return <Ionicons name="chatbubble" size={20} color="#3B82F6" />;
      case 'follow':
        return <Ionicons name="person-add" size={20} color="#10B981" />;
      case 'new_restaurant':
        return <Ionicons name="restaurant" size={20} color="#F59E0B" />;
      case 'promotion':
        return <Ionicons name="pricetag" size={20} color="#8B5CF6" />;
      case 'system':
        return <Ionicons name="information-circle" size={20} color="#6B7280" />;
      default:
        return <Ionicons name="notifications" size={20} color="#6B7280" />;
    }
  };

  // Animated underline for tab
  const moveUnderline = (tab) => {
    Animated.timing(underlineAnim, {
      toValue: tab === 'all' ? 0 : 1,
      duration: 220,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  };

  // Render notification item với component con
  const renderNotificationItem = ({ item, index }) => (
    <NotificationItem
      item={item}
      index={index}
      onPress={handleNotificationPress}
      getNotificationIcon={getNotificationIcon}
    />
  );

  // Render section header
  const renderSectionHeader = ({ section }) => (
    <View className="bg-gray-50 px-4 py-2 mt-6">
      <Text className="text-gray-500 font-medium">{section.title}</Text>
    </View>
  );

  // Underline style
  const underlineWidth = SCREEN_WIDTH / 4;
  const underlineLeft = underlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 16 + underlineWidth],
  });

  return (
    <SafeAreaWrapper className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center rounded-full"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Thông báo</Text>
        <TouchableOpacity
          onPress={markAllAsRead}
          className="h-10 items-center justify-center"
        >
          <Text className="text-blue-500 font-medium">Đánh dấu đã đọc</Text>
        </TouchableOpacity>
      </View>
      {/* Tab Selector with animated underline */}
      <View className="px-4 pt-2 pb-1">
        <View className="flex-row relative">
          <TouchableOpacity
            style={{ width: underlineWidth }}
            className="items-center"
            onPress={() => { setActiveTab('all'); moveUnderline('all'); }}
          >
            <Text className={`font-medium pb-2 ${activeTab === 'all' ? 'text-blue-500' : 'text-gray-500'}`}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: underlineWidth }}
            className="items-center"
            onPress={() => { setActiveTab('unread'); moveUnderline('unread'); }}
          >
            <Text className={`font-medium pb-2 ${activeTab === 'unread' ? 'text-blue-500' : 'text-gray-500'}`}>Chưa đọc</Text>
          </TouchableOpacity>
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 0,
              left: underlineLeft,
              width: underlineWidth - 32,
              height: 3,
              backgroundColor: '#3B82F6',
              borderRadius: 2,
            }}
          />
        </View>
      </View>
      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <FlatList
          data={groupedNotifications}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <View>
              {renderSectionHeader({ section: item })}
              {item.data.map((notification, idx) => (
                <View key={notification.id}>
                  {renderNotificationItem({ item: notification, index: idx })}
                </View>
              ))}
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="notifications-off-outline" size={60} color="#CBD5E1" />
          <Text className="text-gray-400 mt-4 text-lg font-medium">
            {activeTab === 'all' ? 'Không có thông báo nào' : 'Không có thông báo chưa đọc'}
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            {activeTab === 'all' 
              ? 'Bạn sẽ nhận được thông báo khi có hoạt động mới' 
              : 'Tất cả thông báo đã được đánh dấu là đã đọc'}
          </Text>
        </View>
      )}
    </SafeAreaWrapper>
  );
};

export default NotificationsScreen; 