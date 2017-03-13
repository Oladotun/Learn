import React, {Component} from 'react';
import{
  Navigator,
  View,
  Text,
  StyleSheet
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
      unSubscribe: null
      };

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
