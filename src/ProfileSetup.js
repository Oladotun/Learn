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
  Dimensions,
  TextInput,
  Picker,
  Keyboard
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import Form from 'react-native-form';
import firebase from 'firebase';
import Background from './Background';
import {styles} from './styles';
import {storage,database,uploadImage} from './Config';

// // Init Firebase
// let config = {
//   apiKey: "AIzaSyArUrQ20hQ4o4nohBBKs0VH5tH3bX6vDMI",
//   authDomain: "oremi-a0b25.firebaseapp.com",
//   databaseURL: "https://oremi-a0b25.firebaseio.com",
//   storageBucket: "oremi-a0b25.appspot.com",
//   messagingSenderId: "427045602725"
// };
const {width, height} = Dimensions.get('window');
// firebase.initializeApp(config);
// export const storage = firebase.storage()
// export const database = firebase.database();
// export const user = firebase.auth().currentUser;

// Prepare Blob support
// const Blob = RNFetchBlob.polyfill.Blob
// const fs = RNFetchBlob.fs
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
// window.Blob = Blob
//
// export const uploadImage = (uri, mime = 'application/octet-stream') => {
//   return new Promise((resolve, reject) => {
//     const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
//     const sessionId = new Date().getTime()
//     let uploadBlob = null
//     const imageRef = storage.ref('images').child(`${sessionId}`)
//
//     fs.readFile(uploadUri, 'base64')
//       .then((data) => {
//         return Blob.build(data, { type: `${mime};BASE64` })
//       })
//       .then((blob) => {
//         uploadBlob = blob
//         return imageRef.put(blob, { contentType: mime })
//       })
//       .then(() => {
//         uploadBlob.close()
//         return imageRef.getDownloadURL()
//       })
//       .then((url) => {
//         resolve(url)
//       })
//       .catch((error) => {
//         reject(error)
//     })
//   })
// }


export default class ProfileSetUp extends Component {
  constructor(props){
    super(props);
    this.state = {
      uploadURL: 'nothing',
      opacity: 1,
      firstName: '',
      lastName: '',
      sex: 'male',
      error1: 0,
      error2:0,
      error3: 0,
    }
  }

  _goToNext(){
    // validate
    if (this.state.firstName === '' && this.state.lastName === ''
        && (this.state.uploadURL === '' || this.state.uploadURL === 'nothing')) {
      // error
      this.setState({error1: 1, error2: 1, error3: 1});
    } else if(this.state.firstName === ''){
      this.setState({error1: 1});
    } else if(this.state.lastName === '') {
      this.setState({error2: 1});
    } else if(this.state.uploadURL === '' || this.state.uploadURL === undefined) {
      this.setState({error3: 1});
    } else {
      var user = firebase.auth().currentUser;
      var self = this;
      firebase.database().ref('users/' + user.uid).set({
        sex: this.state.sex,
        displayName: this.state.firstName + " " + this.state.lastName,
        photoURL: this.state.uploadURL
      });

       self.props.navigator.push({name:'home'});
       this.setInfo(user);
      // user.updateProfile({
      //   displayName: this.state.firstName + " " + this.state.lastName,
      //   photoURL: this.state.uploadURL
      //       }).then(function() {
      //         // Update successful.
      //         console.log(user);
      //         self.props.navigator.push({name:'home'});
      //       }, function(error) {
      //         // An error happened.
      // });



    }
  }

  setInfo = async(user) => {
    try {
      await AsyncStorage.setItem('@userUid:key',user.uid);
      await AsyncStorage.setItem('@userDisplayName:key',this.state.displayName);
      await AsyncStorage.setItem('@userPhotoUrl',this.state.photoURL);
    } catch (error) {
      // Error saving data
    }
  }



