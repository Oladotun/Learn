import React, {Component} from 'react';
import{
  Text,
  StyleSheet,
  View
} from 'react-native';


export default class AddNewEvent extends Component {

  closeMenu = () => {
    console.log('close');
    this.props.navigation.pop();
  }

  render(){
    return <View style={styles.container}><Text style={styles.welcome}>List of New Event</Text></View>

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // backgroundColor: 'transparent'
    backgroundColor: '#0000ff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,

  },
});
