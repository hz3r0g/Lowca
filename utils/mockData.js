// Mock data for search results
export const restaurantsData = [
  {
    id: '1',
    name: 'Phuc Long Coffee',
    type: 'Cafe',
    cuisine: 'Vietnamese',
    price: '$$',
    rating: 4.5,
    image: require('../assets/img/phuclong.jpg'),
    coordinates: {
      latitude: 10.7769,
      longitude: 106.7009,
    },
    address: '42 Nguyen Hue Boulevard, District 1',
    description: 'Popular Vietnamese coffee chain with a wide selection of teas and coffees.',
    openingHours: '7:00 AM - 10:00 PM',
  },
  {
    id: '2',
    name: 'Burger Joint',
    type: 'Fast Food',
    cuisine: 'American',
    price: '$',
    rating: 4.2,
    coordinates: {
      latitude: 10.7782,
      longitude: 106.7032,
    },
    address: '15 Le Loi Street, District 1',
    description: 'Classic American burgers and fries in a casual setting.',
    openingHours: '10:00 AM - 9:00 PM',
  },
  {
    id: '3',
    name: 'Sushi Palace',
    type: 'Restaurant',
    cuisine: 'Japanese',
    price: '$$$',
    rating: 4.8,
    coordinates: {
      latitude: 10.7755,
      longitude: 106.7050,
    },
    address: '76 Hai Ba Trung Street, District 1',
    description: 'Premium Japanese cuisine featuring fresh sushi and sashimi.',
    openingHours: '11:00 AM - 10:00 PM',
  },
  {
    id: '4',
    name: 'Banh Mi Express',
    type: 'Fast Food',
    cuisine: 'Vietnamese',
    price: '$',
    rating: 4.3,
    coordinates: {
      latitude: 10.7800,
      longitude: 106.6950,
    },
    address: '22 Bui Vien Street, District 1',
    description: 'Quick and delicious Vietnamese sandwiches with various fillings.',
    openingHours: '6:00 AM - 8:00 PM',
  },
  {
    id: '5',
    name: 'La Petite Bistro',
    type: 'Restaurant',
    cuisine: 'French',
    price: '$$$',
    rating: 4.6,
    coordinates: {
      latitude: 10.7820,
      longitude: 106.7000,
    },
    address: '189 Pasteur Street, District 3',
    description: 'Elegant French bistro offering authentic cuisine and fine wines.',
    openingHours: '11:30 AM - 10:30 PM',
  },
  {
    id: '6',
    name: 'Pho 24',
    type: 'Restaurant',
    cuisine: 'Vietnamese',
    price: '$$',
    rating: 4.4,
    coordinates: {
      latitude: 10.7730,
      longitude: 106.7040,
    },
    address: '5 Dong Khoi Street, District 1',
    description: 'Popular chain serving traditional Vietnamese pho and other specialties.',
    openingHours: '7:00 AM - 10:00 PM',
  },
  {
    id: '7',
    name: 'Highlands Coffee',
    type: 'Cafe',
    cuisine: 'Vietnamese',
    price: '$$',
    rating: 4.3,
    coordinates: {
      latitude: 10.7810,
      longitude: 106.6980,
    },
    address: '92 Nam Ky Khoi Nghia Street, District 1',
    description: 'Modern coffee shop chain offering Vietnamese coffee and light snacks.',
    openingHours: '7:00 AM - 10:00 PM',
  },
  {
    id: '8',
    name: 'Pizza Express',
    type: 'Fast Food',
    cuisine: 'Italian',
    price: '$$',
    rating: 4.1,
    coordinates: {
      latitude: 10.7750,
      longitude: 106.7020,
    },
    address: '25 Thai Van Lung Street, District 1',
    description: 'Quick service pizza restaurant with a variety of toppings and sides.',
    openingHours: '10:00 AM - 10:00 PM',
  },
];

// Price range options
export const priceRanges = [
  { label: 'Any', value: 'any' },
  { label: '$', value: '$' },
  { label: '$$', value: '$$' },
  { label: '$$$', value: '$$$' },
  { label: '$$$$', value: '$$$$' },
];

// Distance range options
export const distanceRanges = [
  { label: 'Any', value: 0 },
  { label: '1km', value: 1 },
  { label: '3km', value: 3 },
  { label: '5km', value: 5 },
  { label: '10km', value: 10 },
];

// Cuisine/Category options
export const cuisineCategories = [
  { label: 'All', value: 'all' },
  { label: 'Vietnamese', value: 'Vietnamese' },
  { label: 'Coffee', value: 'Coffee' },
  { label: 'Italian', value: 'Italian' },
  { label: 'American', value: 'American' },
  { label: 'Japanese', value: 'Japanese' },
  { label: 'Korean', value: 'Korean' },
]; 