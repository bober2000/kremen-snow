// Firebase
import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyDEKDMOMqKO4drOtxkNv-xRi7ZtI8PLY2Y",
  authDomain: "kremen-snow.firebaseapp.com",
  databaseURL: "https://kremen-snow.firebaseio.com",
  projectId: "kremen-snow",
  storageBucket: "kremen-snow.appspot.com",
  messagingSenderId: "363057270769",
};

firebase.initializeApp(config);

export const database = firebase.database();
