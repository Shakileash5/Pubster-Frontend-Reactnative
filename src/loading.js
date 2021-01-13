import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
export default function Loading() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size='large'animating={true}
    color="#ffffff"
    style={{height: 80, marginTop: 10,alignItems: 'center',alignSelf:"center",top:"25%",
        justifyContent: 'center'}} color='#6646ee' />
    </View>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    zIndex:20,
    position:"absolute",  
    backgroundColor:"rgba(0,0,0,0.4)",
    width:"100%",
    height:"100%"
  }
});