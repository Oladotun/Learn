import firebase from 'firebase';
import React, { Component } from 'react';
import {
  Dimensions,
  Platform
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import SendBird from 'sendbird';

const {width, height} = Dimensions.get('window');
// Init Firebase
let config = {
  apiKey: "AIzaSyArUrQ20hQ4o4nohBBKs0VH5tH3bX6vDMI",
  authDomain: "oremi-a0b25.firebaseapp.com",
  databaseURL: "https://oremi-a0b25.firebaseio.com",
  storageBucket: "oremi-a0b25.appspot.com",
  messagingSenderId: "427045602725"
};

export const sendBird = new SendBird({
    appId: '22A1C74F-AB20-44E0-8EEC-42D609F1187C'
});



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
