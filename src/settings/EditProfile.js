import React,{Component, PropTypes} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import { Form,
  Separator,InputField, LinkField, PickerField
} from 'react-native-form-generator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles,activityStyles,globals, formStyles, selectStyles,autocompleteStyles, optionTextStyles, overlayStyles } from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../styles/colors';
import {database,uploadImage} from '../Config';

var {height, width} = Dimensions.get('window');
export default class AddNewEvent extends Component{
  constructor(props){
    super(props);
    this.state = {
      formData:{
        firstName: '',
        lastName: ''

      },
    uploadURL: 'nothing',

    }
  }

  _pickImage() {
    this.setState({loading: true })
    var self = this;
    ImagePicker.launchImageLibrary({}, response  => {
      // //(response);
      if (response.didCancel === true) {

      } else {

        uploadImage(response.uri)
          .then((url) => {
            this.setState({ uploadURL: url, opacity: 0,loading:false})
            if (this.state.gotonext){
              self.validate();
            }

          })
          .catch(error => {
            this.setState({ loading:false });
            // //(error)
          })
      }
    })
  }





  handleFormChange(formData){

    if (formData.firstName == undefined || formData.firstName == undefined) {
      formData.firstName = '';
      formData.lastName = '';
    }

    this.setState({formData:formData});
    this.props.onFormChange && this.props.onFormChange(formData);


  }

  validate = () => {

    this.props.navigator.pop();

    }


  handleFormFocus(e, component){
    ////(e, component);
  }

  componentWillMount(){
      this.updateValueIfPresent();
  }

  updateValueIfPresent = () => {

    var displayName = this.props.displayName.split(" ");

    var formData = {};
    formData.firstName = displayName[0];
    formData.lastName = displayName[1];
    var uploadURL = this.props.photoURL;
    this.setState({formData: formData,uploadURL:uploadURL,loading:false,opacity:0});
      return formData;
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
          ref='first_name'
          label ='Name'
          placeholder='First Name'
          multiline ={true}
          value= {this.state.formData.firstName}
          helpText={((self)=>{

            if(Object.keys(self.refs).length !== 0){
              if(!self.refs.registrationForm.refs.first_name.valid){
                return self.refs.registrationForm.refs.first_name.validationErrors.join("\n");
              }

            }
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
            ref='last_name'
            label ='Last Name'
            placeholder='Last Name'
            multiline ={true}
            value= {this.state.formData.lastName}
            helpText={((self)=>{

              if(Object.keys(self.refs).length !== 0){
                if(!self.refs.registrationForm.refs.last_name.valid){
                  return self.refs.registrationForm.refs.last_name.validationErrors.join("\n");
                }

              }
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
      width: width/2,
      height: height/4,
      alignSelf: 'center',
      justifyContent: 'center'
    },
    alignRight:{
      marginTop: 7, position:'absolute', right: 10
    }



  });
