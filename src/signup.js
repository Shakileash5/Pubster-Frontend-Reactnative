import React,{Component,useState,useEffect,useRef} from 'react';
import { StyleSheet, Text, View,TextInput,TouchableOpacity,Button,Image} from 'react-native';
import {Picker} from '@react-native-picker/picker'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker';
import * as ImagePicker from 'expo-image-picker';
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
    const [date, setDate] = useState(new Date(1598051730000));
    const [newD,setNewD] = useState("2016-05-15")
    const [mode, setMode] = useState('date');
    const [phoneNo,setPhoneNo] = useState('');
    const [location,setLocation] = useState('');
    const [state,setState] = useState('');
    const [city,setCity] = useState('');
    const [error,setError] = useState(0);
    const [errorMessage,setErrorMessage] = useState("");
    const [isLoading, setLoading] = useState(false);
    const stateKey = Object.keys(cityData);
    const [viewText,setViewText] = useState("Whats your name buddy?")
    const [cityKey,setCityKey] = useState(Object.keys(cityData["Tamil Nadu"]));
    const [showArr,setShowArr] = useState([1,0,0,0,0,0]);
    const [imgArr,setImgArr] = useState([0,0,0,0]);
    const viewTextArr = ["Whats your name buddy?","Enter your email","Upload some of your pics","give us your DOB","whats your gender","Set up your password" ]

   // const {userId } = route.params;
    //console.log(params,"params");
    //console.log(Object.keys(cityData))

    const [constructorHasRun,setConstructorHasRun] = useState(false);
    const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };
    
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
    
    const pickImage = async (index) => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            //setImage(result.uri);
            var imags = [...imgArr];
            imags[index] = result.uri;
            setImgArr(imags);
        }
    };

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
        if(false && flag==1){
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
    
    const moveNext = ()=>{
        var vals = [...showArr];
        var index = 0;
        for(var i=0;i<=4;i++){
            if(vals[i]==1){
                index = i;
            }
        }
        vals[index] = 0;
        vals[index+1] = 1;
        setViewText(viewTextArr[index+1])
        setShowArr(vals);
    }

    const moveBack = ()=>{
        var vals = [...showArr];
        var index = 0;
        for(var i=0;i<=4;i++){
            if(vals[i]==1){
                index = i;
            }
        }
        vals[index] = 0;
        vals[index-1] = 1;
        setViewText(viewTextArr[index-1])
        setShowArr(vals);
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
               {// <Text style={Styles.logo}>Pubster App</Text>   
               }
                <Text style={{fontSize:15,fontWeight:"bold",padding:10,alignSelf:"flex-start"}}>{viewText} </Text>
                <Text style={error?{color:"#ED4337",fontSize:11,padding:10,justifyContent:"center",textAlign:"center"}:{display:"none"}}> {errorMessage} </Text> 
                { showArr[0]?<TextInput style={Styles.inputView} placeholder="Username" onChangeText={(text)=>{setUserName(text)}}></TextInput>:null
                }
                { showArr[1]?<TextInput style={Styles.inputView} placeholder="Email Id" onChangeText={(text)=>{setEmail(text)}}></TextInput>:null
                }
                {
                    showArr[2]?<View style={{backgroundColor:"white",flexDirection:"column",borderRadius:15}}>
                        <View style={{flexDirection:"row",padding:10}}>
                            <TouchableOpacity onPress={()=>{pickImage(0)}}>
                                <View elevation={7} style={{alignItems:"center",justifyContent:"center",backgroundColor:"white",width: 100, height: 100,margin:10 }}>
                                    {!imgArr[0]?<Text style={{fontSize:30,fontWeight:"bold"}}> + </Text>:
                                    <Image source={{ uri: imgArr[0] }} style={{ width: 100, height: 100 }} />}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={()=>{pickImage(1)}}>
                                <View elevation={7}  style={{alignItems:"center",justifyContent:"center",backgroundColor:"white",width: 100, height: 100,margin:10}}>
                                    {!imgArr[1]?<Text style={{fontSize:30,fontWeight:"bold"}}> + </Text>:
                                    <Image source={{ uri: imgArr[1] }} style={{ width: 100, height: 100 }} />}
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:"row",padding:10}}>
                            <TouchableOpacity onPress={()=>{pickImage(2)}}>
                                <View elevation={7} style={{alignItems:"center",justifyContent:"center",backgroundColor:"white",width: 100, height: 100,margin:10 }}>
                                    {!imgArr[2]?<Text style={{fontSize:30,fontWeight:"bold"}}> + </Text>:
                                    <Image source={{ uri: imgArr[2] }} style={{ width: 100, height: 100 }} />}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{pickImage(3)}}>
                                <View elevation={7} style={{alignItems:"center",justifyContent:"center",backgroundColor:"white",width: 100, height: 100,margin:10}}>
                                    {!imgArr[3]?<Text style={{fontSize:30,fontWeight:"bold"}}> + </Text>:
                                    <Image source={{ uri: imgArr[3] }} style={{ width: 100, height: 100 }} />}
                                </View>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                    
                    :null
                }
                {
                  showArr[3]?<DatePicker
                        style={{width: 200}}
                        date={newD}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate="2016-05-01"
                        maxDate="2016-06-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        }
                        // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(date) => {setNewD(date)}}
                    />:null
                }

                { showArr[4]?<Picker
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
                    </Picker>:null
                }
                {
                    false?<TextInput style={Styles.inputView} keyboardType='phone-pad' placeholder="Phone Number" onChangeText={(text)=>{setPhoneNo(text)}} value={!isNaN(phoneNo)?phoneNo:""}></TextInput>:null
                }
                {
                    false?<Picker
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
                    :null
                }
                {   
                    false?<Picker
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
                    </Picker>:null 
               }
               {
                 showArr[5]?
                 <View style={{width:"100%"}}>
                    <TextInput style={Styles.inputView} secureTextEntry={true} placeholder="Password" onChangeText={(text)=>{setPassword(text)}}></TextInput>
                    <TextInput style={Styles.inputView} secureTextEntry={true} placeholder="Confirm Password" onChangeText={(text)=>{setPassword(text)}}></TextInput>
                </View>:null
               }
               
            </View>
            {
                 !showArr[5]?<TouchableOpacity style={Styles.signupBtn} onPress={()=>moveNext()}>
                                <Text style={{color:"white",fontWeight:"bold"}}>Next</Text>
                      </TouchableOpacity>:null
            }
            {
                 showArr[5]?<TouchableOpacity style={Styles.signupBtn} onPress={()=>signupPress()}>
                                <Text style={{color:"white",fontWeight:"bold"}}>SIGNUP</Text>
                      </TouchableOpacity>:null
            }
        </View>

    );

}


const Styles = StyleSheet.create({
    container:{
        flex:1,
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
        width:"50%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:50,
        alignSelf:"flex-end",
        alignItems:"center",
        justifyContent:"center",
        marginTop:20,
        marginBottom:10,
        elevation:20,
        right:"5%",
        bottom:"5%",
        position:"absolute",
      },
})


export default SignUp;