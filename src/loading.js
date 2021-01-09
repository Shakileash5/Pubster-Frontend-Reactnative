import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
export default function Loading() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size='large' color='#6646ee' />
    </View>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:10,
    position:"absolute",  
    backgroundColor:"rgba(0,0,0,0.4)",
    width:"100%",
    height:"100%"
  }
});