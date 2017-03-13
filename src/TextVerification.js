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
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import Sinch from 'react-native-sinch-verification';
import Spinner from 'react-native-loading-spinner-overlay';
import Form from 'react-native-form';
import CountryPicker from 'react-native-country-picker-modal';
import firebase from "firebase";
import Background from './Background';
// import {firebaseManager} from './FirebaseManager';

var custom = '';
// your brand's theme primary color
const brandColor = '#FFF';
// if you want to customize the country picker
const countryPickerCustomStyles = {};

export default class TextVerification extends Component {

  componentDidMount() {

	}
  constructor(props) {
    super(props);
    this.state = {
      enterCode: false,
      country: {
        cca2: 'US',
        callingCode: '1'
      }
    };

    Sinch.init('333b66d3-b0da-4fe2-921a-7047947126fa');
    this._test();
  }

  _test = () => {
    var self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        self.props.navigator.push({name:'profileSetUp'});
      } else {
        // User is signed out.
      }
      });
  }

  _getCode = () =>{
    this.setState({ spinner: true });
    var value = this.refs.form.getValues();
    Sinch.sms(value['phoneNumber'], custom, (err, res) => {
  if (!err) {
      // for android, verification is done, because the sms has been read automatically
    // for ios, this means the sms has been sent out, you need to call verify with the received code
    console.log('sent to user');
    this.setState({
      spinner: false,
      enterCode: true,
    });
    this.refs.form.refs.textInput.setNativeProps({ text: '' });

    Alert.alert('Sent!', "We've sent you a verification code", [{
      text: 'OK',
      onPress: () => this.refs.form.refs.textInput.focus()
    }]);
  } else {
    console.log(err);
  }
});
  }
_verifyCode = () => {
    this.setState({ spinner: true });
    var value = this.refs.form.getValues();
    var self = this;
    Sinch.verify(value['code'], (err, res) => {
    if (!err) {
        // done!
          Alert.alert('Success!', 'You have successfully verified your phone number');
          firebase.auth().signInAnonymously().catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            console.log('uError signing');


          });
    } else {
      this.setState({ spinner: false });
      Alert.alert('Oops!', err.message);
    }
  });
}

  _getSubmitAction = () => {
    this.state.enterCode ? this._verifyCode() : this._getCode();
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
    this.refs.form.refs.textInput.focus();
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

        <Background>
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

              <TextInput
                ref={'textInput'}
                name={this.state.enterCode ? 'code' : 'phoneNumber' }
                type={'TextInput'}
                underlineColorAndroid={'transparent'}
                autoCapitalize={'none'}
                autoCorrect={false}
                placeholder={this.state.enterCode ? '_ _ _ _' : 'Phone Number'}

                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                style={[ styles.textInput, textStyle ]}
                returnKeyType='go'
                autoFocus
                placeholderTextColor={brandColor}
                selectionColor={brandColor}
                maxLength={this.state.enterCode ? 6 : 20}
                onSubmitEditing={this._getSubmitAction} />
              </View>

              <TouchableOpacity style={styles.button} onPress={this._getSubmitAction}>
                <Text style={styles.buttonText}>{ buttonText }</Text>
              </TouchableOpacity>

           </Form>
        </Background>
    );
  }
}

const styles = StyleSheet.create({
  countryPicker: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 150,
    height: 90,
    top: 40,
    alignSelf: 'center'
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
  },
  form: {
    margin: 20
  },
  textInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    fontSize: 20,
    color: brandColor
  },
  countryPicker: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  callingCodeText: {
    fontSize: 20,
    color: brandColor,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    paddingRight: 10
  },
  callingCodeView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#4A90E2',
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: 'bold',

  },button: {
    marginTop: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
      backgroundColor: '#FFFFFD'
  }
});
