import React, { Component, PropTypes } from 'react';
import RadioForm, {RadioButtonLabel} from 'react-native-simple-radio-button';
import {
  StyleSheet,
  View,
  Text,
  TextInput
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
      text:'',
    }
  }

  joinEventSubGroup = () => {
    var lastOpenRef = null;
    if (this.props.sex === 'male'){
      lastOpenRef = database.ref('events/' + this.props.eventDataLocation).child('openSubgroupMale');
    } else {
      lastOpenRef = database.ref('events/' + this.props.eventDataLocation).child('openSubgroupFemale');

    }
    var self = this;

    lastOpenRef.once('value').then(function(snapshot) {
      var lastGroupCreatedInfo = snapshot.val();

      if(lastGroupCreatedInfo === 'Create New Group'){
        self.databaseCreateSubGroupChat();
      } else {
        self.databaseJoinSubGroupChat(lastGroupCreatedInfo);
      }
      // ...
});

  }

  databaseFindNextSubGroupChat(){
    var parentEventSubGroupRef = database.ref('parentEventSubGroup');
    var parentSubGroups = parentEventSubGroupRef.child(this.props.eventDataLocation);
    var eventLocationRef = database.ref('events/' + this.props.eventDataLocation);

    var self = this;
    parentSubGroups.once('value').then(function(snapshot) {
      // snapshot.forEach(function(child){
      //   var value = child.value();
      //
      // });

      for (childKey in snapshot) {
        var child = snapshot[childKey];

        if(child[self.props.sex] < child['max_users']/2 ){
          var parentInfo = child['parent_chatInfo'];

          if(self.props.sex === 'male'){
            eventLocationRef.update({'openSubgroupMale': childKey});
          }else {
            eventLocationRef.update({'openSubgroupFemale': childKey})
          }
          return;
        }
      }

      if(self.props.sex === 'male'){
        eventLocationRef.update({'openSubgroupMale': 'Create New Group'});
      }else {
        eventLocationRef.update({'openSubgroupFemale': 'Create New Group'})
      }



    });
  }


  databaseJoinSubGroupChat = (lastGroupString) => {
    var userRef =  database.ref('users/' + this.props.userUid );
    var eventLocationRef = database.ref('events/' + this.props.eventDataLocation);
    var subgroupRef = database.ref('eventSubGroup')
    var currSubGroupRef = subgroupRef.child(lastGroupString);
    var chatMemberRef= database.ref('chatMembers');
    var parentEventSubGroupRef = database.ref('parentEventSubGroup');
    var userInfo = {};

    // subgroupString
    var self = this;
    var subgroupchat = {};
    subgroupchat['subgroup'] = lastGroupString;

    currSubGroupRef.once('value').then(function(snapshot){
      var subgroupInfo = snapshot.val();
      if (subgroupInfo[self.props.sex] < subgroupInfo['max_users']/2){

        userInfo[self.props.eventDataLocation] = {
          'displayName': self.props.displayName,
          'photoURL' : self.props.photoURL,
          'sex': self.props.sex
        };

        chatMemberRef.child(self.props.eventDataLocation).child(self.props.userUid).update(userInfo[self.props.eventDataLocation]);
        chatMemberRef.child(lastGroupString).child(self.props.userUid).update(userInfo[self.props.eventDataLocation]);
        // Update Sub group sex count
        subgroupInfo[self.props.sex] = subgroupInfo[self.props.sex] + 1;
        userRef.child('subgroupInfo').child(lastGroupString).update(subgroupInfo);
        snapshot.ref.update(subgroupInfo);
        parentEventSubGroupRef.child(self.props.eventDataLocation).child(lastGroupString).update(subgroupInfo);
        userRef.child('attendingEvents').child(this.props.eventDataLocation).update(subgroupchat);

        if (subgroupInfo[self.props.sex] >= subgroupInfo['max_users']/2 ){
          // find next group chat and update
          self.databaseFindNextSubGroupChat();
        }

      } else {
        self.databaseCreateSubGroupChat();
      }
    });



  }

  databaseCreateSubGroupChat = () => {
    var userRef =  database.ref('users/' + this.props.userUid );
    var eventLocationRef = database.ref('events/' + this.props.eventDataLocation);
    var subgroupRef = database.ref('eventSubGroup');
    var parentEventSubGroupRef = database.ref('parentEventSubGroup');
    var chatMemberRef= database.ref('chatMembers');

    var eventString = this.props.eventDataLocation;
    var eventSubGroupRef = subgroupRef.push();
    var subgroupString = eventSubGroupRef.key;

    var info = {};
    var userInfo = {};
    var subgroupInfo = {};


    userInfo[eventString] = {
      'displayName': this.props.displayName,
      'photoURL' : this.props.photoURL,
      'sex': this.props.sex
    };

    var malecount = 0;
    var femalecount = 0;
    var subgroupChatLocation = {};
    var subgroupSex = '';
    if (this.props.sex === 'male'){
      malecount = 1;
      subgroupChatLocation['openSubgroupMale'] = subgroupString;
      subgroupSex = 'openSubgroupMale';

    } else {
      femalecount = 1;
      subgroupChatLocation['openSubgroupFemale'] = subgroupString;
      subgroupSex = 'openSubgroupFemale';
    }
    subgroupInfo[subgroupString] = {
      'max_users': this.props.eventObject.user_per_groupchat,
      'male': malecount,
      'female': femalecount,
      'event_title' :this.props.eventObject.event_title,
      'event_time' : this.props.eventObject.event_time,
      'uploadURL' : this.props.eventObject.uploadURL,
      'parent_chatInfo': this.props.eventDataLocation,
      'currentCount': 1,
      'version': this.props.eventObject.subgroupVersion + 1
    }

    var subgroupchat = {    };
    subgroupchat['subgroup'] = subgroupString;


    eventLocationRef.update({'attendingCount': this.props.eventObject.attendingCount + 1,
                            'subgroupVersion': this.props.eventObject.subgroupVersion + 1,
                           subgroupChatLocation

                          });

    parentEventSubGroupRef.child(this.props.eventDataLocation).child(subgroupString).update(subgroupInfo[subgroupString]);
    chatMemberRef.child(eventString).child(this.props.userUid).update(userInfo[eventString]);
    chatMemberRef.child(subgroupString).child(this.props.userUid).update(userInfo[eventString]);
    subgroupRef.child(subgroupString).update(subgroupInfo[subgroupString]);
    userRef.child('subgroupInfo').child(subgroupString).update(subgroupInfo[subgroupString]);
    userRef.child('attendingEvents').child(this.props.eventDataLocation).update(subgroupchat);
    // last group male
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

    this.joinEventSubGroup();


    // let eventRef = database.ref('events/').child(this.props.eventDataLocation);

    // var admin = true;
    //
    // if (this.state.value == 1){
    //   admin = false;
    // }
    //
    // let groups = eventRef.child('attending').child(userUid).set({
    //   'displayName': this.props.displayName,
    //   'admin': admin
    // });



    console.log('Joined');
    console.log(this.props.navigator.getCurrentRoutes());
    var routesArray = this.props.navigator.getCurrentRoutes();
    var homeRoute = routesArray[0];
    this.props.navigator.jumpTo(homeRoute);

    // Set User Attending Event info

    //


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
       backgroundColor: this.state.text,
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
