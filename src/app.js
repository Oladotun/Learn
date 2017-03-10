import React, {Component} from 'react';
import{
  Navigator,
} from 'react-native';

import TextVerification from './TextVerification';
const RouteMapper = (route, navigator) => {
  if(route.name === 'textVerification') {
    return <TextVerification navigator={navigator} />
  }
}

export default class App extends Component {
  render(){
    return(
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
