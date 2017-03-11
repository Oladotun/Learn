import React, {Component} from 'react';
import firebase from "firebase";
import{
  View,
  Text,
  StyleSheet,
  Button
} from 'react-native';

export default class Home extends Component {

  constructor(props){
    super(props);
    // this._navigate = this._navigate.bind(this);
  }

  _getClick = () => {
    var self = this;
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("sign out worked");
    }).catch(function(error) {
      // An error happened.
    });
  }


  render() {

    return (<View style={styles.container}>
      <Text style={styles.welcome}>Home page</Text>
      <Button title="Testing"
      style={styles.welcome}
      onPress={this._getClick}
      color="#841584"
      />
      </View>

    );
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
