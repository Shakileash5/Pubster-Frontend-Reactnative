import React,{Component,useState,useEffect,useRef} from 'react';
import { StyleSheet, Text, View,TextInput,TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker'
import Loading from "./loading"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import cityData from './allCities.json';
import firebase from './firebase';
import "firebase/auth"
import "firebase/database"

function SignUp({navigation }){

    const [userName,setUserName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [gender,setGender] = useState('Male');
    const [age,setAge] = useState(18);
    const [phoneNo,setPhoneNo] = useState('');
    const [location,setLocation] = useState('');
    const [state,setState] = useState('');
    const [city,setCity] = useState('');
    const [error,setError] = useState(0);
    const [errorMessage,setErrorMessage] = useState("");
    const [isLoading, setLoading] = useState(false);
    const stateKey = Object.keys(cityData);
    const [cityKey,setCityKey] = useState(Object.keys(cityData["Tamil Nadu"]));
    const ageArray = []
    for(var i=18;i<45;i++){
        ageArray.push(i);
    }
   // const {userId } = route.params;
    //console.log(params,"params");
    //console.log(Object.keys(cityData))

    const [constructorHasRun,setConstructorHasRun] = useState(false);
    
    const storeData = async ()=>{
        try{
            //console.log("its now pressed",username,email,password);
            //await AsyncStorage.setItem("userName",username  );
            navigation.push('login')
        }
        catch(error){
            console.log(error);
        }
    }

    const signupPress = ()=>{
        let flag = 0
        if(userName!='' && password!='' && email!="" && phoneNo!="" && city!=""){
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            console.log(reg.test(email),"vali")
            if(reg.test(email)==0){
                setError(1);
                setErrorMessage("Enter a valid email id ");
            }
            else{
                if(String(phoneNo).length>10){
                    setError(1);
                    setErrorMessage("Enter a valid Phone Number "); 
                }
                else{
                    flag = 1
                }
            }
        }
        else{
            setError(1);
            setErrorMessage("All fields are required");
        }
        if(flag==1){
            setLoading(true);
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then((response) => {
                    const uid = response.user.uid;
                   // console.log("uid ::: ",uid);
                    firebase
                        .database().ref("User/"+uid).set({userName:userName,mail:email,age:age,phoneNo:phoneNo,city:city})
                        .then((response)=>{
                            navigation.navigate("Login")
                        })
                        .catch(err =>{
                            console.log("err",err);
                            setError(1);
                            setErrorMessage(err.message); 
                        })
                    
                }).catch(err =>{
                     console.log("err",err);
                     setError(1);
                     setErrorMessage(err.message); 
                }).finally(()=>{
                    setLoading(false);
                });
        }
    }
    const callState = (itemValue)=>{
        setState(itemValue);
        //console.log(cityData[itemValue],state,itemValue);
        setCityKey(Object.keys(cityData[itemValue]));
    }
    const constructor = ()=>{
        if(constructorHasRun){
            return;
        }
        console.log("act like constructor");
        setConstructorHasRun(true);
    }
    constructor();

    
    return(

        <View style={Styles.container}>
            {isLoading?<Loading />:null}
            <View style={{alignItems:'center',padding:0,width:"85%"}}>
                <Text style={Styles.logo}>Pubster App</Text>   
                <Text style={error?{color:"#ED4337",fontsize:11,padding:10,flex:1,justifyContent:"center",textAlign:"center"}:{display:"none"}}> {errorMessage} </Text> 
                <TextInput style={Styles.inputView} placeholder="Username" onChangeText={(text)=>{setUserName(text)}}></TextInput>
                <TextInput style={Styles.inputView} placeholder="Email Id" onChangeText={(text)=>{setEmail(text)}}></TextInput>
                <TextInput style={Styles.inputView} secureTextEntry={true} placeholder="Password" onChangeText={(text)=>{setPassword(text)}}></TextInput>
                <TextInput style={Styles.inputView} keyboardType='phone-pad' placeholder="Phone Number" onChangeText={(text)=>{setPhoneNo(text)}} value={!isNaN(phoneNo)?phoneNo:""}></TextInput>
                <Picker
                    selectedValue={gender}
                    style={{backgroundColor:"#3E3E3E",
                        borderRadius:20,
                        height:60,
                        width:150,
                        marginBottom:15,
                        color:"white",
                        justifyContent:"center",
                        padding:20,
                        elevation:15,}}
                    onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
                >
                    <Picker.Item label="Male" value="Male" 
                    style={Styles.inputView} />
                    <Picker.Item label="Female" value="Female" 
                    style={Styles.inputView}/>
                </Picker>
                <Picker
                    selectedValue={state}
                    style={{backgroundColor:"#3E3E3E",
                        borderRadius:20,
                        height:60,
                        width:150,
                        marginBottom:15,
                        color:"white",
                        justifyContent:"center",
                        padding:20,
                        elevation:15,}}
                    onValueChange={(itemValue, itemIndex) => callState(itemValue)}
                >
                   { 
                        stateKey.map((data,i)=>{
                            return(
                                    <Picker.Item key={i} label={data} value={data} />
                            );
                        })
                    
                    }
                </Picker>
                <Picker
                    selectedValue={city}
                    style={{backgroundColor:"#3E3E3E",
                        borderRadius:20,
                        height:60,
                        width:150,
                        marginBottom:15,
                        color:"white",
                        justifyContent:"center",
                        padding:20,
                        elevation:15,}}
                    onValueChange={(itemValue, itemIndex) => setCity(itemValue)}
                >
                   { 
                        cityKey.map((data,i)=>{
                            return(
                                    <Picker.Item key={i} label={data} value={data} />
                            );
                        })
                    
                    }
                </Picker>
                <Picker
                    selectedValue={age}
                    style={{backgroundColor:"#3E3E3E",
                        borderRadius:20,
                        height:60,
                        width:150,
                        marginBottom:15,
                        color:"white",
                        justifyContent:"center",
                        padding:20,
                        elevation:15,}}
                    onValueChange={(itemValue, itemIndex) => setAge(itemValue)}
                >
                   { 
                        ageArray.map((data,i)=>{
                            return(
                                    <Picker.Item key={i} label={data} value={data} />
                            );
                        })
                    
                    }
                </Picker>
                <TouchableOpacity style={Styles.signupBtn} onPress={()=>signupPress()}>
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
        borderRadius:20,
        height:60,
        marginBottom:15,
        color:"white",
        justifyContent:"center",
        padding:20,
        elevation:15,
      },
      signupBtn:{
        width:"80%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:20,
        marginBottom:10,
        elevation:20,
      },
})


export default SignUp;