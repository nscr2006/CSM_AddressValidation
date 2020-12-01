import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
// import { useState } from "react";
// import { useHistory } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyDrTVbVL0UqEvQvIzP9jEgzoo0K-mdijCM",
  authDomain: "addressvalidation-d0ad9.firebaseapp.com",
  databaseURL: "https://addressvalidation-d0ad9.firebaseio.com",
  projectId: "addressvalidation-d0ad9",
  storageBucket: "addressvalidation-d0ad9.appspot.com",
  messagingSenderId: "903800315496",
  appId: "1:903800315496:web:20661cbb04ba737ae925dd",
  measurementId: "G-LJ8QZ3QYJZ",
};
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.database();

const googleProvider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth
    .signInWithPopup(googleProvider)
    .then((res) => {
      console.log(res.user);
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export const logOut = () => {
  auth
    .signOut()
    .then(() => {
      console.log("logged out");
    })
    .catch((error) => {
      console.log(error.message);
    });
};
