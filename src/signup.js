import React,{Component,useState,useEffect,useRef} from 'react';
import { StyleSheet, Text, View,TextInput,TouchableOpacity,Button,Image,ActivityIndicator, } from 'react-native';
import {Picker} from '@react-native-picker/picker'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker';
import * as ImagePicker from 'expo-image-picker';
import {Snackbar } from 'react-native-paper';
import {validateName,validateEmail,validateAge,validatePassword} from "./validate"
import {uriToBlob} from "./utils";
import cityData from './allCities.json';
import Loading from "./loading"
import firebase from './firebase';
import "firebase/auth"
import "firebase/database"
import "firebase/storage"

function SignUp({navigation }){

    const [userName,setUserName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [gender,setGender] = useState('Male');
    const [visible, setVisible] = useState(false);
    const [age,setAge] = useState(18);
    const [date, setDate] = useState(new Date(1598051730000));
    const [showDate,setShowDate] = useState(false);
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
       setShowDate(Platform.OS === 'ios');
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
        var valid = validatePassword(password,confirmPassword);
        if (valid[0]==true){
                flag = 1;
        }
        else{
            setError(1);
            setErrorMessage(valid[1]);
        }
        if(flag==1){
            setLoading(true);
            setError(1);
            setErrorMessage("Staart");
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then((response) => {
                    const uid = response.user.uid;
                   // console.log("uid ::: ",uid);
                   setError(1);
                   setErrorMessage("created uid");
                   upload_image(uid,imgArr[0],0).then(()=>{
                      upload_image(uid,imgArr[1],1).then(()=>{
                         upload_image(uid,imgArr[2],2).then(()=>{
                             upload_image(uid,imgArr[3],3).then(()=>{
                                firebase
                                    .database().ref("User/"+uid).set({userName:userName,mail:email,age:age,phoneNo:phoneNo,city:city})
                                    .then((response)=>{
                                        setError(1);
                                        setErrorMessage("over");
                                        setLoading(false);
                                        navigation.navigate("Login");

                                    })
                                    .catch(err =>{
                                        console.log("err",err);
                                        setError(1);
                                        setErrorMessage(err.message); 
                                        setLoading(false);
                                    })
                                })
                            })
                        })
                     })  
                }).catch(err =>{
                     console.log("err",err);
                     setError(1);
                     setErrorMessage(err.message); 
                     setLoading(false);
                });
        }
    }
    const callState = (itemValue)=>{
        setState(itemValue);
        //console.log(cityData[itemValue],state,itemValue);
        setCityKey(Object.keys(cityData[itemValue]));
    }
    
    const upload_image= (uid,uri,index)=>{
        return new Promise((resolve, reject)=>{
        const blob = uriToBlob(uri).then((response)=>{
            console.log(response);
            firebase.storage().ref().child(uid+'/photo_'+index+'.jpg').put(response, {
                    contentType: 'image/jpeg'
                }).then((snapshot)=>{
                    console.log(snapshot);
                   setError(1);
                    setErrorMessage("upload");
                    resolve(snapshot);
                }).catch((error)=>{

                    console.log(error.payload);
                    reject(error);
                });

           

        });
    });   
    }
    
    const moveNext = ()=>{
        var vals = [...showArr];
        var index = 0;
        var flag = 0;
        var valid = [];
        for(var i=0;i<=4;i++){
            if(vals[i]==1){
                index = i;
            }
        }
        if(index==0){
            valid = validateName(userName);
            //console.log(valid,"dqw")
            //upload_image(imgArr[0]);
                  
        }
        else if(index==1){
            valid = validateEmail(email); 
        }
        else if(index==2){
            console.log(imgArr);
            if(imgArr[0]==0 || imgArr[1]==0 || imgArr[2]==0 || imgArr[3]==0 ){
                valid = [false,"All images are required !"];
                flag = 1;
            }
        }
        else if(index==3){
            valid = validateAge(date);
            console.log(valid)
            if(valid[0]==true){
                setAge(valid[1]);
            }
        }       
        else if(valid[0] == false){
            setError(1);
            setErrorMessage(valid[1]);
            flag=1;
        }  
        if(flag==0){
            setError(0);
            vals[index] = 0;
            vals[index+1] = 1;
            setViewText(viewTextArr[index+1])
            setShowArr(vals);
        }
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
               
                   // loading?<ActivityIndicator size="large" color="#00ff00" />:null
                   //<Text style={error?{color:"#ED4337",fontSize:11,padding:10,justifyContent:"center",textAlign:"center"}:{display:"none"}}> {errorMessage} </Text> 
                
               }
                <Text style={{fontSize:15,fontWeight:"bold",padding:10,alignSelf:"flex-start"}}>{viewText} </Text>
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
                  showArr[3]?<View>
                  <TouchableOpacity onPress={()=>{setShowDate(true)}}>
                    <View style={{padding:10,borderWidth:1,borderColor:"grey",width:"100%"}}>
                        <Text style={{fontSize:14,fontWeight:"300",width:"100%"}}>{ String(date.getDate()) +"/"+String(date.getMonth()) +"/"+String(date.getFullYear()) }</Text>
                    </View>
                  </TouchableOpacity>
                  {showDate?<DateTimePicker 
                        value={ date }
                        mode='date'
                        display='default'
                        onChange={onChange} />:null
                  }
                  </View>:null
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
                    <TextInput style={Styles.inputView} secureTextEntry={true} placeholder="Confirm Password" onChangeText={(text)=>{setConfirmPassword(text)}}></TextInput>
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
            <Snackbar
                visible={error}
                onDismiss={()=>{setError(0)}}
                >
                {errorMessage}
            </Snackbar>
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