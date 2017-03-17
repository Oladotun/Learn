import React, {Component} from 'react';
import{
  Text,
  StyleSheet
} from 'react-native';

export default class Contact extends Component {

  render(){
    return<Text style={styles.welcome}>List of Contact</Text>
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,

  },
});
