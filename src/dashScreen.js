import { StatusBar } from 'expo-status-bar';
import Constants from "expo-constants";
import React,{useEffect,useState} from 'react';
import { ActivityIndicator,StyleSheet, Text, View,RefreshControl,TextInput,ScrollView,TouchableOpacity,Image} from 'react-native';


export default function App() {

  const [pubs,setPubs] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [constructorHasRun,setConstructorHasRun] = useState(false);
  const [latLon,setLatLon] = useState({lat:11.0168,lon:76.9558})
  const apiKey = "AIzaSyAZwaYY_qEnc6NKNnupnVXYX9zuEdsviKs";
  const geoCoding = "https://us1.locationiq.com/v1/search.php?key=pk.3187aec5360bf3d54c3a38dc3b3f03c6&q=gandhipuram,coimbatore&format=json"
  const params = {
    client_id:'WV30MS2SVAJSY0CP5UVJY44EXNNWF511FAOZ4SWAWFIQGPDM',
    client_secret:'FBVAZ0YMQDYMTQ4AHMTLWCWH1CQCVVBIXEVTDPDCUFT34KDG',
    v:'20180323',
    ll:latLon.lat + "," + latLon.lon,
    query:'pubs',
    limit:50
  }

  function objToQueryString(obj) { //convert params to querrystring
      const keyValuePairs = [];
      for (const key in obj) {
        keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
      }
      return keyValuePairs.join('&');
  }

  function distance(lat1, lon1, lat2, lon2, unit) { // to find distance between two geocodes

        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist

  }

  const fetchPubs = ()=>{ //function to fetch the pubs in the given geocodes

    const paramsVal = objToQueryString(params);
    fetch('https://api.foursquare.com/v2/venues/explore?'+paramsVal)
    .then((response) => response.json()
    )
    .then((json) => {
      console.log(json);
      if(json.meta.code==200){
        //console.log(json.response.groups[0].items)
        var items = json.response.groups[0].items;
        var toAdd = [];
        items.map((vals,i)=>{
            toAdd.push({
              id:vals.venue.id,
              name:vals.venue.name,
              beenHere:0,
              marked:false,
              location:vals.venue.location,
              distance:distance(latLon.lat,latLon.lon,vals.venue.location.lat,vals.venue.location.lng,"K"),
              userReviewCount:0,
              review:0
            });
        });
        setPubs(toAdd);
        console.log(toAdd);
        setRefreshing(false);
      }
    })
    .catch((error) => {
      console.error(error);
      setRefreshing(false);
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPubs();
    //wait(2000).then(() => setRefreshing(false));
  }, []); 

  const constructor = ()=>{
        if(constructorHasRun){
            return;
        }
        console.log("act like constructor");
        setRefreshing(true);
        fetchPubs();
        setConstructorHasRun(true);
    }
    constructor();

  return (
    <View style={styles.container}>
      <View elevation={10} style={styles.header}> 
        <Text style={{alignSelf:"flex-start",color:"#E6EFF9",fontWeight:"bold",fontSize:18,}}>Pubster</Text>
      </View>
      <ScrollView style={styles.cardView} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }> 
        {    
            pubs.map((pub,i)=>{
                return(
                  <View key={i} style={{flex:1,flexDirection:"column",borderRadius:20,backgroundColor:"#F7F6FA",padding:5,margin:10,paddingLeft:10}} elevation={7}>
                      <Text style={{fontSize:25,fontWeight:"700",color:"black",paddingTop:40}}>
                          {pub.name}
                      </Text>
                      <Text>
                          {String(pub.distance.toFixed(2)) + " Km"}
                      </Text>
                      <Text style={{color:"grey",fontSize:15}}>
                          {70,"The Arcadia"}
                      </Text>
                      <View style={{flex:1,flexDirection:"row",paddingBottom:10}}>
                          <Text>
                            {pub.review}
                          </Text>
                      </View>
                </View>
                );
            })      
              
        } 
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3FA',
    flexDirection:"column",
    zIndex:0,
  },
  header:{
    flexDirection:"row",
    width:"100%",
    padding:10,
    height:Constants.statusBarHeight+35,
    paddingTop:30,
    backgroundColor:"#3640F3",
    borderBottomColor: '#12183A',
    borderBottomWidth: 0.7,
  },
  cardView: {
    padding:20,
    width:'100%',
    height:'100%',
    flexDirection:"column",
    borderRadius:5,
    marginBottom:5,
  },
});

