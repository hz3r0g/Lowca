import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const ProfileScreen = () => {
  return (  
    <View style={styles.container}>
      <Text>Profile</Text>
      <Button 
        title="Press Me"
        onPress={() => alert('Button pressed!')}
      />    
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
