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
import Sinch from 'react-native-sinch-verification';
import Spinner from 'react-native-loading-spinner-overlay';
import Form from 'react-native-form';
import CountryPicker from 'react-native-country-picker-modal';

var custom = '';
// if you want to customize the country picker
const countryPickerCustomStyles = {};
export default class Oremi extends Component {

  componentDidMount() {

	}
  constructor(props) {
    super(props);
    this.state = {
      enterCode: false,
      spinner: false,
      country: {
        cca2: 'US',
        callingCode: '1'
      }
    };

    Sinch.init('333b66d3-b0da-4fe2-921a-7047947126fa');
    this._onText = this._onText.bind(this);
    // this._onText();

  }

  _onText(){
    Sinch.sms('4437914148', custom, (err, res) => {
  if (!err) {
      // for android, verification is done, because the sms has been read automatically
    // for ios, this means the sms has been sent out, you need to call verify with the received code
    console.log('sent to user');
  } else {
    console.log(err);
  }
});
  }

  _renderCountryPicker = () => {

    if (this.state.enterCode)
      return (
        <View />
      );

    return (
      <CountryPicker
        ref={'countryPicker'}
        closeable
        style={styles.countryPicker}
        onChange={this._changeCountry}
        cca2={this.state.country.cca2}
        styles={countryPickerCustomStyles}
        translation='eng'/>
    );

  }
  _changeCountry = (country) => {
    this.setState({ country });
    // this.refs.form.refs.textInput.focus();
  }

  _renderCallingCode = () => {

    if (this.state.enterCode)
      return (
        <View />
      );

    return (
      <View style={styles.callingCodeView}>
        <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
      </View>
    );

  }

  render() {
    let headerText = `Whats your ${this.state.enterCode ? 'verification code' : 'phone number'}?`;
    let buttonText = this.state.enterCode ? 'Verify confirmation code' : 'Send confirmation code';
    let textStyle = this.state.enterCode ? {
      height: 50,
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
      fontFamily: 'Courier'
    } : {};
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
       <Text style={styles.header}>{headerText}</Text>

       <Form ref={'form'} style={styles.form}>

         <View style={{ flexDirection: 'row' }}>
         {this._renderCountryPicker()}
         {this._renderCallingCode()}
         </View>
      </Form>


      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },countryPicker: {
    alignItems: 'center',
    justifyContent: 'center'
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
  header: {
    textAlign: 'center',
    marginTop: 0,
    fontSize: 22,
    margin: 20,
    color: '#4A4A4A',
  }
});

AppRegistry.registerComponent('Oremi', () => Oremi);
