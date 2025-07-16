import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const CollectionScreen = () => {
  return (  
    <View style={styles.container}>
      <Text>Collection</Text>
      <Button 
        title="Press Me"
        onPress={() => alert('Button pressed!')}
      />
    </View>
  );
}

export default CollectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
