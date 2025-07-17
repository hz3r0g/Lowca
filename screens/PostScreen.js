import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PostScreen = () => {
  const [postText, setPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  
  // Mock function to add an image
  const handleAddImage = () => {
    // In a real app, this would open the image picker
    // For now, we'll just add a placeholder image
    setSelectedImages([...selectedImages, require('../assets/img/templateposter.jpg')]);
  };
  
  // Mock function to remove an image
  const handleRemoveImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  return (
    <ScrollView className="flex-1 bg-white pt-8 px-4">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-2xl font-bold text-gray-800">Create Post</Text>
        <TouchableOpacity 
          className={`rounded-full py-2 px-5 ${postText.length > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
          disabled={postText.length === 0}
        >
          <Text className={`font-medium ${postText.length > 0 ? 'text-white' : 'text-gray-500'}`}>
            Post
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* User info */}
      <View className="flex-row items-center mb-4">
        <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
          <Ionicons name="person" size={24} color="#666" />
        </View>
        <View className="ml-3">
          <Text className="font-semibold text-gray-800">Your Name</Text>
          <Text className="text-xs text-gray-500">Public post</Text>
        </View>
      </View>
      
      {/* Post input */}
      <TextInput
        className="text-base text-gray-800 min-h-[120px] mb-4"
        placeholder="What's on your mind?"
        multiline
        value={postText}
        onChangeText={setPostText}
      />
      
      {/* Selected images */}
      {selectedImages.length > 0 && (
        <View className="flex-row flex-wrap mb-4">
          {selectedImages.map((image, index) => (
            <View key={index} className="relative mr-2 mb-2">
              <Image source={image} className="w-24 h-24 rounded-lg" />
              <TouchableOpacity 
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                onPress={() => handleRemoveImage(index)}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      
      {/* Action buttons */}
      <View className="flex-row border-t border-gray-200 pt-4 mt-2">
        <TouchableOpacity className="flex-row items-center mr-6" onPress={handleAddImage}>
          <Ionicons name="image" size={24} color="#4CAF50" />
          <Text className="ml-2 text-gray-700">Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center mr-6">
          <Ionicons name="location" size={24} color="#FF9800" />
          <Text className="ml-2 text-gray-700">Check in</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="happy" size={24} color="#F44336" />
          <Text className="ml-2 text-gray-700">Feeling</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PostScreen;
