import React,{Component, PropTypes} from 'react';

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
import {database,uploadImage} from '../Config';
import firebase from 'firebase';


 var {height, width} = Dimensions.get('window');
export default class AddNewEvent extends Component{
  constructor(props){
    super(props);
    this.state = {
      formData:{
        event_time: (new Date()).toString(),
        user_per_groupchat: '6',
        event_category: 'get together',
        is_event_private: false,
        host_name: this.props.displayName
      },
      place: null,
      uploadURL: 'nothing',
      opacity: 1,
      gotonext:false,
      loading: null,
      mode: 'add'
    }
  }

  _pickImage() {
    this.setState({uploadURL:'', loading: true })
    var self = this;
    ImagePicker.launchImageLibrary({}, response  => {
      // console.log(response);
      if (response.didCancel === true) {
        this.setState({ uploadURL: 'nothing' });
      } else {

        uploadImage(response.uri)
          .then((url) => {
            this.setState({ uploadURL: url, opacity: 0,loading:false})
            if (this.state.gotonext){
              self.validate();
            }

          })
          .catch(error => {
            this.setState({ uploadURL: 'nothing' });
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

    if (this.state.mode === 'add'){
      if (formData.event_time == undefined) {
        formData.event_time = (new Date()).toString();
      }
      if (formData.event_category == undefined) {
        formData.event_category = 'get together';
      }
      if(formData.is_event_private == undefined){
        formData.is_event_private = false;

      }
      if(formData.user_per_groupchat == undefined){
        formData.user_per_groupchat = '6';
      }
      formData.host_name = this.props.displayName;


      this.setState({formData:formData})

    } else {
      const updatedFormData = this.state.formData;
      formData.host_name = this.props.displayName;
      Object.keys(formData).forEach(function(key) {
        updatedFormData[key] =formData[key];
      });
      this.setState(formData: updatedFormData);
    }


    this.props.onFormChange && this.props.onFormChange(formData);


  }
  buttonCalled = () => {
    this.setState(gotonext:true);
  }

  validate = () => {
    if (this.state.place !== null){
      if (!this.state.formData.place) {
        this.state.formData.place = this.state.place;
        this.setState({formData:this.state.formData});
      }

    }


    if (!this.state.formData.event_title || this.state.formData.event_title === '' ){
      ///error
      Alert.alert('Event Title Required', "Enter Title Below", [{
      //     text: 'OK',
      //     onPress: () => {console.log('aint legal');}
        }]);
        return;
    } else  if (!this.state.place) {

      Alert.alert('Location Required!', "Select a location", [{
          text: 'OK',
      //     onPress: () => {console.log('aint legal');}
        }]);
        return;
    }
    if(this.state.uploadURL == 'nothing' && this.state.loading === null){
      this.props.navigator.pop();
    } else if(this.state.loading === true){
        return

      } else if(this.state.loading === false) {
        this.state.formData.uploadURL= this.state.uploadURL;


        var user = firebase.auth().currentUser;
        console.log(user);

       var userRef =  database.ref('users/' + user.uid );
       var eventRef = database.ref('events/');
       var createdRef = userRef.child('createdEvents');
       this.state.formData.owner_id = user.uid + '';

       this.setState({formData:this.state.formData});
       if(this.state.mode === 'add'){
         var newEventRef = eventRef.push();
         var eventString = newEventRef.key;
         var info = {};
         info[eventString] = {
           'event_title' : this.state.formData.event_title,
           'event_time' : this.state.formData.event_time,
           'uploadURL' : this.state.formData.uploadURL
         }
         newEventRef.set(this.state.formData);
          createdRef.child(eventString).set(info[eventString]);
          this.props.navigator.pop();
       } else if (this.state.mode === 'update'){
         console.log("going to update");
         console.log("Form data state");
         console.log(this.state.formData);
         console.log(this.props.eventDataLocation);
         if (this.props.eventDataLocation){
           console.log("updating inside data location");

          //  var updateEventRef = eventRef.child(this.props.dataLocation);
          var updateEventsRef = eventRef.child(this.props.eventDataLocation);
          var updateUserEventsRef = createdRef.child(this.props.eventDataLocation);
           updateEventsRef.update(this.state.formData, response => {
             console.log(response);
           });

           updateUserEventsRef.update(
             {
               'event_title' : this.state.formData.event_title,
               'event_time' : this.state.formData.event_time,
               'uploadURL' : this.state.formData.uploadURL
             }

           );
         }
         this.props.navigator.replacePrevious(
           {
             name:'ViewEvent',
             title: 'Event Info',
             eventObject:this.state.formData,
             openMenu: this.props.route.openMenu ,
             closeMenu: this.props.route.closeMenu,
             eventDataLocation: this.props.route.eventDataLocation,
             rightText: 'Edit',
             leftIcon: <Icon name="ios-arrow-back" size={30} style={[{color:'#4A90E2'},{marginLeft:10}]}/>

         }
         );
         this.props.navigator.pop();

       }





      }

    // }


    // uploadURL

    // JSON.stringify({this.state.formData, this.state.place});

  // (https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})






  }
  handleFormFocus(e, component){
    //console.log(e, component);
  }

  componentWillMount(){
      this.updateValueIfPresent();
  }

  updateValueIfPresent = () => {
    var eventValue = this.props.eventObject
    console.log('Event object present');
    console.log(this.props);

    var formData = {};
    var uploadURL = 'nothing';
    var opacity = 1;
    var place = null;
    var mode = 'add';


    if (eventValue) {
      if (eventValue['uploadURL']){
        uploadURL = eventValue['uploadURL'];
        opacity = 0;
      }

      if(eventValue['place']){
        place = eventValue['place'];
      }

      if (eventValue['event_title']){
        formData.event_title = eventValue['event_title'];
      }

      if(eventValue['event_description']){
        formData.event_description = eventValue['event_description'];
      }

      if(eventValue['event_category']){
        formData.event_category = eventValue['event_category'];
      }

      if(eventValue['event_time']){
        formData.event_time = eventValue['event_time'];
      }

      if(eventValue['user_per_groupchat']){
        formData.user_per_groupchat = eventValue['user_per_groupchat'];
      }

      if(eventValue['is_event_private']){
        formData.is_event_private = eventValue['is_event_private'];
      }
      if (eventValue['event_website']){
        formData.event_website = eventValue['event_website'];
      }
      mode = 'update';

      this.setState({formData: formData, opacity:opacity,uploadURL:uploadURL, place:place,mode:mode,loading:false});

      return formData;


    }

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
            case 'nothing':
            return(

              <TouchableOpacity style={[myStyles.imageContainer,{alignItems: 'center'},{justifyContent: 'center'}]}
              onPress={ () => this._pickImage()}>
                  <Icon name="ios-camera" size={30} style={{opacity: this.state.opacity}} color={Colors.white}/>
                  <Text style={[otherStyles.h4, globals.primaryText, {opacity: this.state.opacity}]}>Add a Photo</Text>
              </TouchableOpacity>


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
          value= {this.state.formData.event_title}
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
          value = {this.state.formData.event_description}


        />
        <InputField
          multiline={true}
          ref='event_website'
          placeholder='Your event website'
          placeholderStyle={{textAlign:'center'}}
          value= {this.state.formData.event_website}



           />
           <DatePickerField ref='event_time'
           minimumDate={new Date()}
           mode="datetime"
           date={new Date(this.state.formData.event_time)}
           iconRight= {[<Icon style={{alignSelf:'center', marginLeft:10}} name='ios-arrow-forward' size={30} />,
                       <Icon style={{alignSelf:'center', marginLeft:10}} name='ios-arrow-down' size={30} />
                       ]}
           prettyPrint = {true}
           placeholder='Start Time'/>
        <PickerField ref='event_category'
          label='Select event type'
          value={this.state.formData.event_category}
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
          value={this.state.formData.user_per_groupchat}
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
          <LinkField ref='link_field'label={this.state.place==null? "Select a location":this.state.place.name} onPress={()=>{
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
