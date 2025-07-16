import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const menuData = [
  {
    id: '1',
    name: 'Chocolate Freeze',
    price: 45000,
    image: require('../assets/img/chocolate.png'),
    bgColor: '#CDE7BE',
  },
  {
    id: '2',
    name: 'Chocolate Freeze',
    price: 45000,
    image: require('../assets/img/chocolate.png'),
    bgColor: '#FFE180',
  },
  {
    id: '3',
    name: 'Chocolate Freeze',
    price: 45000,
    image: require('../assets/img/chocolate.png'),
    bgColor: '#CDE7BE',
  },
];

const HomeScreen = () => {
  const renderMenuItem = ({ item }) => (
    <View style={[styles.menuCard, { backgroundColor: item.bgColor }]}>  
      <View style={styles.menuInfo}>
        <Text style={styles.menuName}>{item.name}</Text>
        <View style={styles.menuPriceRow}>
          <Ionicons name="cash-outline" size={24} color="#222" />
          <Text style={styles.menuPrice}>{item.price}</Text>
        </View>
      </View>
      <View style={styles.menuImageWrap}>
        <Image source={item.image} style={styles.menuImage} />
      </View>
      <TouchableOpacity style={styles.menuArrow}>
        <Ionicons name="chevron-forward" size={28} color="#222" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Ionicons name="restaurant-outline" size={28} color="#222" style={{marginRight: 4}} />
          <Text style={styles.logoText}>Lowca</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="search" size={22} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="notifications" size={22} color="#222" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting */}
      <View>
        <Text style={styles.greeting}>Hello, User</Text>
        <Text style={styles.title}>Let's check what we have today !!!</Text>
      </View>


      {/* Menu List */}
      <FlatList
        data={menuData}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<SuggestionSection />}
      />
    </View>
  );
}

const suggestionData = {
  title: 'Chocolate',
  subtitle: 'Ellie - Quán cà phê lỗi thời',
  image: require('../assets/img/templateposter.jpg'),
  tags: ['New', 'Highly Rated', 'Snacks'],
};

const SuggestionSection = () => (
  <View style={styles.suggestionSection}>
    <View style={styles.suggestionHeader}>
      <Text style={styles.suggestionTitle}>Based on Your Tastes</Text>
      <TouchableOpacity>
        <Ionicons name="add-circle-outline" size={22} color="#222" />
      </TouchableOpacity>
    </View>
    <View style={styles.suggestionCardNewSection}>
      <View style={styles.suggestionCardNew}>
        <View style={styles.suggestionImageOuter}>
          <Image source={suggestionData.image} style={styles.suggestionImageNew} />
        </View>
        <View style={styles.suggestionContentWrap}>
          <View style={styles.suggestionContentRow}>
            <View style={{flex: 1}}>
              <Text style={styles.suggestionFood}>{suggestionData.title}</Text>
              <Text style={styles.suggestionPlace}>{suggestionData.subtitle}</Text>
            </View>
            <View style={styles.suggestionActionsRow}>
              <TouchableOpacity>
                <Ionicons name="heart-outline" size={20} color="#222" />
              </TouchableOpacity>
              <TouchableOpacity style={{marginLeft: 8}}>
                <Ionicons name="ellipsis-vertical" size={18} color="#222" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.suggestionTagsRowNew}>
            {suggestionData.tags.map(tag => (
              <View key={tag} style={styles.suggestionTagNew}><Text style={styles.suggestionTagText}>{tag}</Text></View>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.suggestionCardNew}>
        <View style={styles.suggestionImageOuter}>
          <Image source={suggestionData.image} style={styles.suggestionImageNew} />
        </View>
        <View style={styles.suggestionContentWrap}>
          <View style={styles.suggestionContentRow}>
            <View style={{flex: 1}}>
              <Text style={styles.suggestionFood}>{suggestionData.title}</Text>
              <Text style={styles.suggestionPlace}>{suggestionData.subtitle}</Text>
            </View>
            <View style={styles.suggestionActionsRow}>
              <TouchableOpacity>
                <Ionicons name="heart-outline" size={20} color="#222" />
              </TouchableOpacity>
              <TouchableOpacity style={{marginLeft: 8}}>
                <Ionicons name="ellipsis-vertical" size={18} color="#222" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.suggestionTagsRowNew}>
            {suggestionData.tags.map(tag => (
              <View key={tag} style={styles.suggestionTagNew}><Text style={styles.suggestionTagText}>{tag}</Text></View>
            ))}
          </View>
        </View>
      </View>
    </View>
  </View>
);

export default HomeScreen;

const { width } = Dimensions.get('window');
const CARD_HEIGHT = 110;

const styles = StyleSheet.create({
  // Suggestion section
  suggestionSection: {
    marginTop: 8,
    marginBottom: 120,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
    overflow: 'hidden',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  suggestionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
  },
  suggestionCardNewSection: {
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    backgroundColor: '#ffffffff',
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 18,
  },
  suggestionCardNew: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingBottom: 16,
    borderRadius: 23,
  },
  suggestionImageOuter: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#000000ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    marginBottom: 0,
  },
  suggestionImageNew: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  suggestionContentWrap: {
    width: '316',
    paddingHorizontal: 18,
    marginTop: 10,
    
  },
  suggestionContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  suggestionFood: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  suggestionPlace: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
  suggestionActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  suggestionTagsRowNew: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  suggestionTagNew: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#b5c9e3',
  },
  suggestionTagText: {
    fontSize: 12,
    color: '#3a5a8c',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    marginLeft: 10,
    borderWidth: 2,
    borderColor: '#222',
    borderRadius: 50,
    padding: 6,
  },
  greeting: {
    fontSize: 18,
    color: '#444',
    marginTop: 8,
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 90,
    height: CARD_HEIGHT,
    marginBottom: 18,
    paddingHorizontal: 18,
    paddingLeft: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  menuInfo: {
    flex: 1.2,
    justifyContent: 'center',
  },
  menuName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  menuPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuPrice: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 6,
    color: '#444',
  },
  menuImageWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    borderRadius: 80,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  menuArrow: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
