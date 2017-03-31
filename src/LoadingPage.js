import React, {Component} from 'react';
import{
  Navigator,
  View,
  Text,
  StyleSheet,
  AsyncStorage
} from 'react-native';

import TextVerification from './TextVerification';
import Home from './Home';
import {database,ProfileSetUp} from './ProfileSetup';

import firebase from "firebase";

const RouteMapper = (route, navigator) => {
  if(route.name === 'textVerification') {
    return <TextVerification navigator={navigator} />
  }else if(route.name === 'home') {
    return <Home navigator={navigator} />
  } else if(route.name === 'profileSetUp') {
    return <ProfileSetUp navigator={navigator} />
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
       uidSet: false
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

          self.setState({
            user: user,
            loading: false,
            displayName: username,
            photoURL: photoURL,
            userSet: true
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
      this.state.phoneNumber = await AsyncStorage.getItem('@UserPhoneNumber:key');
      var uidSet =await AsyncStorage.getItem('@userUid:key');
      var password = '?<2L|mt+38v9|v}q23A1984D9|6LnB'+this.state.phoneNumber;
      var user = firebase.auth().currentUser;
      if (user) {
        console.log('user displayName');
        console.log(user.displayName);
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
        console.log("I am in null login with password");
        if (self.state.phoneNumber  !== null){
          console.log("Sign in with phone");
             firebase.auth()
            .signInWithEmailAndPassword(self.state.phoneNumber, password)
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // go to verifcation page
                // ...
                console.log("I caught an error")
                console.log(errorMessage);
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
          console.log("I should be null")
        }

      }

    } catch (error) {
      // Error retrieving data
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



    } catch (error) {
      // Error saving data
    }
  }

  componentWillMount(){
    this._retrieveValue();

  }
  componentDidMount(){

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
            console.log(this.state.user);
            console.log('profile');
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
            console.log(this.state.user);
            console.log(this.state.userSet);
            console.log('I am in home navigator');
            if (!this.state.uidSet){
              console.log('going to set info');
                this.setInfo();
            }



              return(
                <Navigator
                  // Default to movies route
                  initialRoute={{name: 'home'}}
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
