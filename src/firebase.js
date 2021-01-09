import firebase from "firebase/app"
import firestore from 'firebase/firestore'

const settings = {timestampsInSnapshots: true};

const config = {
  apiKey: "AIzaSyAZwaYY_qEnc6NKNnupnVXYX9zuEdsviKs",
  authDomain: "pubster-54042-default-rtdb.firebaseio.com/",
  databaseURL: "https://pubster-54042-default-rtdb.firebaseio.com/",
  projectId: "pubster-54042",
  storageBucket: "https://pubster-54042-default-rtdb.com/",
};
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;