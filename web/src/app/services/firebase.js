// Firebase
import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyDRy30GwG5t8ZaeOaO5DPT4Bm1fqJ-7rnI",
    authDomain: "kremen-city.firebaseapp.com",
    databaseURL: "https://kremen-city.firebaseio.com",
    projectId: "kremen-city",
    storageBucket: "kremen-city.appspot.com",
    messagingSenderId: "155159080010"
};

firebase.initializeApp(config);

export const database = firebase.database();

