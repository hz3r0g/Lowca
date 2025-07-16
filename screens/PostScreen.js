import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const PostScreen = () => {
  return (  
    <View style={styles.container}>
      <Text>Why not show</Text>
      <Button 
        title="Press Me"
        onPress={() => alert('Button pressed!')}
      />    
    </View>
  );
}

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
