import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from 'firebase';
import Background from './Background';

// Init Firebase
let config = {
  apiKey: "AIzaSyArUrQ20hQ4o4nohBBKs0VH5tH3bX6vDMI",
  authDomain: "oremi-a0b25.firebaseapp.com",
  databaseURL: "https://oremi-a0b25.firebaseio.com",
  storageBucket: "oremi-a0b25.appspot.com",
  messagingSenderId: "427045602725"
};
const {width, height} = Dimensions.get('window');
firebase.initializeApp(config);
const storage = firebase.storage()

console.log(width);
console.log(height);

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

const uploadImage = (uri, mime = 'application/octet-stream') => {
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    const sessionId = new Date().getTime()
    let uploadBlob = null
    const imageRef = storage.ref('images').child(`${sessionId}`)

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


export default class ProfileSetUp extends Component {
  constructor(props){
    super(props);
    this.state = {
      opacity: 1
    }
  }

  _pickImage() {
    this.setState({ uploadURL: '' })

    ImagePicker.launchImageLibrary({}, response  => {
      if (response === undefined) {
        this.setState({ uploadURL: undefined });
      } else {

        uploadImage(response.uri)
          .then((url) => {
            this.setState({ uploadURL: url, opacity:0 })
          })
          .catch(error => {
            this.setState({ uploadURL: undefined });
            console.log(error)
          })
      }
    })
  }

  render(){
    return  (
      <Background>
        <View style={styles.container}>
          {
            (() => {
              switch (this.state.uploadURL) {
                case null:
                  return null
                case '':
                  return <ActivityIndicator />
                default:
                  return (

                  <Image
                    source={{ uri: this.state.uploadURL }}
                    style={ styles.image }>
                    <TouchableOpacity onPress={ () => this._pickImage() }>

                      <Text style={[styles.message, {opacity:this.state.opacity}]} >
                        Add Photo
                      </Text>
                    </TouchableOpacity>
                  </Image>


                  )
              }
            })()
          }
        </View>
      </Background>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: width/3,
    width: width/3,
    borderRadius: width/6,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    marginTop: 50,
    marginLeft: 7
  },
  message:{
    textAlign: 'center',
    color: 'blue',
    textDecorationLine: 'underline'
  }
})
