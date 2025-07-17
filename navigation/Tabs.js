import React from 'react';
import { Text, View, Platform } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import FindScreen from '../screens/FindScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CollectionScreen from '../screens/CollectionScreen';
import PostScreen from '../screens/PostScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import RestaurantProfileScreen from '../screens/RestaurantProfileScreen';
import CommentsScreen from '../screens/CommentsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="RestaurantProfile" component={RestaurantProfileScreen} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
    </Stack.Navigator>
  );
};

const FindStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FindMain" component={FindScreen} />
      <Stack.Screen name="RestaurantProfile" component={RestaurantProfileScreen} />
    </Stack.Navigator>
  );
};

const CollectionStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CollectionMain" component={CollectionScreen} />
      <Stack.Screen name="RestaurantProfile" component={RestaurantProfileScreen} />
    </Stack.Navigator>
  );
};

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 25 : 15,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 15,
          height: 60,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.5,
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View className="items-center justify-center">
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={22}
                color={focused ? "#3B82F6" : "#666"}
              />
              <Text className={`text-xs mt-0.5 ${focused ? "text-blue-500 font-medium" : "text-gray-500"}`}>Home</Text>
            </View>
          ),
        }} 
      />
      
      <Tab.Screen 
        name="Find" 
        component={FindStack} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View className="items-center justify-center">
              <Ionicons
                name={focused ? "search" : "search-outline"}
                size={22}
                color={focused ? "#3B82F6" : "#666"}
              />
              <Text className={`text-xs mt-0.5 ${focused ? "text-blue-500 font-medium" : "text-gray-500"}`}>Find</Text>
            </View>
          ),
        }} 
      />
      
      <Tab.Screen 
        name="Post" 
        component={PostScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center" 
              style={{
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 4,
                marginBottom: 5,
              }}
            >
              <Ionicons name="add" size={28} color="#fff" />
            </View>
          ),
          tabBarLabel: '',
        }} 
      />
      
      <Tab.Screen 
        name="Collection" 
        component={CollectionStack} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View className="items-center justify-center">
              <Ionicons
                name={focused ? "bookmark" : "bookmark-outline"}
                size={22}
                color={focused ? "#3B82F6" : "#666"}
              />
              <Text className={`text-xs mt-0.5 ${focused ? "text-blue-500 font-medium" : "text-gray-500"}`}>Save</Text>
            </View>
          ),
        }} 
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View className="items-center justify-center">
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={22}
                color={focused ? "#3B82F6" : "#666"}
              />
              <Text className={`text-xs mt-0.5 ${focused ? "text-blue-500 font-medium" : "text-gray-500"}`}>Profile</Text>
            </View>
          ),
        }} 
      />
    </Tab.Navigator>
  );
};

export default Tabs;
