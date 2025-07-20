import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categoryData } from '../utils/mockData';

const CategorySelector = ({ selectedCategory, selectedSubCategories, onCategoryChange, onSubCategoriesChange }) => {
  const [activeCategory, setActiveCategory] = useState(selectedCategory || 'all');
  const [activeSubCategories, setActiveSubCategories] = useState(selectedSubCategories || []);
  
  // Update local state when props change
  useEffect(() => {
    if (selectedCategory !== undefined) {
      setActiveCategory(selectedCategory);
    }
    if (selectedSubCategories) {
      setActiveSubCategories(selectedSubCategories);
    }
  }, [selectedCategory, selectedSubCategories]);
  
  // Get subcategories for the active main category
  const getActiveSubcategories = () => {
    const category = categoryData.find(cat => cat.id === activeCategory);
    return category ? category.subcategories : [];
  };
  
  // Get active category name
  const getActiveCategoryName = () => {
    const category = categoryData.find(cat => cat.id === activeCategory);
    return category ? category.name : '';
  };
  
  // Handle main category selection
  const handleCategoryPress = (categoryId) => {
    setActiveCategory(categoryId);
    onCategoryChange(categoryId);
  };
  
  // Handle subcategory selection
  const handleSubCategoryPress = (subCategoryId) => {
    let newSubCategories;
    
    if (activeSubCategories.includes(subCategoryId)) {
      // Remove if already selected
      newSubCategories = activeSubCategories.filter(id => id !== subCategoryId);
    } else {
      // Add if not selected
      newSubCategories = [...activeSubCategories, subCategoryId];
    }
    
    setActiveSubCategories(newSubCategories);
    onSubCategoriesChange(newSubCategories);
  };
  
  // Check if a subcategory is selected
  const isSubCategorySelected = (subCategoryId) => {
    return activeSubCategories.includes(subCategoryId);
  };
  
  // Get icon for category
  const getCategoryIcon = (categoryId) => {
    const category = categoryData.find(cat => cat.id === categoryId);
    return category ? category.icon : 'help-circle';
  };
  
  // Render category tab item
  const renderCategoryTab = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.tab,
        activeCategory === item.id && styles.activeTab
      ]}
      onPress={() => handleCategoryPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer,
        activeCategory === item.id && styles.activeIconContainer
      ]}>
        <Ionicons 
          name={item.icon} 
          size={22} 
          color={activeCategory === item.id ? '#FFFFFF' : '#4B5563'} 
        />
        {activeCategory === item.id && (
          <View style={styles.activeIndicator} />
        )}
      </View>
      <Text 
        style={[
          styles.tabText,
          activeCategory === item.id && styles.activeTabText
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View>
      <Text style={styles.title}>Danh mục</Text>
      
      {/* Main Categories (Tabs) - Sử dụng FlatList thay vì ScrollView */}
      <View style={styles.tabsContainer}>
        <FlatList
          horizontal
          data={categoryData}
          renderItem={renderCategoryTab}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        />
      </View>
      
      {/* Category Title */}
      <View style={styles.categoryTitleContainer}>
        <Text style={styles.categoryTitle}>{getActiveCategoryName()}</Text>
        {activeSubCategories.length > 0 && (
          <View style={styles.selectedCountBadge}>
            <Text style={styles.selectedCountText}>{activeSubCategories.length}</Text>
          </View>
        )}
      </View>
      
      {/* Subcategories (Chips) - Only show if not "All" category */}
      {activeCategory !== 'all' && (
        <View style={styles.subCategoriesContainer}>
          <FlatList
            data={getActiveSubcategories()}
            numColumns={2}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={styles.subCategoryRow}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.subCategoryChip,
                  isSubCategorySelected(item.id) && styles.selectedSubCategoryChip
                ]}
                onPress={() => handleSubCategoryPress(item.id)}
                activeOpacity={0.7}
              >
                <Text 
                  style={[
                    styles.subCategoryText,
                    isSubCategorySelected(item.id) && styles.selectedSubCategoryText
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
                {isSubCategorySelected(item.id) ? (
                  <View style={styles.checkIconContainer}>
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                ) : (
                  <View style={styles.addIconContainer}>
                    <Ionicons name="add" size={14} color="#4A7DFF" />
                  </View>
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.subCategoriesGrid}
          />
        </View>
      )}
      
      {/* All category message */}
      {activeCategory === 'all' && (
        <View style={styles.allCategoryMessage}>
          <Ionicons name="checkmark-circle" size={22} color="#4A7DFF" style={styles.allCategoryIcon} />
          <Text style={styles.allCategoryText}>Hiển thị tất cả các địa điểm</Text>
          <Text style={styles.allCategorySubText}>Chọn danh mục khác để lọc theo loại địa điểm</Text>
        </View>
      )}
      
      {/* Selected subcategories summary */}
      {activeSubCategories.length > 0 && activeCategory !== 'all' && (
        <View style={styles.selectedSummary}>
          <Text style={styles.selectedSummaryText}>
            {activeSubCategories.length} danh mục đã chọn
          </Text>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => {
              setActiveSubCategories([]);
              onSubCategoriesChange([]);
            }}
          >
            <Text style={styles.clearButtonText}>Xóa tất cả</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  tabsContainer: {
    marginBottom: 20,
  },
  tabsScrollContent: {
    paddingRight: 16,
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    width: 70,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  activeIconContainer: {
    backgroundColor: '#4A7DFF',
    shadowColor: '#4A7DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#4A7DFF',
    fontWeight: '600',
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  selectedCountBadge: {
    backgroundColor: '#4A7DFF',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  selectedCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  subCategoriesContainer: {
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  subCategoriesGrid: {
    paddingBottom: 8,
  },
  subCategoryRow: {
    justifyContent: 'space-between',
  },
  subCategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    width: '48.5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedSubCategoryChip: {
    backgroundColor: '#EBF5FF',
    borderColor: '#4A7DFF',
    transform: [{ scale: 1.02 }],
    shadowColor: '#4A7DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  subCategoryText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '400',
    flex: 1,
  },
  selectedSubCategoryText: {
    color: '#4A7DFF',
    fontWeight: '500',
  },
  checkIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4A7DFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  selectedSummaryText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#4A7DFF',
    fontWeight: '500',
  },
  allCategoryMessage: {
    padding: 16,
    backgroundColor: '#EBF5FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  allCategoryText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 4,
  },
  allCategorySubText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  allCategoryIcon: {
    marginBottom: 8,
  },
});

export default CategorySelector; 