  _pickImage() {
    this.setState({ uploadURL: '' })

    ImagePicker.launchImageLibrary({}, response  => {
      if (response.didCancel === true) {
        this.setState({ uploadURL: 'nothing' });
      } else {

        uploadImage(response.uri)
          .then((url) => {
            this.setState({ uploadURL: url, opacity:0 })
          })
          .catch(error => {
            this.setState({ uploadURL: 'nothing' });
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
              case 'nothing':
                  return(
                    <View>
                    <TouchableOpacity style={ styles.image }
                    onPress={ () => this._pickImage()}>
                    <Text style={[styles.message, {opacity:this.state.opacity}]} >
                      Profile Photo
                    </Text>
                    </TouchableOpacity>
                    <Text style={[styles.error,{opacity:this.state.error3}]}>
                    Picture required
                    </Text>
                    </View>

                  )
                default:
                  return (
                <View>
                  <Image
                    source={{ uri: this.state.uploadURL }}
                    style={ styles.image }>
                    <TouchableOpacity onPress={ () => this._pickImage() }>
                      <Text style={[styles.message, {opacity:this.state.opacity}]} >
                        Profile Photo
                      </Text>
                    </TouchableOpacity>
                  </Image>
                  <Text style={[styles.error,{opacity:this.state.error3}]}>
                  Picture required
                  </Text>
                  </View>

                  )
              }
            })()
          }
          <Form ref={'form'} style={styles.form}>
          <TextInput
            ref='SecondInput'
            style={styles.inputField}
            value={this.state.firstName}
            keyboardType='email-address'
            autoCorrect={false}
            autoCapitalize='none'
            onChangeText={(text) => this.setState({firstName: text, error1:0 })}
            underlineColorAndroid='transparent'
            placeholder='Your First Name'
            placeholderTextColor='rgba(255,255,255,.6)'
            onSubmitEditing={(event) => {
              this.refs.ThirdInput.focus();
            }}
          />
          <Text style={[styles.error,{opacity:this.state.error1}]}> Field cannot be empty</Text>
          <TextInput
            ref='ThirdInput'
            style={styles.inputField}
            value={this.state.lastName}
            keyboardType='email-address'
            autoCorrect={false}
            autoCapitalize='none'
            onChangeText={(text) => this.setState({ lastName: text, error2: 0 })}
            underlineColorAndroid='transparent'
            placeholder='Your Last Name'
            placeholderTextColor='rgba(255,255,255,.6)'
            onSubmitEditing={(event) => {
              Keyboard.dismiss();
            }}
          />
          <Text style={[styles.error,{opacity:this.state.error2}]}> Field cannot be empty</Text>
          </Form>
          <View style={styles.pickerContainer}>
          <Text style={styles.text}>Sex:</Text>
            <Picker
              selectedValue={this.state.sex}
              onValueChange={(lang) => this.setState({sex: lang})}
              style={styles.picker}
              >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
          </Picker>
        </View>

          <View style={styles.btnContainers}>
            <TouchableOpacity onPress={() => this._goToNext() }>
              <View style={styles.submitBtnContainer}>
                <Text style={styles.submitBtn}>{'Enter'.toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

      </Background>

    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   oremiImage: {
//     width: 150,
//     height: 90,
//     top:40,
//     alignSelf: 'center'
//   },
//   error: {
//     color: '#ff0000',
//     fontSize: 15,
//     fontFamily: 'Helvetica',
//     alignSelf: 'center',
//     marginTop: 10
//   }
//   ,
//   pickerContainer: {
//     flexDirection: 'row',
//   },
//   picker: {
//     height: width/4,
//     width: width/3,
//     borderColor: 'gray',
//     justifyContent: 'center',
//   },
//   text: {
//     fontSize: 20,
//     marginTop: 60,
//   }
//   ,
//   image: {
//     height: width/3,
//     width: width/3,
//     borderRadius: width/6,
//     borderWidth: 1,
//     borderColor: 'gray',
//     justifyContent: 'center',
//
//   },
//   message:{
//     textAlign: 'center',
//     color: 'blue',
//     textDecorationLine: 'underline'
//   },
//   inputField: {
//     width: width/1.25,
//     height: 40,
//     backgroundColor: 'rgba(0,0,0,.3)',
//     borderRadius: 5,
//     marginTop: 10,
//     marginLeft: 30,
//     marginRight: 30,
//     alignItems: 'center',
//     textAlign: 'center',
//     color: '#fff'
//   },
//   btnContainers: {
//     marginTop: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 280
//   },
//   submitBtnContainer: {
//     width: 120,
//     height: 40,
//     backgroundColor: '#4A90E2',
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   submitBtn: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: '#FFFFFD'
//   }
// })
