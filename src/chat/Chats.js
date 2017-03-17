import React, {Component} from 'react';
import{
  Text,
  StyleSheet
} from 'react-native';

export default class Chats extends Component {

  render(){
    return<Text style={styles.welcome}>List of Chats</Text>
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,

  },
});
