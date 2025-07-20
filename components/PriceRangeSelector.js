import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PriceRangeSelector = ({ selectedPrice, onSelectPrice }) => {
  // Define price ranges
  const priceRanges = [
    { id: 'any', label: 'Bất kỳ' },
    { id: '0-50000', label: 'Dưới 50K' },
    { id: '50000-150000', label: 'Từ 50K-150K' },
    { id: '150000-300000', label: 'Từ 150K-300K' },
    { id: '300000-1000000', label: 'Trên 300K' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Khoảng giá</Text>
      <View style={styles.optionsContainer}>
        {priceRanges.map((range) => (
          <TouchableOpacity
            key={range.id}
            style={[
              styles.option,
              selectedPrice === range.id && styles.selectedOption,
            ]}
            onPress={() => onSelectPrice(range.id)}
          >
            <Text 
              style={[
                styles.optionText,
                selectedPrice === range.id && styles.selectedOptionText,
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  option: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    backgroundColor: '#EBF5FF',
    borderColor: '#4A7DFF',
  },
  optionText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#4A7DFF',
    fontWeight: '600',
  },
});

export default PriceRangeSelector; 