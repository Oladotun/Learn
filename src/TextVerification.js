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
  Alert,
  AsyncStorage,
  StatusBar,
  PixelRatio
} from 'react-native';
import Sinch from 'react-native-sinch-verification';
import Spinner from 'react-native-loading-spinner-overlay';
import Form from 'react-native-form';
import CountryPicker,{getAllCountries} from 'react-native-country-picker-modal';
import firebase from "firebase";
import Background from './Background';
import DeviceInfo from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// import {firebaseManager} from './FirebaseManager';

var custom = '';
// your brand's theme primary color
const brandColor = '#FFF';
// if you want to customize the country picker
const countryPickerCustomStyles = {};

const NORTH_AMERICA = ['CA', 'MX', 'US'];

export default class TextVerification extends Component {

  componentWillMount() {
    Sinch.init('333b66d3-b0da-4fe2-921a-7047947126fa');
    this._test();
	}
  constructor(props) {
    StatusBar.setHidden(true);
    super(props);
    // let userLocaleCountryCode = DeviceInfo.getDeviceCountry();
    // const userCountryData = getAllCountries()
    //   .filter((country) => NORTH_AMERICA.includes(country.cca2))
    //   .filter((country) => country.cca2 === userLocaleCountryCode).pop();
    // let callingCode = null;
    // let cca2 = userLocaleCountryCode;
    // if (!cca2 || !userCountryData) {
    //   cca2 = 'US';
    //   callingCode = '1';
    // } else {
    //   callingCode = userCountryData.callingCode;
    // }
    this.state = {
      enterCode: false,
      country: {
        cca2: 'US',
        callingCode: '1'
      },
      phoneNumber: null,
      error: 0
    };


  }

  _test = () => {
    var self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        self.props.navigator.push({name:'profileSetUp', phoneNumber: self.state.phoneNumber });
      } else {
        // User is signed out.
      }
      });
  }

  _validatePhoneNumber = (phoneNumber) => {
    if (phoneNumber == null) {
      return false;
    }

    return phoneNumber.toString().length == 10
  }
  _getCode = () =>{
    this.setState({ spinner: true });
    var value = this.refs.form.getValues();

    if (!this._validatePhoneNumber(value['phoneNumber'])) {
      this.setState({
        error: 1
      });
      return
    };

    Sinch.sms(value['phoneNumber'], custom, (err, res) => {
      if (!err) {
          // for android, verification is done, because the sms has been read automatically
        // for ios, this means the sms has been sent out, you need to call verify with the received code
        this.setState({
          spinner: false,
          enterCode: true,
          phoneNumber: value['phoneNumber'],
          error: 0
        });
        this.refs.form.refs.textInput.setNativeProps({ text: '' });

        Alert.alert('Sent!', "We've sent you a verification code", [{
          text: 'OK',
          onPress: () => this.refs.form.refs.textInput.focus()
        }]);
      } else {
        // console(err);
      }
    });
  }
_verifyCode = () => {
    this.setState({ spinner: true });
    var value = this.refs.form.getValues();
    var self = this;
    Sinch.verify(value['code'], async (err, res) => {
    if (!err) {
        // done!
        Alert.alert('Success!', 'You have successfully verified your phone number');
        try {
          await AsyncStorage.setItem('@UserPhoneNumber:key',
                                      self.state.phoneNumber +'@oremi.us');
        } catch (error) {
          // Error saving data
        }

        firebase.auth()
        .createUserWithEmailAndPassword(
          self.state.phoneNumber +'@oremi.us',
          '?<2L|mt+38v9|v}q23A1984D9|6LnB'+self.state.phoneNumber +'@oremi.us')
        .catch(function(error) {
           // Handle Errors here.
           var errorCode = error.code;
           var errorMessage = error.message;
           // console("we have an error");
        });
    } else {
      this.setState({
        spinner: false,
      error: 1 });
      return;
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
        style={styles.countryPicker}

        onChange={this._changeCountry}
        cca2={this.state.country.cca2}
        styles={countryPickerCustomStyles}
        translation='eng'
        closeable

        />
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
      // // console(this.refs);

  //     <TouchableOpacity onPress={()=> this.refs.countryPicker.openModal()}>
  //    <Text style={styles.instructions}>
  //      or click here
  //    </Text>
  //  </TouchableOpacity>
    return (
        <View style={styles.callingCodeView}>
          <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
        </View>


    );

  }

  render() {
    let headerText = `Whats your ${this.state.enterCode ? 'verification code' : 'phone number'}?`;
    let errorText = `Your ${this.state.enterCode ? 'verification code' : 'phone number'} is wrong, re-enter`;
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
        <KeyboardAwareScrollView >
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

              <Text style={[styles.error,{opacity:this.state.error}]} > {errorText}</Text>

           </Form>
           </KeyboardAwareScrollView>
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
  error: {
    color: '#ff0000',
    fontSize: 15,
    fontFamily: 'Helvetica',
    alignSelf: 'center',
    marginTop: 10
  }
  ,
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
