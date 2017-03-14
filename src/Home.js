import React, {Component} from 'react';
import firebase from "firebase";
import{
  View,
  Text,
  StyleSheet,
  Button
} from 'react-native';
import Background from './Background';

export default class Home extends Component {

  constructor(props){
    super(props);
  }

  _getClick = () => {
    var self = this;
    firebase.auth().signOut().then(function() {
    }).catch(function(error) {
      // An error happened.
    });
  }


  render() {

    return (
      // <View style={styles.container}>
      <Background>
        <Text style={styles.welcome}>Home page</Text>
        <Button title="Testing"
        style={styles.welcome}
        onPress={this._getClick}
        color="#841584"
        />
      </Background>
      // </View>

    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,

  },
});
