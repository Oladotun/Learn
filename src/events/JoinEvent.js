import React, { Component, PropTypes } from 'react';
import RadioForm, {RadioButtonLabel} from 'react-native-simple-radio-button';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import {database} from '../Config';
import Icon from 'react-native-vector-icons/Ionicons';


let radio_props = [ {label: 'Yes', value: 0 },
  {label: 'No', value: 1 }
];

export default class JoinEvent extends Component{

  constructor(props){
    super(props);
    this.state = {
      value:0,
    }
  }

  updateEventInfo = () =>{
    // Set member in Events

    let userUid = this.props.userUid;
    console.log(userUid);
    console.log(this.props);
    let attendingEventsRef =  database.ref('users/' + userUid + '/attendingEvents/' );
    let attendingEventsInfo = attendingEventsRef.child(this.props.eventDataLocation);

    attendingEventsInfo.set({
      'event_title' : this.props.eventObject.event_title,
      'event_time' : this.props.eventObject.event_time,
      'uploadURL' : this.props.eventObject.uploadURL
    });


    let eventRef = database.ref('events/').child(this.props.eventDataLocation);

    var admin = true;

    if (this.state.value == 1){
      admin = false;
    }

    let groups = eventRef.child('attending').child(userUid).set({
      'displayName': this.props.displayName,
      'admin': admin
    });

    console.log('Joined');
    console.log(this.props.navigator.getCurrentRoutes());
    var routesArray = this.props.navigator.getCurrentRoutes();
    var homeRoute = routesArray[0];
    this.props.navigator.jumpTo(homeRoute);

    // Set User Attending Event info

    //


  }

  render() {
    return(
      <View style={{flex:1}}>
      <View style={styles.container}>
      <Text style= {styles.message}> Oremi puts you in a group chat to start interacting with guests. </Text>
      <Text style= {styles.message}> Would you like to be a group chat admin ? </Text>


     </View>
     <View style={{alignSelf: 'center'}}>
     <RadioForm
       radio_props={radio_props}
       initial={0}
       onPress={(value) => {this.setState({value:value})}}
     />
     </View>
     </View>
    )
  }


}

const styles = StyleSheet.create({
  message: {
    fontSize: 15

  },
  titleMessage:{
    fontSize: 25,
  }
  ,
  infoView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10
  }
  ,
  iconView:{
    flexDirection: 'row',
    justifyContent: 'space-between',


  },
  container: {
    justifyContent: 'center',
    alignItems: 'center'

  },



});
