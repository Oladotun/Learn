import React, {Component} from 'react';
import{
  Text,
  StyleSheet
} from 'react-native';

export default class Settings extends Component {

  render(){
    return<Text style={styles.welcome}>List of Settings</Text>
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,

  },
});
