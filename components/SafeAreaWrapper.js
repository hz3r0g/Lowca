import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SafeAreaWrapper = ({ children, style, scrollView = false, ...props }) => {
  const containerStyle = {
    flex: 1,
    ...style,
  };

  if (scrollView) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <ScrollView
          style={containerStyle}
          showsVerticalScrollIndicator={false}
          {...props}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyle} edges={['top', 'left', 'right']}>
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaWrapper; 