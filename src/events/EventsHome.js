import React, { Component, PropTypes } from 'react';
import { Image, Dimensions,Text,View,ScrollView,TouchableHighlight,StyleSheet,Navigator,AsyncStorage ,TouchableOpacity} from 'react-native';
import AddNewEvent from './AddNewEvent'
import Icon from 'react-native-vector-icons/Ionicons'
import { globals,styles } from '../styles';

import {database} from '../Config';
import firebase from 'firebase';
import EventBox from './EventBox';

var {height, width} = Dimensions.get('window');


export default class EventsHome extends Component {

    constructor(props){
      super(props);
      this.state = {
        screen:'',
        createdEvents:{},
        unattendEvents: {},
        attendingEvents: {}
      }
      // this.loadParent();
      // this.loadAllNonEvents();
    }

    componentDidMount(){
      this.loadParent();
      this.loadAllNonEvents();
    }

    loadParent = async() =>{
      let userUid = this.props.userUid;
      // console(userUid);
      var self = this;
      let userRef =  database.ref('users/' + userUid + '/createdEvents/' );
          userRef.orderByChild("sortDate").startAt((new Date()).getTime()).on('value', function(snapshot) {
            if (snapshot.val()){
                self.setState({createdEvents:snapshot.val()});
            }


          });

    }

    loadAttendingEvent = async() => {

    }
    addNewEvent = () => {
      this.props.navigator.push({name:'AddNewEvent',
                          title: 'Add Event',
                          openMenu: this.props.openMenu ,
                          closeMenu: this.props.closeMenu,
                          rightText: 'Save',
                          leftText: 'Cancel',
                            rightValid: true,
                            displayName : this.props.displayName,
                            userUid : this.props.userUid,
                            photoURL: this.props.photoURL,
                            sex: this.props.sex
                        });
    }

    goToEventSearch = () => {
       var itemInfo = [];
        for (items in this.state.createdEvents){
          var eachItem = this.state.createdEvents[items];

          var name = eachItem['event_title'];
          var image = eachItem['uploadURL']


        itemInfo.push(  <EventBox key={items} dataLocation = {items} navigator ={this.props.navigator}
          displayName = {this.props.displayName} photoURL={this.props.photoURL} userUid = {this.props.userUid}
          eventObject={eachItem} openMenu= {this.props.openMenu} type={'search'}closeMenu={this.props.closeMenu} />);
        }
        return itemInfo;

      }


    loadAllNonEvents = async() =>{
      let userUid = this.props.userUid;
      // console(userUid);
      // console("On no events");
      var self = this;
      var userUnattendedEvents = {};
      var userAttendingEvents = {};

      let userRef =  database.ref('/events/' );
          userRef.orderByChild("sortDate").startAt((new Date()).getTime()).on('value', function(snapshot) {
            snapshot.forEach(function(child){
              var key = child.key;
              var value = child.val();



              var userAttend = database.ref('users/' + userUid).child('attendingEvents');

            userAttend.orderByChild("sortDate").startAt((new Date()).getTime()).on('value', function(presentInUser){
              // console('presentInUser ');
              // console(presentInUser.val());
              if (presentInUser.hasChild(key)){
                // console('I have child here');

                 var userAttended = presentInUser.val();

                 userAttendingEvents[key] = userAttended[key];

              } else {

                if (value['owner_id'] != self.props.userUid) {
                  userUnattendedEvents[key] = value;
                }

              }
              // console("User attending info");
              // console(userAttendingEvents);
              self.setState({unattendEvents:userUnattendedEvents, attendingEvents:userAttendingEvents});

            });


            });


          });

    }


