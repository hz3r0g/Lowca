import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const FilterOption = ({ label, isSelected, onPress }) => (
  <TouchableOpacity 
    className={`rounded-full px-4 py-2 mr-2 mb-2 ${isSelected ? 'bg-blue-500' : 'bg-gray-100'}`}
    onPress={onPress}
  >
    <Text className={`${isSelected ? 'text-white font-medium' : 'text-gray-700'}`}>{label}</Text>
  </TouchableOpacity>
);

export default FilterOption; 