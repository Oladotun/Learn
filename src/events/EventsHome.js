import React, {Component} from 'react';
import{
  Text,
  StyleSheet
} from 'react-native';


export default class EventsHome extends Component {

  render(){
    return<Text style={styles.welcome}>List of Home</Text>
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,

  },
});
