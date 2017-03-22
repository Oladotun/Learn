import React, {Component} from 'react';
import moment from 'moment';
import{
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Slider
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker'
import { styles,activityStyles,globals, formStyles, selectStyles,autocompleteStyles, optionTextStyles, overlayStyles } from '../styles';
import Colors from '../styles/colors';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { find } from 'underscore';
 var {height, width} = Dimensions.get('window');

export default class AddNewEvent extends Component {
  constructor(props){
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
        isDateTimePickerVisible: false,
        isSecondDateTimePickerVisible: false,
        startDate:null,
        endDate: null,
        capacity: 0,
        location: null

    }
  }

  saveLocation = (data, details=null) => {
    if ( ! details ) { return; }
    let location = {
      ...details.geometry.location,
      city: find(details.address_components, (c) => c.types[0] === 'locality'),
      state: find(details.address_components, (c) => c.types[0] === 'administrative_area_level_1'),
      county: find(details.address_components, (c) => c.types[0] === 'administrative_area_level_2'),
      formattedAddress: details.formatted_address
    };
    this.setState({ location });
    // this.name.focus();
  }


 _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

 _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

 _handleDatePicked = (date) => {
   console.log('A date has been picked: ', date);
   this._hideDateTimePicker();
   this.setState({startDate: date});
 };

 _showSecondDateTimePicker = () => this.setState({ isSecondDateTimePickerVisible: true });

 _hideSecondDateTimePicker = () => this.setState({ isSecondDateTimePickerVisible: false });

 _handleSecondDatePicked = (date) => {
   console.log('A date has been picked: ', date);
   this._hideSecondDateTimePicker();
   this.setState({endDate: date});
 };

  closeMenu = () => {
    console.log('close');
    this.props.navigation.pop();
  }
  _test = () => {
    console.log('Test called');
  }

  render(){

    const finalStart = this.state.startDate;
    const finalEnd = this.state.endDate;
    const capacity = this.state.capacity;
    return (

      <KeyboardAwareScrollView  style={myStyles.container} extraScrollHeight={100}>
            <TouchableOpacity style={myStyles.imageContainer} onPress={this._test()}>
                <Icon name="ios-camera" size={30} color={Colors.white}/>
                <Text style={[otherStyles.h4, globals.primaryText]}>Add a Photo</Text>
            </TouchableOpacity>
              <Text style={myStyles.welcome}>Event Information</Text>

                <View style={myStyles.textContainer}>

                  <TextInput
                    ref='SecondInput'
                    value={this.state.firstName}
                    style={myStyles.inputField}
                    keyboardType='email-address'
                    autoCorrect={false}
                    autoCapitalize='none'
                    onChangeText={(text) => this.setState({firstName: text, error1:0 })}
                    underlineColorAndroid='transparent'
                    placeholder='Event Name'
                    placeholderTextColor='#C62828'
                    onSubmitEditing={(event) => {
                      this.refs.ThirdInput.focus();
                    }}
                  />
                </View>

                <View style={myStyles.textMultiContainer}>

                  <TextInput
                    ref='ThirdInput'
                    value={this.state.firstName}
                    style={myStyles.inputField}
                    keyboardType='email-address'
                    autoCorrect={false}
                    autoCapitalize='none'
                    onChangeText={(text) => this.setState({firstName: text})}
                    underlineColorAndroid='transparent'
                    placeholder='Event Description'
                    placeholderTextColor='#C62828'
                    multiline={true}
                    onSubmitEditing={(event) => {
                      this.refs.ThirdInput.focus();
                    }}
                  />
                </View>
                <View style={myStyles.textContainer}>

                  <TextInput
                    ref='FourthInput'
                    value={this.state.firstName}
                    style={myStyles.inputField}
                    keyboardType='email-address'
                    autoCorrect={false}
                    autoCapitalize='none'
                    onChangeText={(text) => this.setState({firstName: text, error1:0 })}
                    underlineColorAndroid='transparent'
                    placeholder='Event Website'
                    placeholderTextColor='#C62828'
                    onSubmitEditing={(event) => {
                      this.refs.ThirdInput.focus();
                    }}
                  />
                </View>

            <GooglePlacesAutocomplete
              styles={autocompleteStyles}
              placeholder='Type a place or street address'
              minLength={2}
              autoFocus={false}
              fetchDetails={true}
              onPress={this.saveLocation}
              getDefaultValue={() => ''}
              query={{
                key: 'AIzaSyBBe93Xua6hHHuFkaxl1uMnRY3jyI7XozI',
                language: 'en'
              }}
              currentLocation={false}
              currentLocationLabel='Current Location'
              nearbyPlacesAPI='GooglePlacesSearch'
              GoogleReverseGeocodingQuery={{}}
              GooglePlacesSearchQuery={{ rankby: 'distance' }}
              filterReverseGeocodingByTypes={['locality', 'adminstrative_area_level_3']}
              predefinedPlaces={[]}
            />



                <View style={myStyles.textContainer}>
                  <TouchableOpacity onPress={this._showDateTimePicker}>
                <Text style={activityStyles.messageText}>{finalStart ? moment(finalStart).format('dddd MMM Do YYYY, h:mm a') : 'Choose a starting time'}</Text>

                  </TouchableOpacity>
                  <DateTimePicker mode='datetime'
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}

                  />
                </View>
                <View style={myStyles.textContainer}>
                  <TouchableOpacity onPress={this._showSecondDateTimePicker}>
                <Text style={activityStyles.messageText}>{finalEnd? moment(finalEnd).format('dddd MMM Do YYYY, h:mm a') : 'Choose ending time'}</Text>

                  </TouchableOpacity>
                  <DateTimePicker mode='datetime'
                    isVisible={this.state.isSecondDateTimePickerVisible}
                    onConfirm={this._handleSecondDatePicked}
                    onCancel={this._hideSecondDateTimePicker}

                  />
                </View>
              <View style={myStyles.textContainer}>
                <View style={otherStyles.pickerButton}>
                  <Text style={otherStyles.input}>{capacity ? capacity : 'user per group chat'}</Text>
                </View>
              </View>
            <View style={globals.mv1}>
                <Slider
                  style={otherStyles.slider}
                  defaultValue={capacity}
                  value={capacity}
                  step={1}
                  minimumValue={4}
                  maximumValue={8}
                  onValueChange={(val) => this.setState({capacity: val})}
                />
                </View>

              </KeyboardAwareScrollView>)

  }
}
const otherStyles = formStyles;
const myStyles = StyleSheet.create({
  container: {
    flex: 1,

    // backgroundColor: 'transparent'
    backgroundColor: '#EDF1F3',
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  welcome: {
    fontSize: 15,
    textAlign: 'left',
    marginTop: 10,

  },
  imageContainer: {
    backgroundColor: Colors.blue,
    width: width,
    height: height/4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    height: height/15,
    marginTop: 2

  },
  textMultiContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    height: height/10,
    marginTop: 2

  },
  inputField: {
    width: width,
    // height: 40,
    // backgroundColor: Colors.white,
    // borderRadius: 5,
    // marginTop: 10,
    // marginLeft: 30,
    // marginRight: 30,
    alignItems: 'center',
    textAlign: 'center',
    color: '#fff'
  }
});
