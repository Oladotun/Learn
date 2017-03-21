import React, {Component} from 'react';
import{
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker'
import { styles,globals, formStyles, selectStyles, optionTextStyles, overlayStyles } from '../styles';
import Colors from '../styles/colors';
 var {height, width} = Dimensions.get('window');

export default class AddNewEvent extends Component {
  constructor(props){
    super(props);
    this.state = {
      firstName: '',
      lastName: '',

    }
  }

  closeMenu = () => {
    console.log('close');
    this.props.navigation.pop();
  }
  _test = () => {
    console.log('Test called');
  }

  render(){
    return <View style={myStyles.container}>
            <TouchableOpacity style={myStyles.imageContainer} onPress={this._test()}>
                <Icon name="ios-camera" size={30} color={Colors.white}/>
                <Text style={[otherStyles.h4, globals.primaryText]}>Add a Photo</Text>
            </TouchableOpacity>
              <Text style={myStyles.welcome}>Event Information</Text>
              <ScrollView>
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
                    placeholder='Your First Name'
                    placeholderTextColor='#C62828'
                    onSubmitEditing={(event) => {
                      this.refs.ThirdInput.focus();
                    }}
                  />
                </View>
              </ScrollView>

            </View>

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
    margin: 10,

  },
  imageContainer: {
    backgroundColor: Colors.blue,
    width: width,
    height: height/3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    height: height/15

  },
  inputField: {
    width: width,
    // height: 40,
    backgroundColor: Colors.white,
    // borderRadius: 5,
    // marginTop: 10,
    // marginLeft: 30,
    // marginRight: 30,
    alignItems: 'center',
    textAlign: 'center',
    color: '#fff'
  }
});
