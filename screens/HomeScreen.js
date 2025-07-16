import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const HomeScreen = () => {
  return (  
    <View style={styles.container}>
      <Text>Home</Text>
      <Button 
        title="Press Me"
        onPress={() => alert('Button pressed!')}
      />
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
