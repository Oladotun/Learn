import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert
} from 'react-native';

import {database} from '../Config';
import Icon from 'react-native-vector-icons/Ionicons';




export default class JoinEvent extends Component{

  constructor(props){
    super(props);
    this.state = {
      text:'',
      sex:''
    }
  }


  updateEventInfo = () =>{
    // Set member in Events

    if (this.state.text === '') {

      Alert.alert('Introduction Required', "Kindly introduce yourself", [{
          text: 'OK',
      //     onPress: () => {// console('aint legal');}
        }]);
        return;
    }

    let userUid = this.props.userUid;

    let attendingEventsRef =  database.ref('users/' + userUid + '/attendingEvents/' );
    let attendingEventsInfo = attendingEventsRef.child(this.props.eventDataLocation);
    var chatMemberRef= database.ref('chatMembers');
    var chatRef = database.ref('chat');
    var eventString = this.props.eventDataLocation;
    var userInfo = {};

    attendingEventsInfo.set({
      'event_title' : this.props.eventObject.event_title,
      'event_time' : this.props.eventObject.event_time,
      'uploadURL' : this.props.eventObject.uploadURL,
      'sortDate': this.props.eventObject.sortDate
    });

    userInfo[eventString] = {
      'displayName': this.props.displayName,
      'photoURL' : this.props.photoURL
    };

    var now = new Date().getTime();
    chatRef.child(eventString).push({
      _id: now,
      text: this.state.text,
      createdAt: now,
      uid: this.props.userUid,
      avatar: this.props.photoURL,
      name: this.props.displayName,
      order: -1 * now

    });

    chatMemberRef.child(eventString).child(this.props.userUid).update(userInfo[eventString]);


    this.props.navigator.push({
                          name: 'Chat',
                          title: this.props.eventObject.event_title,
                          openMenu: this.props.route.openMenu ,
                          closeMenu: this.props.route.closeMenu,
                          rightText: "More Info" ,
                          leftText: "Back",
                          displayName: this.props.displayName,
                          userUid: this.props.userUid,
                          photoURL: this.props.photoURL,
                          eventUid: this.props.eventDataLocation,
                          viewType: "None"


      });



  }

  render() {
    var eventObject = this.props.eventObject;
    return(
      <View style={{flex:1}}>
      <View style={styles.container}>
      <Text style= {styles.message}> {eventObject['host_name']} want you to chat with other guests. </Text>
      <Text style= {styles.message}> Add a little Introduction about yourself below </Text>


     </View>
     <View style={{
       backgroundColor: '#4A90E2',
       borderBottomColor: '#000000',
       borderTopWidth: 1,
       borderBottomWidth: 1 }}>
     <TextInput
      multiline = {true}
       numberOfLines = {4}
       onChangeText={(text) => this.setState({text})}
       value={this.state.text}
       editable = {true}
       style ={{height:50}}
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