    render() {

        return (

          <View style={myStyles.container}>
          {
            (() => {
              try {
                if (this.state.createdEvents != null){


                  if(Object.keys(this.state.createdEvents).length > 0){
                    return (
                      <View style={myStyles.container}>
                      <Text style={[{fontSize: 20},{textAlign:'center'},{color: '#000000'}]}> Your Created Events </Text>
                      <ScrollView  horizontal={true} vertical={false}
                      showsVerticalScrollIndicator={false}
                      >
                      {
                        (()=> {
                           var itemInfo = [];
                            for (items in this.state.createdEvents){
                              var eachItem = this.state.createdEvents[items];

                              var name = eachItem['event_title'];
                              var image = eachItem['uploadURL']


                            itemInfo.push(  <EventBox key={items} dataLocation = {items} navigator ={this.props.navigator}
                              displayName = {this.props.displayName} photoURL={this.props.photoURL} userUid = {this.props.userUid}
                              eventObject={eachItem} openMenu= {this.props.openMenu} closeMenu={this.props.closeMenu} />);
                            }
                            return itemInfo;

                          })()
                        }
                        </ScrollView>
                        </View>

                      )} else {

                        return (
                          <View style={myStyles.imageContainer}>
                          <TouchableOpacity onPress={this.addNewEvent}>
                          <Text style={[{fontSize: 20},{color: '#000000'}]}> Create New Events </Text>
                          <Icon name="ios-add-circle" size={100} style={[{color:'#4A90E2'},{marginLeft:40}]}/>
                          </TouchableOpacity>

                          </View>);

                      }
                    }

              } catch(e){
                // console(e);
              }
            })()

          }
          {
            (() => {
              try {
                if (this.state.attendingEvents != null){


                  if(Object.keys(this.state.attendingEvents).length > 0){
                    return (
                      <View style={[myStyles.container]}>
                      <Text style={[{fontSize: 20},{textAlign:'center'},{color: '#000000'}]}>Your Upcoming Events </Text>
                      <ScrollView  horizontal={true} vertical={false}
                      showsVerticalScrollIndicator={false}
                      >
                      {
                        (()=> {
                           var itemInfo = [];
                            for (items in this.state.attendingEvents){
                              var eachItem = this.state.attendingEvents[items];

                              var name = eachItem['event_title'];
                              var image = eachItem['uploadURL']


                            itemInfo.push(  <EventBox key={items} dataLocation = {items} navigator ={this.props.navigator}
                              displayName = {this.props.displayName} photoURL={this.props.photoURL} userUid = {this.props.userUid}
                              eventObject={eachItem} openMenu= {this.props.openMenu} joinEvent ={'false'} closeMenu={this.props.closeMenu} />);
                            }
                            return itemInfo;

                          })()
                        }
                        </ScrollView>
                        </View>

                      )} else {

                        return (
                          <View style={myStyles.imageContainer}>
                          <TouchableOpacity onPress={this.addNewEvent}>
                          <Text style={[{fontSize: 20},{color: '#000000'}]}> No Upcoming Events </Text>
                          <Icon name="ios-add-circle" size={100} style={[{color:'#4A90E2'},{marginLeft:40}]}/>
                          </TouchableOpacity>

                          </View>);

                      }
                    }

              } catch(e){
                // console(e);
              }
            })()

          }
          {
            (() => {
              try {
                if (this.state.unattendEvents != null){


                  if(Object.keys(this.state.unattendEvents).length > 0){
                    return (
                      <View style={[myStyles.container]}>
                      <Text style={[{fontSize: 20},{textAlign:'center'},{color: '#000000'}]}> Recommended Events </Text>
                      <ScrollView  horizontal={true} vertical={false}
                      showsVerticalScrollIndicator={false}
                      >
                      {
                        (()=> {
                           var itemInfo = [];
                            for (items in this.state.unattendEvents){
                              var eachItem = this.state.unattendEvents[items];

                              var name = eachItem['event_title'];
                              var image = eachItem['uploadURL']


                            itemInfo.push(  <EventBox key={items} dataLocation = {items} navigator ={this.props.navigator}
                              displayName = {this.props.displayName} photoURL={this.props.photoURL} userUid = {this.props.userUid}
                              eventObject={eachItem} openMenu= {this.props.openMenu} joinEvent ={'true'} closeMenu={this.props.closeMenu} />);
                            }
                            return itemInfo;

                          })()
                        }
                        </ScrollView>
                        </View>

                      )} else {

                        return (
                          <View style={myStyles.imageContainer}>
                          <TouchableOpacity onPress={this.addNewEvent}>
                          <Text style={[{fontSize: 20},{color: '#000000'}]}> No Searched Events </Text>
                          <Icon name="ios-add-circle" size={100} style={[{color:'#4A90E2'},{marginLeft:40}]}/>
                          </TouchableOpacity>

                          </View>);

                      }
                    }

              } catch(e){
                // console(e);
              }
            })()

          }

          </View>

        );
  }
}
var myStyles = StyleSheet.create({
  container: {
    flex: 1,

  },
  wrapper: {
    backgroundColor: '#F5FCFF',

  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  imageContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20


  }
});
