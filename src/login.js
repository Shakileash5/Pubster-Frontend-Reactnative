import React,{Component,useState,useEffect,useRef} from 'react';
import { StyleSheet, Text, View,TextInput,TouchableOpacity,Button,ScrollView,SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from './firebase';
import Loading from "./loading"
import "firebase/auth";

function Login({ navigation }){

    const [userName,setUserName] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState(0);
    const [errorMessage,setErrorMessage] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [constructorHasRun,setConstructorHasRun] = useState(true);


    const loginPress = ()=>{
        console.log("inside");
        try{        
            if(userName!="" && password!=""){
                setLoading(true);
                firebase.auth().signInWithEmailAndPassword(userName,password).then((response)=>{
                    const uid = response.user.uid;
                    //console.log(uid,":: uid");
                    navigation.navigate('dashScreen',{userId:uid.toString()});
                    
                }).catch(err =>{
                    console.log("err",err);
                    setError(1);
                    setErrorMessage(err.message); 
                }).finally(()=>{
                    setLoading(false);
                });
            }
            else{
                setError(1);
                setErrorMessage("Enter userName and password");
            }
        }
        catch(exception){
            console.log(exception);
        }    
    }

    const constructor = ()=>{
        if(constructorHasRun){
            return;
        }
        console.log("act like constructor");
        //retrieveData();
        firebase.auth().onAuthStateChanged(user =>{
            //console.log(user,"pakalam pa");
            if(user){
                navigation.navigate('dashScreen',{userId:user.uid.toString()});
            }
        })
        setConstructorHasRun(true);
    }
    constructor();

    return(

        <View style={Styles.container}>
            {isLoading?<Loading />:null}
            <View style={{alignItems:'center',padding:20,width:"100%"}}>
                <Text style={Styles.logo}>Pubster</Text>
                <Text style={error?{color:"#ED4337",fontsize:11,padding:10,flex:1,justifyContent:"center",textAlign:"center"}:{display:"none"}}> {errorMessage} </Text>
                <TextInput style={Styles.inputView} placeholder="Email Id" onChangeText={(text)=>{setUserName(text);}}  ></TextInput>
                <TextInput style={Styles.inputView} secureTextEntry={true} placeholder="Password" onChangeText={(text)=>{setPassword(text);}} ></TextInput>
                <TouchableOpacity>
                     <Text style={Styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles.loginBtn} onPress={() => {loginPress(); }}>
                    <Text style={{color:"white",fontWeight:"bold"}}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {navigation.push('SignUp'); }}>
                    <Text style={{color:"white",fontWeight:"bold"}}>SIGNUP</Text>
                </TouchableOpacity>
            </View>
        </View>

    );

}


const Styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#16192E',
        justifyContent:'center',
        alignItems:'center',
    },
    logo:{
        color:"white",
        fontSize:40,
        fontWeight:"bold",
        marginBottom:30,
    },
    inputView:{
        width:"100%",
        backgroundColor:"#3E3E3E",
        borderRadius:25,
        height:60,
        marginBottom:20,
        color:"white",
        justifyContent:"center",
        padding:20,
        elevation:20,
      },
      forgot:{
        color:"white",
        fontSize:11
      },
      loginBtn:{
        width:"80%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10,
        elevation:20,
      },
})


export default Login;