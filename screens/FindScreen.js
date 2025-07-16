import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const FindScreen = () => {
  return (  
    <View style={styles.container}>
      <Text>Find</Text>
      <Button 
        title="Press Me"
        onPress={() => alert('Button pressed!')}
      />    
    </View>
  );
}

export default FindScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
