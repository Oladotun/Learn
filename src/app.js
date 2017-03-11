import React, {Component} from 'react';
import{
  Navigator,
  View,
  Text,
  StyleSheet
} from 'react-native';

import TextVerification from './TextVerification';
import Home from './Home';

import firebase from "firebase";

const RouteMapper = (route, navigator) => {
  if(route.name === 'textVerification') {
    return <TextVerification navigator={navigator} />
  }else if(route.name === 'home') {
    return <Home navigator={navigator} />
  }
}

export default class App extends Component {
  constructor(props){
    super(props);

    this.state = {
        user: null,
        loading: true,
      unSubscribe: null
      };
      let config = {
        apiKey: "AIzaSyArUrQ20hQ4o4nohBBKs0VH5tH3bX6vDMI",
        authDomain: "oremi-a0b25.firebaseapp.com",
        databaseURL: "https://oremi-a0b25.firebaseio.com",
        storageBucket: "oremi-a0b25.appspot.com",
        messagingSenderId: "427045602725"
      };
    // this.navigate = this.navigate.bind(this);
    firebase.initializeApp(config)
  }

  componentWillMount(){
    var self = this;
    self.state.unSubscribe = firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        console.log('user signed in mount');
        self.setState({
          user: user,
          loading: false
        })
      } else {
        // User is signed out.
        self.setState({
            loading: false
          })      }
      // ...
      });


  }
  componentDidMount(){

  }

  render(){

        if(this.state.loading) {
           return(
           <View style ={styles.container}>
              <Text style ={styles.welcome}>loading</Text>
           </View>);
        } else if (this.state.user) {
          this.state.unSubscribe();
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
        } else {
          this.state.unSubscribe();
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
