import React, {Component} from 'react';
import{
  Navigator,
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';

import TextVerification from './TextVerification';
import Home from './Home';
import {database} from './Config';
import ProfileSetUp from './ProfileSetup';

import firebase from "firebase";
var PushNotification = require('react-native-push-notification');

const RouteMapper = (route, navigator) => {
  if(route.name === 'textVerification') {
    return <TextVerification navigator={navigator} />
  }else if(route.name === 'home') {
    return <Home navigator={navigator} displayName={route.displayName} userUid = {route.userUid} photoURL ={route.photoURL} sex={route.sex} chatUid={route.chatUid}/>
  } else if(route.name === 'profileSetUp') {
    return <ProfileSetUp navigator={navigator} phoneNumber={route.phoneNumber} />
  } else if(route.name === 'settings'){
    return <Settings navigator={navigator}/>
  }
}

export default class LoadingPage extends Component {
  constructor(props){
    super(props);

    this.state = {
        user: null,
        loading: true,
      unSubscribe: null,
       phoneNumber: null,
       displayName: null,
       photoURL: null,
       userSet: false,
       uidSet: false,
       sex: null,
       chatUid: null
      };

  }


  _userState = () => {
    var self = this;
    self.state.unSubscribe = firebase.auth().onAuthStateChanged(function(user) {

  if (!self.state.userSet){
      if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
          var username = snapshot.val().displayName;
          var photoURL = snapshot.val().photoURL;
          var sex = snapshot.val().sex;

          self.setState({
            user: user,
            loading: false,
            displayName: username,
            photoURL: photoURL,
            userSet: true,
            sex: sex
          });




          // ...
        }).catch(function(error){
          self.setState({
            user: user,
            loading: false,
            displayName: null,
            photoURL: null,
            userSet: true
          });
        });


      } else {
        // User is signed out.
      }

    }
      });
  }

 _retrieveValue = async () => {
    try {
      var self = this;
      var phoneNumber = await AsyncStorage.getItem('@UserPhoneNumber:key');
      var uidSet =await AsyncStorage.getItem('@userUid:key');
      // uidSet = 'fWelkifclaU54sJVRzBajnGtneY2';

      // console(uidSet);
      // console(phoneNumber);
      var password = '?<2L|mt+38v9|v}q23A1984D9|6LnB'+phoneNumber;
      var user = firebase.auth().currentUser;
      if (user) {
        var setUid;
        if(uidSet){
          setUid = true;
        } else {
          setUid = false;
        }

        self.setState({
          user: user,
          loading: false,
          uidSet: setUid
        });

      } else {
        this._userState();
        // console("I am in null login with password");
        if (phoneNumber  !== null){
          self.setState({phoneNumber: phoneNumber})
          // console("Sign in with phone");
             firebase.auth()
            .signInWithEmailAndPassword(phoneNumber, password)
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // go to verifcation page
                // ...
                // console("I caught an error")
                // console(errorMessage);
                self.setState({ // go to text verification
                  user: null,
                  loading: false
                });
              });

        } else { // go to text verifcation
          self.setState({
            user: null,
            loading: false
          });
        }

      }

    } catch (error) {
      // Error retrieving data
      // console("not to text verification");
        // console("I caught an error");
        // console(error);
    }
  }

  shouldComponentUpdate(nextProps){
      return !this.state.userSet;


  }

  setInfo = async() => {
    try {
      if (this.state.user.uid != null){

        await AsyncStorage.setItem('@userUid:key',this.state.user.uid);
      }
      if(this.state.displayName != null){
        await AsyncStorage.setItem('@userDisplayName:key',this.state.displayName);
      }
      if(this.state.photoURL != null){
        await AsyncStorage.setItem('@userPhotoUrl',this.state.photoURL);
      }

      if(this.state.phoneNumber != null){
        await AsyncStorage.setItem('@UserPhoneNumber:key',this.state.phoneNumber);
      }



    } catch (error) {
      // Error saving data
    }
  }

  // componentWillMount(){
  //   // this._retrieveValue();
  //
  // }
  componentWillMount(){
    var self = this;
    PushNotification.configure({

    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
        // console( 'TOKEN:', token );
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        // console( 'NOTIFICATION:', notification );
        self.setState({chatUid:notification.data.chatUid});
    },

    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: "YOUR GCM SENDER ID",

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
    requestPermissions: true,
});

  this._retrieveValue();

  }
  componentWillUnmount(){
    this.state.unSubscribe();

  }


  render(){
    
      if(this.state.loading) {
           return(
           <View style ={styles.container}>
              <Text style ={styles.welcome}>loading</Text>
           </View>);
        } else if (this.state.user){
            this.state.unSubscribe();
          if (this.state.displayName === null || this.state.photoURL === null) {
              return(
                <Navigator
                  // Default to movies route
                  initialRoute={{name: 'profileSetUp'}}
                  // Use FloatFromBottom transition between screens
                  configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottom}
                  // Pass a route mapper functions
                  renderScene={RouteMapper}
                />
                );
          } else {
            if (!this.state.uidSet){
                this.setInfo();
            }

            // console(this.state.user);
            // console('going home');
              return(
                <Navigator
                  // Default to movies route
                  initialRoute={{name: 'home',
                   displayName: this.state.displayName,
                   userUid: this.state.user.uid,
                   photoURL: this.state.photoURL,
                   sex: this.state.sex,
                   chatUid: this.state.chatUid}
                 }
                  // Use FloatFromBottom transition between screens
                  configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottom}
                  // Pass a route mapper functions
                  renderScene={RouteMapper}
                />
          );


          }


        } else {
          return (
            <Navigator
              // Default to movies route
              initialRoute={{name: 'textVerification'}}
              // Use FloatFromBottom transition between screens
              configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottom}
              // Pass a route mapper functions
              renderScene={RouteMapper}
            />
          );

        }



  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // backgroundColor: 'transparent'
    backgroundColor: '#F9AD67',
    alignItems: 'center',
    justifyContent: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,

  },
});
