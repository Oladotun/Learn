import React, { Component, PropTypes } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../styles/colors';
var {height, width} = Dimensions.get('window');

export default class ViewEvent extends Component{
  static propTypes = {
    eventObject:  PropTypes.object.isRequired
  }

  render(){
    const{eventObject} = this.props;
    var newObject = {
      event_title: '',
      event_time : '',
      event_website : '',
     is_event_private: false,
     place :null,
     uploadURL : '',
     user_per_groupchat : '',
     event_category : '',
     event_description : ''

   };
    // var event_title = '';
    // var event_time = '';
    // var is_event_private = false;
    // var place = null;
    // var uploadURL = '';
    // var user_per_groupchat = '';
    // var event_category = '';
    // var event_description = '';

    Object.keys(eventObject).forEach(function(key) {
      newObject[key] = eventObject[key];
      console.log("I am copying");
      console.log(newObject[key]);
    });


    return (
      <View style={styles.container}>
      <Image
      style={styles.imageContainer}
        source={{ uri: newObject['uploadURL'] }}>

      </Image>

      <View style={styles.iconView}>
       <Text style={styles.message}> Event Title </Text>
       <Text style={styles.message}> {newObject['event_title']} </Text>

      </View>



      </View>

    );
  }
}

const styles = StyleSheet.create({
  message: {
    fontSize: 20

  },
  iconView:{
    flexDirection: 'row'
  },
  container: {
    flex:1
  },
  imageContainer: {
    backgroundColor: Colors.blue,
    width: width,
    height: height/5,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
