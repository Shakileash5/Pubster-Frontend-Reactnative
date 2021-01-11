import { StatusBar } from 'expo-status-bar';
import React,{useEffect,useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import nodeFoursquare from 'node-foursquare';

export default function App() {

  const apiKey = "AIzaSyAZwaYY_qEnc6NKNnupnVXYX9zuEdsviKs";
  const config = {
    'secrets' : {
      'clientId' : 'WV30MS2SVAJSY0CP5UVJY44EXNNWF511FAOZ4SWAWFIQGPDM',
      'clientSecret' : 'FBVAZ0YMQDYMTQ4AHMTLWCWH1CQCVVBIXEVTDPDCUFT34KDG',
      'redirectUrl' : 'http://0.0.0.0:19006/'
    }
  }
  const geoCoding = "https://us1.locationiq.com/v1/search.php?key=pk.3187aec5360bf3d54c3a38dc3b3f03c6&q=gandhipuram,coimbatore&format=json"
  const params = {
    client_id:'WV30MS2SVAJSY0CP5UVJY44EXNNWF511FAOZ4SWAWFIQGPDM',
    client_secret:'FBVAZ0YMQDYMTQ4AHMTLWCWH1CQCVVBIXEVTDPDCUFT34KDG',
    v:'20180323',
    ll:'11.0168,76.9558',
    query:'pubs',
    limit:50
  }
  const Foursquare = nodeFoursquare(config);
  function objToQueryString(obj) {
  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
  }
  return keyValuePairs.join('&');
}
  useEffect(()=>{
    
    const paramsVal = objToQueryString(params);
    
    fetch('https://api.foursquare.com/v2/venues/explore?'+paramsVal)
    .then((response) => response.json()
    )
    .then((json) => {
      console.log(json);
    })
    .catch((error) => {
      console.error(error);
    });
  },[])

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
