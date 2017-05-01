import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';

import ChatGroupInfo from './ChatGroupInfo';
import firebase from 'firebase';
import {database} from '../Config';

export default class ChatHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      channel: null,
      userRef: null,
      allEvents: []
    }


  }

  componentDidMount(){
    this.loadUserChatInfo();
  }

  loadUserChatInfo = () => {

    var self = this;
    var userRef = database.ref('users').child(this.props.userUid);

    userRef.once('value', function(snapshot){
      console.log("In value snapshot");
      var attendingEvents = snapshot.val().attendingEvents;
      var createdEvents = snapshot.val().createdEvents;

      var subgroupInfo = snapshot.val().subgroupInfo;

      console.log(attendingEvents);
      console.log(createdEvents);
      var allEvents = [];
     if (attendingEvents){
       Object.keys(attendingEvents).forEach(function(events) {
         var obj = {};
         obj[events] = attendingEvents[events];
           allEvents.push(obj);
       });
     }

     if(createdEvents){
       Object.keys(createdEvents).forEach(function(events) {
         var obj = {};
         obj[events] = createdEvents[events];
           allEvents.push(obj);
       });

     }

     if(subgroupInfo){
       Object.keys(subgroupInfo).forEach(function(events){

         var obj = {};
         obj[events] = subgroupInfo[events];
         allEvents.push(obj);

       });
     }


      self.setState({allEvents: allEvents});

      // for (events in attendingEvents){
      //   allEvents.push({events: attendingEvents[events]});
      // }
      //
      // for (created in createdEvents){
      //   allEvents.push({created: createdEvents[created]});
      // }
      console.log(allEvents);
    });


  }

  componentWillMount() {

  }
  componentWillUnmount(){

  }
  render() {
      return (
        <View style={styles.container}>
        <ScrollView

        >

        {

          (() => {
            var chatInfos = []
            if (this.state.allEvents.length > 0) {
              console.log('going to group chat');
              console.log(this.props);

              var itemChat = [];
              for (items in this.state.allEvents) {
                var eachEvent = this.state.allEvents[items];
                var userKey = null;
                var value = null;
                Object.keys(eachEvent).forEach(function(key) {
                  userKey = key;
                  value = eachEvent[key];
                });
                chatInfos.push(<ChatGroupInfo key = {userKey} channel = {value} route={this.props.route} userUid = {this.props.userUid}
                displayName= {this.props.displayName}
                eventUid = {userKey}
                callingFrom = {'ChatHome'}
                photoURL={this.props.photoURL} navigator={this.props.navigator}/>)

              }
              return chatInfos;

            } else {
              return (<Text style={{fontSize:20}}> I am home </Text>);
            }
          }
          )()

        }

        </ScrollView>

        </View>

      );
  }
  }

  const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexDirection: 'row'
  }
  })
