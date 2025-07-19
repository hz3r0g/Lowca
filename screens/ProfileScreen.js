

import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, Pressable, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Animated } from 'react-native';

const stats = [
  { label: "Following", value: "36", icon: <Ionicons name="person-add-outline" size={24} color="#000000" /> },
  { label: "Comments", value: "36", icon: <Ionicons name="chatbox-ellipses-outline" size={24} color="#000000" /> },
  { label: "Likes", value: "36", icon: <Ionicons name="thumbs-up-outline" size={24} color="#000000" /> },
];

const menu = [
  { label: "Personal", icon: <Ionicons name="person-outline" size={22} color="#000000" /> },
  { label: "General", icon: <Ionicons name="settings-outline" size={22} color="#000000" /> },
  { label: "Help", icon: <Ionicons name="help-circle-outline" size={22} color="#000000" /> },
];

const ProfileScreen = () => {
  const [showEditList, setShowEditList] = useState(false);
  const [showGeneralList, setShowGeneralList] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [switchAnim] = useState(new Animated.Value(0));
  const [name, setName] = useState("DatOneGuy");
  const [email, setEmail] = useState("DatOneGuy@gmail.com");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");

  const handleMenuPress = (idx) => {
    if (idx === 0) setShowEditList((prev) => !prev);
    if (idx === 1) setShowGeneralList((prev) => !prev);
    // Có thể thêm chức năng cho các mục khác
  };

  return (
    <ScrollView className="flex-1 bg-[#f7f8fa]" contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Title */}
      <View className="items-center mt-12 mb-2">
        <Text className="text-2xl font-bold tracking-wide text-gray-800">Profile</Text>
      </View>

      {/* Header */}
      <View className="items-center mb-6 relative">
        <View className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-200 shadow-lg bg-white justify-center items-center">
          <Image
            source={require("../assets/img/poster.jpg")}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text className="text-xl font-bold mt-2 text-gray-800">{name}</Text>
        <Text className="text-gray-500 mt-1">{email}</Text>
      </View>

      {/* Stats */}
      <View className="flex-row justify-center mb-8 px-4">
        {stats.map((item, idx) => (
          <View
            key={idx}
            className="items-center bg-white rounded-xl py-2 shadow-sm mx-2"
            style={{ width: 100 }}
          >
            <View className="mb-1">{item.icon}</View>
            <Text className="font-bold text-base text-gray-800">{item.value}</Text>
            <Text className="text-xs text-gray-400 mt-1">{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      <View className="mx-6 bg-white rounded-2xl py-2 shadow-lg">
        {menu.map((item, idx) => (
          <View key={idx}>
            <TouchableOpacity
              className={`flex-row items-center justify-between px-4 py-4 ${idx !== menu.length-1 ? 'border-b border-gray-100' : ''}`}
              onPress={() => handleMenuPress(idx)}
            >
              <View className="flex-row items-center">
                <View className="mr-3">{item.icon}</View>
                <Text className="text-base text-gray-700 font-medium">{item.label}</Text>
              </View>
              <Text className="text-gray-400 text-lg">›</Text>
            </TouchableOpacity>
            {/* List chỉnh thông tin cá nhân xuất hiện dưới nút Personal */}
            {idx === 0 && showEditList && (
              <View className="px-4 py-4">
                <View className="mb-3">
                  <Text className="text-sm text-gray-600 mb-1 font-bold">Name</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10 }}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
                <View className="mb-3">
                  <Text className="text-sm text-gray-600 mb-1 font-bold">Email</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10 }}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                  />
                </View>
                <View className="mb-3">
                  <Text className="text-sm text-gray-600 mb-1 font-bold">Date of Birth</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10 }}
                    placeholder="Date of Birth (dd/mm/yyyy)"
                    value={dob}
                    onChangeText={setDob}
                  />
                </View>
                <View className="mb-3">
                  <Text className="text-sm text-gray-600 mb-1 font-bold">Phone Number</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10 }}
                    placeholder="Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
                <View className="mb-3">
                  <Text className="text-sm text-gray-600 mb-1 font-bold">Gender</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10 }}
                    placeholder="Gender"
                    value={gender}
                    onChangeText={setGender}
                  />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                  <Pressable
                    style={{ paddingVertical: 8, paddingHorizontal: 18, backgroundColor: '#3B82F6', borderRadius: 8, marginRight: 8 }}
                    onPress={() => setShowEditList(false)}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
                  </Pressable>
                  <Pressable
                    style={{ paddingVertical: 8, paddingHorizontal: 18, backgroundColor: '#e5e7eb', borderRadius: 8 }}
                    onPress={() => setShowEditList(false)}
                  >
                    <Text style={{ color: '#374151', fontWeight: 'bold' }}>Close</Text>
                  </Pressable>
                </View>
              </View>
            )}
            {/* List chức năng General xuất hiện dưới nút General */}
            {idx === 1 && showGeneralList && (
              <View className="px-4 py-4">
                {/* Các chức năng khác - Chế độ sáng/tối lên trên */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, justifyContent: 'space-between' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: isDarkMode ? '#1f2937' : '#374151' }}>
                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                  </Text>
                  <Pressable
                    onPress={() => {
                      Animated.timing(switchAnim, {
                        toValue: isDarkMode ? 0 : 1,
                        duration: 300,
                        useNativeDriver: false,
                      }).start();
                      setIsDarkMode((prev) => !prev);
                    }}
                  >
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6',
                      borderRadius: 32,
                      width: 100,
                      height: 44,
                      padding: 4,
                      position: 'relative',
                    }}>
                      <Animated.View style={{
                        position: 'absolute',
                        left: switchAnim.interpolate({ inputRange: [0, 1], outputRange: [4, 60] }),
                        top: 4,
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: isDarkMode ? '#f3f4f6' : '#fff',
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                        zIndex: 2,
                      }}>
                        {isDarkMode
                          ? <Ionicons name="moon" size={24} color="#1f2937" />
                          : <Ionicons name="sunny" size={24} color="#f59e42" />}
                      </Animated.View>
                      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, zIndex: 1 }}>
                        <Ionicons name="sunny" size={22} color={isDarkMode ? '#f3f4f6' : '#f59e42'} />
                        <Ionicons name="moon" size={22} color={isDarkMode ? '#f59e42' : '#1f2937'} />
                      </View>
                    </View>
                  </Pressable>
                </View>
                {/* Đổi mật khẩu */}
                <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12, color: '#1f2937' }}>Change Password</Text>
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontSize: 13, color: '#374151', marginBottom: 4, fontWeight: 'bold' }}>Old Password</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, backgroundColor: '#f3f4f6' }}
                    placeholder="Old Password"
                    secureTextEntry
                  />
                </View>
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontSize: 13, color: '#374151', marginBottom: 4, fontWeight: 'bold' }}>New Password</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, backgroundColor: '#f3f4f6' }}
                    placeholder="New Password"
                    secureTextEntry
                  />
                </View>
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontSize: 13, color: '#374151', marginBottom: 4, fontWeight: 'bold' }}>Comfirm Password</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, backgroundColor: '#f3f4f6' }}
                    placeholder="Comfirm Password"
                    secureTextEntry
                  />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, marginBottom: 10 }}>
                  <Pressable
                    style={{ paddingVertical: 8, paddingHorizontal: 18, backgroundColor: '#3B82F6', borderRadius: 8, marginRight: 8 }}
                    onPress={() => alert('Lưu mật khẩu mới')}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
                  </Pressable>
                  <Pressable
                    style={{ paddingVertical: 8, paddingHorizontal: 18, backgroundColor: '#e5e7eb', borderRadius: 8 }}
                    onPress={() => setShowGeneralList(false)}
                  >
                    <Text style={{ color: '#374151', fontWeight: 'bold' }}>Close</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={{ paddingVertical: 12, paddingHorizontal: 18, backgroundColor: '#fee2e2', borderRadius: 8, marginTop: 16, marginBottom: 8, alignItems: 'center' }}
                  onPress={() => alert('Chức năng xóa tài khoản')}
                >
                  <Text style={{ color: '#b91c1c', fontWeight: 'bold', textAlign: 'center' }}>Delete Account</Text>
                </Pressable>
              </View>
            )}
          </View>
        ))}
      </View>

    </ScrollView>
  );
};

export default ProfileScreen;
