import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React,{useState,useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet} from 'react-native';
import dashScreen from "./dashScreen"
import Login from "./login"
import SignUp from "./signup"
import { BlurView } from 'expo-blur';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <NavigationContainer>{
        <Stack.Navigator>

            <Stack.Screen name="SignUp" component={SignUp}
             options={{
                    headerShown:true,
                    headerTransparent: true,
                    headerTitleStyle:{color:"grey"},
                    
                }} 
            />
            
            <Stack.Screen name="Login" component={Login} 
            options={{
                    headerShown:true,
                    headerTransparent: true,
                    headerTitleStyle:{color:"grey"},
                    
                }} />

            <Stack.Screen name="dashScreen" component={dashScreen} 
                options={{
                        headerShown:false,
                    }} 
            />
        </Stack.Navigator>



    }
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
    absoluteFill:{
        color:"white",
        backgroundColor:"black",
        fontWeight:"bold",
    },
});
export default MyStack;