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
    changed: false,
    namechange:false
    }
  }

  _pickImage() {
    this.setState({opacity: 1,loading: true })
    var self = this;
    ImagePicker.launchImageLibrary({}, response  => {
      // //(response);
      if (response.didCancel === true) {
        this.setState({ opacity: 0,loading:false})

      } else {
        console.log(response.uri);


        this.setState({ uploadURL: response.uri, opacity: 0,loading:false, changed:true});
        // console.log(this.props.userUid);

      }
    })
  }





  handleFormChange(formData){

    // if (formData.firstName == undefined || formData.lastName == undefined) {
    //   formData.firstName = '';
    //   formData.lastName = '';
    // }
    console.log(formData);

    const updatedFormData = this.state.formData;

    Object.keys(formData).forEach(function(key) {
      updatedFormData[key] =formData[key];
    });

    this.setState({formData:updatedFormData, namechange:true});
    console.log(this.state.formData);
    this.props.onFormChange && this.props.onFormChange(formData);


  }

  pushPrevious = (url) => {
    this.props.navigator.push(
      {
        name:'Settings',
        title: 'Settings',
        openMenu: this.props.openMenu ,
        closeMenu: this.props.closeMenu,
        userUid : this.props.userUid,
        displayName: this.state.formData.firstName + " " + this.state.formData.lastName,
        photoURL: this.state.uploadURL,
        updateName: this.props.updateName,
        updateImage: this.props.updateImage

    }
    );


    console.log("push to previous");
  }

  validate = () => {
    var userInfoRef = database.ref('users/' + this.props.userUid);

    if(this.state.formData.firstName === ''|| this.state.formData.lastName === ''){
      Alert.alert('Error!', "Name Cannot Be Empty", [{
          text: 'OK',
      //     onPress: () => {//('aint legal');}
        }]);
        return
    }

    if (this.state.namechange){
      userInfoRef.update({
        displayName: this.state.formData.firstName + " " + this.state.formData.lastName
      });
      this.props.updateName(this.state.formData.firstName + " " + this.state.formData.lastName);
      if(!this.state.changed){

        this.props.navigator.replacePrevious(
          {
            name:'Settings',
            title: 'Settings',
            openMenu: this.props.openMenu ,
            closeMenu: this.props.closeMenu,
        userUid : this.props.userUid,
        displayName: this.state.formData.firstName + " " + this.state.formData.lastName,
        photoURL: this.state.uploadURL,
        updateName: this.props.updateName,
        updateImage: this.props.updateImage

        }
        );
      }
    }
    if(this.state.changed){
      this.setState({opacity:1, loading:true});
      var self = this;
      uploadImage(this.state.uploadURL, this.props.userUid)
        .then((url) => {
          userInfoRef.update({
            photoURL: `${url}`
          });
          self.setState({opacity:0, loading:false,uploadURL:url});
          self.props.updateImage(url);
        })
        .catch(error => {
          console.log(error);
          Alert.alert('Error!', "There was an error while uploading, try again", [{
              text: 'OK',
          //     onPress: () => {//('aint legal');}
            }]);

          // //(error)
        })
    } else {
      this.props.navigator.pop();
    }

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
        onFocus={this.handleFormFocus.bind(this)}
        onChange={this.handleFormChange.bind(this)}
        label="Personal Information">

        <InputField
          ref='firstName'
          label ='Name'
          placeholder='First Name'
          multiline ={true}
          value= {this.state.formData.firstName}
          helpText={((self)=>{

            if(Object.keys(self.refs).length !== 0){
              if(!self.refs.registrationForm.refs.firstName.valid){
                return self.refs.registrationForm.refs.firstName.validationErrors.join("\n");
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
            ref='lastName'
            label ='Last Name'
            placeholder='Last Name'
            multiline ={true}
            value= {this.state.formData.lastName}
            helpText={((self)=>{

              if(Object.keys(self.refs).length !== 0){
                if(!self.refs.registrationForm.refs.lastName.valid){
                  return self.refs.registrationForm.refs.lastName.validationErrors.join("\n");
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
