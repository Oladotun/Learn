/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

export default class Oremi extends Component {
  render() {
    return (

      <View style={styles.container}>

        <LinearGradient
        colors={['#A1ADDB', '#D5D7D9','#F9AD67']}
        locations={[0,.75, 1.0]}
        style={styles.linearGradient}>


        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
        </LinearGradient>
        <Image
         style={styles.image}
         source={require('./img/oremiLogo.png')}
       />
       <Text style={styles.message}>
         OREMI
       </Text>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
    // backgroundColor: '#F9AD67'
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center'
    // alignItems: 'center'
  },
  image: {
    width: 150,
    height: 90,
    top: 40
  },
  message: {
    fontSize: 20,
    textAlign: 'center',
    margin: 40,
    color: 'white'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,

  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Oremi', () => Oremi);
