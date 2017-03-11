import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import{
  View,
  StyleSheet,
} from 'react-native';

export default class Background extends Component {

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#A1ADDB', '#D5D7D9','#F9AD67']}
          locations={[0,.75, 1.0]}
          style={styles.linearGradient}>
          {this.props.children}
          </LinearGradient>
    </View>);

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: 'transparent'
    // backgroundColor: '#F9AD67'
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    // alignItems: 'center'
    // justifyContent: 'center'
  }
});
