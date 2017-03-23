import React,{Component} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableHighlight
} from 'react-native';


import { Form,
  Separator,InputField, LinkField,
  SwitchField, PickerField,DatePickerField,TimePickerField
} from 'react-native-form-generator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles,activityStyles,globals, formStyles, selectStyles,autocompleteStyles, optionTextStyles, overlayStyles } from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import RNGooglePlaces from 'react-native-google-places';
import Colors from '../styles/colors';
 var {height, width} = Dimensions.get('window');
export default class AddNewEvent extends Component{
  constructor(props){
    super(props);
    this.state = {
      formData:{},
    }
  }

  openSearchModal =() => {
   RNGooglePlaces.openAutocompleteModal()
   .then((place) => {
   console.log(place);
   // place represents user's selection from the
   // suggestions and it is a simplified Google Place object.
   })
   .catch(error => console.log(error.message));  // error is a Javascript Error object
 }



  handleFormChange(formData){
    /*
    formData will contain all the values of the form,
    in this example.

    formData = {
    first_name:"",
    last_name:"",
    gender: '',
    birthday: Date,
    has_accepted_conditions: bool
    }
    */

    this.setState({formData:formData})
    this.props.onFormChange && this.props.onFormChange(formData);
  }
  handleFormFocus(e, component){
    //console.log(e, component);
  }
  openTermsAndConditionsURL(){

  }

  _test = () => {
    console.log('Test called');
  }
  render(){
    return (


      <KeyboardAwareScrollView  style={{flex:1}} extraScrollHeight={100}>



      <TouchableOpacity style={myStyles.imageContainer} onPress={this._test()}>
          <Icon name="ios-camera" size={30} color={Colors.white}/>
          <Text style={[otherStyles.h4, globals.primaryText]}>Add a Photo</Text>
      </TouchableOpacity>
      <Form
        ref='registrationForm'
        onFocus={this.handleFormFocus.bind(this)}
        onChange={this.handleFormChange.bind(this)}
        label="Personal Information">

        <InputField
          ref='event_title'
          label ='Event Name'
          placeholder='Event Name'
          multiline ={true}
          helpText={((self)=>{

            if(Object.keys(self.refs).length !== 0){
              if(!self.refs.registrationForm.refs.event_title.valid){
                return self.refs.registrationForm.refs.event_title.validationErrors.join("\n");
              }

            }
            // if(!!(self.refs && self.refs.first_name.valid)){
            // }
          })(this)}
          validationFunction={[(value)=>{
            /*
            you can have multiple validators in a single function or an array of functions
             */

            if(value == '') return "Required";
            //Initial state is null/undefined
            if(!value) return true;

            return true;
          }]}
          />
        <InputField
          ref='event_description'
          label='Event Info'
          placeholder='Tell us more'
          multiline = {true}
        />
        <InputField
          multiline={true}
          ref='event_website'
          placeholder='Your event website'
          placeholderStyle={{textAlign:'center'}}
           />
           <DatePickerField ref='event_time'
           minimumDate={new Date('1/1/1900')}
           mode="datetime"
           date={new Date()}
           placeholder='Choose Start Time'/>
        <Separator />
        <LinkField label="Select a location" onPress={()=>{
            this.openSearchModal();
        }}/>
        <SwitchField label='Do you want your event to be private?'
          ref="is_event_private"
          />
        <PickerField ref='user_per_groupchat'
          label='max number of users per chat'
          value={4}
          options={{
            4: '4',
            5: '5',
            6: '6',
            7: '7',
            8: '8',
          }}/>



        <Text>{JSON.stringify(this.state.formData)}</Text>
        </Form>

      </KeyboardAwareScrollView>);
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
      height: height/5,
      alignItems: 'center',
      justifyContent: 'center'
    },



  });
