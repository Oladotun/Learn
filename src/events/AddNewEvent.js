import React,{Component} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableHighlight,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import { Form,
  Separator,InputField, LinkField,
  SwitchField, PickerField,DatePickerField,TimePickerField
} from 'react-native-form-generator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles,activityStyles,globals, formStyles, selectStyles,autocompleteStyles, optionTextStyles, overlayStyles } from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import RNGooglePlaces from 'react-native-google-places';
import Colors from '../styles/colors';
import {uploadImage} from '../ProfileSetup';


 var {height, width} = Dimensions.get('window');
export default class AddNewEvent extends Component{
  constructor(props){
    super(props);
    this.state = {
      formData:{},
      place: null,
      uploadURL: 'nothing',
      opacity: 1
    }
  }

  _pickImage() {
    this.setState({ uploadURL: '' })

    ImagePicker.launchImageLibrary({}, response  => {
      if (response === undefined) {
        this.setState({ uploadURL: undefined });
      } else {

        uploadImage(response.uri)
          .then((url) => {
            this.setState({ uploadURL: url, opacity: 0})
          })
          .catch(error => {
            this.setState({ uploadURL: undefined });
            console.log(error)
          })
      }
    })
  }



  openSearchModal =() => {
    var self = this;
   RNGooglePlaces.openAutocompleteModal()
   .then((place) => {
   console.log(place);
   // place represents user's selection from the
   // suggestions and it is a simplified Google Place object.
   self.setState({place:place});

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

  validate = () => {
    if(this.state.formData.event_title){
      Alert.alert('You Legal', "We've sent you a verification code", [{
        text: 'OK',
        onPress: () => {console.log('legal');}
      }]);
    } else {
      Alert.alert('You causing problems', "We've sent you a verification code", [{
        text: 'OK',
        onPress: () => {console.log('aint legal');}
      }]);

    }
  }
  handleFormFocus(e, component){
    //console.log(e, component);
  }
  openCategoryModal = () =>{
    const items = [
      "Item 1",
      "Item 2",
      "Item 3",
      "Item 4",
    ];
    console.log('called category control');
    return(

        <ListViewSelect
          list={items}
          isVisible={true}
          onClick={this.setItem}
          onClose={this.closePopover}
        />

    )
  }
  render(){


    return (
      <KeyboardAwareScrollView  style={{flex:1}} extraScrollHeight={100}>
      {
        (() => {
          switch (this.state.uploadURL) {
            case null:
              return null
            case '':
              return (
                <View style={myStyles.imageContainer}>
                  <ActivityIndicator />
                </View>
              )
            default:
                return(
                  <Image
                  style={myStyles.imageContainer}
                    source={{ uri: this.state.uploadURL }}>
                  <TouchableOpacity style={[{alignItems: 'center'},{justifyContent: 'center'}]}
                  onPress={ () => this._pickImage()}>
                      <Icon name="ios-camera" size={30} style={{opacity: this.state.opacity}} color={Colors.white}/>
                      <Text style={[otherStyles.h4, globals.primaryText, {opacity: this.state.opacity}]}>Add a Photo</Text>
                  </TouchableOpacity>
                  </Image>

                )
          }
        })()

      }


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
           iconRight= {[<Icon style={{alignSelf:'center', marginLeft:10}} name='ios-arrow-forward' size={30} />,
                       <Icon style={{alignSelf:'center', marginLeft:10}} name='ios-arrow-down' size={30} />
                       ]}
           placeholder='Start Time'/>
        <PickerField ref='event_category'
          label='Select event type'
          value={'get together'}
          iconRight= {[<Icon style={{marginTop: 7, position:'absolute', right: 10}} name='ios-arrow-forward' size={30} />,
                      <Icon style={{marginTop: 7, position:'absolute', right: 10}} name='ios-arrow-down' size={30} />
                      ]}
          options={{
             'conference': "Conferences",
           'concert': "Concerts",
             'education': "Education",
             'get together': "Get together",
             'parties':   "Parties",
              'religious': "Religious",
             'weddings': "Weddings",
             'other': "Other"
          }}/>
        <PickerField ref='user_per_groupchat'
          label='Number of users per chat'
          value={'6'}
          iconRight= {[<Icon style={{marginTop: 7, position:'absolute', right: 10}} name='ios-arrow-forward' size={30} />,
                      <Icon style={{marginTop: 7, position:'absolute', right: 10}} name='ios-arrow-down' size={30} />
                      ]}
          options={{
            4: '4',
            5: '5',
            6: '6',
            7: '7',
            8: '8',
          }}

          />
          <LinkField label={this.state.place==null? "Select a location":this.state.place.name} onPress={()=>{
              this.openSearchModal();
          }}/>
          <SwitchField label='Make event private?'
            ref="is_event_private"
            />
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
    alignRight:{
      marginTop: 7, position:'absolute', right: 10
    }



  });
