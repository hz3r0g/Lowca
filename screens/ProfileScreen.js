import React from "react";
import { Text, View, Button } from "react-native";

const ProfileScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold mb-4">Profile</Text>
      <Button title="Press Me" onPress={() => alert("Button pressed!")} />
    </View>
  );
};

export default ProfileScreen;
