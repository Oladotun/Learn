import React, { Component, PropTypes } from 'react';
import { NavigatorIOS, Text,View,TouchableHighlight,StyleSheet,Button,Navigator } from 'react-native';
import AddNewEvent from './AddNewEvent'
import Icon from 'react-native-vector-icons/Ionicons'

export default class EventsHome extends Component {

    constructor(props){
      super(props);
      this.state = {
        screen:''
      }
    }
    render() {

      return (
        <View style={styles.wrapper}>
          <Text style={styles.welcome}>Hello, Chat App!</Text>
        </View>
      );
  }
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: 80
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
