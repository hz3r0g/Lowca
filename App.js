import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/Tabs'; // Adjust the import path as necessary

const App = () => {
  return (
    <NavigationContainer> 
      <Tabs />
    </NavigationContainer>
  );
}

export default App;