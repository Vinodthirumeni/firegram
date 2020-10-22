import * as firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyCNyEuD6HmXUTnM8TrAApuUuzL_Ci6cVL4",
  authDomain: "firegram-728af.firebaseapp.com",
  databaseURL: "https://firegram-728af.firebaseio.com",
  projectId: "firegram-728af",
  storageBucket: "firegram-728af.appspot.com",
  messagingSenderId: "1097262546135",
  appId: "1:1097262546135:web:c7c00ea8d9f5caf0168492",
  measurementId: "G-S0X3PDTSNC",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const projectStorage = firebase.storage();
const projectFirestore = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { projectStorage, projectFirestore, timestamp };
