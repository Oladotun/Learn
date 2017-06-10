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
export default class ViewProfile extends Component{
  constructor(props){
    super(props);
    this.state = {
      formData:{
        firstName: '',
        lastName: ''

      },
    uploadURL: 'nothing'
    }
  }

  _pickImage() {
    console.log("nothing");
  }





  // handleFormChange(formData){
  //
  //   // if (formData.firstName == undefined || formData.lastName == undefined) {
  //   //   formData.firstName = '';
  //   //   formData.lastName = '';
  //   // }
  //   console.log(formData);
  //
  //   const updatedFormData = this.state.formData;
  //
  //   Object.keys(formData).forEach(function(key) {
  //     updatedFormData[key] =formData[key];
  //   });
  //
  //   this.setState({formData:updatedFormData, namechange:true});
  //   console.log(this.state.formData);
  //   this.props.onFormChange && this.props.onFormChange(formData);
  //
  //
  // }

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
      <View  style={{flex:1}} >

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

                  <TouchableOpacity
                  onPress={ () => this._pickImage()}>

                  <Image
                  style={myStyles.imageContainer}
                    source={{ uri: this.state.uploadURL }}>
                      <ActivityIndicator style={{opacity: this.state.opacity}}/>
                    </Image>

                  </TouchableOpacity>
                )
          }
        })()

      }


      <Form
        ref='registrationForm'
        label="Personal Information">

        <InputField
          ref='firstName'
          label ='Name'
          placeholder='First Name'
          multiline ={true}
          editable={false}
          value= {this.state.formData.firstName}

          />

          <InputField
            ref='lastName'
            label ='Last Name'
            placeholder='Last Name'
            multiline ={true}
            value= {this.state.formData.lastName}
            editable={false}
            />
        </Form>
      </View>

    );
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
