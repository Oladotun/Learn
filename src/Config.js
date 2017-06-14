import firebase from 'firebase';
import React, { Component } from 'react';
import {
  Dimensions,
  Platform
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';


const {width, height} = Dimensions.get('window');
// Init Firebase
let config = {
  apiKey: "AIzaSyDuqaoET4PfCIP4lCeFXWy3OHS9Zxvw_hw",
  authDomain: "oremi-162302.firebaseapp.com",
  databaseURL: "https://oremi-162302.firebaseio.com",
  storageBucket: "oremi-162302.appspot.com",
  messagingSenderId: "177102174761"
};



firebase.initializeApp(config);
export const storage = firebase.storage()
export const database = firebase.database();
export const user = firebase.auth().currentUser;

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

export const uploadImage = (uri,useruid,mime = 'application/octet-stream') => {
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    const sessionId = new Date().getTime()
    let uploadBlob = null
    console.log("I am in user uid");
    console.log(useruid);
    let imageRef = null;
    if (useruid){
      imageRef = storage.ref('images').child(`${useruid}`);
    }else {
      imageRef = storage.ref('images').child(`${sessionId}`);
    }

    fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
      })
      .then((blob) => {
        uploadBlob = blob
        return imageRef.put(blob, { contentType: mime })
      })
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        resolve(url)
      })
      .catch((error) => {
        reject(error)
    })
  })
}
