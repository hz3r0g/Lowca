import React from 'react';
import { StyleSheet, Text, View, Image, Platform, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from '../screens/HomeScreen';
import FindScreen from '../screens/FindScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CollectionScreen from '../screens/CollectionScreen';
import PostScreen from '../screens/PostScreen';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          elevation: 5,
          backgroundColor: '#fff',
          height: 80,
          },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: ({ focused }) => (
          <View style={styles.iconContainer}>
            <Image
              source={require('../assets/icon/house.png')}
              resizeMode="contain"
              style={{
                width: 26,
                height: 26,
                tintColor: focused ? '#222' : '#888',
              }}
            />
            <Text style={{ color: focused ? '#222' : '#888', fontSize: 11, marginTop: 2 }}>Home</Text>
          </View>
        ),
      }} />
      <Tab.Screen name="Find" component={FindScreen} options={{
        tabBarIcon: ({ focused }) => (
          <View style={styles.iconContainer}>
            <Image
              source={require('../assets/icon/magnifying-glass.png')}
              resizeMode="contain"
              style={{
                width: 26,
                height: 26,
                tintColor: focused ? '#222' : '#888',
              }}
            />
            <Text style={{ color: focused ? '#222' : '#888', fontSize: 11, marginTop: 2 }}>Find</Text>
          </View>
        ),
      }} />
      <Tab.Screen name="Post" component={PostScreen} options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.fabContainer}>
              <View style={[styles.fab, focused && styles.fabFocused]}>
                <Image
                  source={require('../assets/icon/plus.png')}
                  resizeMode="contain"
                  style={{ width: 36, height: 36, tintColor: '#fff' }}
                />
              </View>
            </View>
          ),
          tabBarLabel: '',
      }} />
      <Tab.Screen name="Collection" component={CollectionScreen} options={{
        tabBarIcon: ({ focused }) => (
          <View style={styles.iconContainer}>
            <Image
              source={require('../assets/icon/bookmark.png')}
              resizeMode="contain"
              style={{
                width: 26,
                height: 26,
                tintColor: focused ? '#222' : '#888',
              }}
            />
            <Text style={{ color: focused ? '#222' : '#888', fontSize: 11, marginTop: 2 }}>Save</Text>
          </View>
        ),
      }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        tabBarIcon: ({ focused }) => (
          <View style={{alignItems: 'center', justifyContent: 'center', top: 15}}>          
            <Image
              source={require('../assets/icon/user-circle.png')}
              resizeMode="contain"
              style={{
                width: 26,
                height: 26,
                tintColor: focused ? '#222' : '#888',
              }}
            />
            <Text style={{ color: focused ? '#222' : '#888', fontSize: 11, marginTop: 2 }}>Profile</Text>
          </View>
        ),
      }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 10,
  },
  fabContainer: {
    position: 'absolute',
    top: -35,
    alignSelf: 'center',
    zIndex: 10,
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#d32f2f',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
  },
  fabFocused: {
    backgroundColor: '#d32f2f',
  },
});

export default Tabs;
