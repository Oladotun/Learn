import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
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
      var attendingEvents = snapshot.val().attendingEvents;
      var createdEvents = snapshot.val().createdEvents;

      console.log(attendingEvents);
      console.log(createdEvents);
      var allEvents = [];

      Object.keys(attendingEvents).forEach(function(events) {
        var obj = {};
        obj[events] = attendingEvents[events];
          allEvents.push(obj);
      });

      Object.keys(createdEvents).forEach(function(events) {
        var obj = {};
        obj[events] = createdEvents[events];
          allEvents.push(obj);
      });

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
        {
          (() => {
            var chatInfos = []
            if (this.state.allEvents.length > 0) {
              console.log('going to group chat');
              console.log(this.props);
              var itemChat = [];
              for (items in this.state.allEvents) {
                var eachEvent = this.state.allEvents[items]
                console.log(eachEvent)
                console.log(items)
                var userKey = null;
                var value = null;
                Object.keys(eachEvent).forEach(function(key) {
                  userKey = key;
                  value = eachEvent[key];
                });
                chatInfos.push(<ChatGroupInfo key = {userKey} channel = {value} route={this.props.route} userUid = {this.props.userUid}
                displayName= {this.props.displayName}
                eventUid = {userKey}
                photoURL={this.props.photoURL} navigator={this.props.navigator}/>)

              }
              return chatInfos;

            } else {
              return (<Text style={{fontSize:20}}> I am home </Text>);
            }
          }
          )()

        }

        </View>

      );
  }
  }

  const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginRight: 10,
      marginLeft: 10,
      marginBottom: 50
  }
  })
