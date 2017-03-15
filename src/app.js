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
import ProfileSetUp from './ProfileSetup';

import firebase from "firebase";

const RouteMapper = (route, navigator) => {
  if(route.name === 'textVerification') {
    return <TextVerification navigator={navigator} />
  }else if(route.name === 'home') {
    return <Home navigator={navigator} />
  } else if(route.name === 'profileSetUp'); {
    return <ProfileSetUp navigator={navigator} />
  }
}

export default class App extends Component {
  constructor(props){
    super(props);

    this.state = {
        user: null,
        loading: true,
      unSubscribe: null,
       phoneNumber: null
      };

  }

  _userState = () => {
    var self = this;
    self.state.unSubscribe = firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;

        self.setState({
          user: user,
          loading: false
        });
      } else {
        // User is signed out.
      }
      });
  }

 _retrieveValue = async () => {
    try {
      var self = this;
      this.state.phoneNumber = await AsyncStorage.getItem('@UserPhoneNumber:key');
      var password = '?<2L|mt+38v9|v}q23A1984D9|6LnB'+this.state.phoneNumber;
      var user = firebase.auth().currentUser;
      if (user) {
        console.log('user displayName');
        console.log(user.displayName);

        self.setState({
          user: user,
          loading: false
        });

      } else {
        this._userState();
        if (self.state.phoneNumber  !== null){
             firebase.auth()
            .signInWithEmailAndPassword(self.state.phoneNumber, password)
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // go to verifcation page
                // ...
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

        }

      }

    } catch (error) {
      // Error retrieving data
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
          if (this.state.user.displayName === null || this.state.user.photoURL === null) {
            console.log(this.state.user);
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
