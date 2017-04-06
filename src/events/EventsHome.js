import React, { Component, PropTypes } from 'react';
import { Image, Dimensions,Text,View,ScrollView,TouchableHighlight,StyleSheet,Navigator,AsyncStorage ,TouchableOpacity} from 'react-native';
import AddNewEvent from './AddNewEvent'
import Icon from 'react-native-vector-icons/Ionicons'
import { globals,styles } from '../styles';

import {database} from '../ProfileSetup';
import firebase from 'firebase';
import EventBox from './EventBox';

var {height, width} = Dimensions.get('window');


export default class EventsHome extends Component {

    constructor(props){
      super(props);
      this.state = {
        screen:'',
        createdEvents:{},
        unattendEvents: {}
      }
      this.loadParent();
      this.loadAllNonEvents();
    }

    loadParent = async() =>{
      let userUid = this.props.userUid;
      console.log(userUid);
      var self = this;
      let userRef =  database.ref('users/' + userUid + '/createdEvents/' );
          userRef.on('value', function(snapshot) {
            self.setState({createdEvents:snapshot.val()});

          });

    }


    loadAllNonEvents = async() =>{
      let userUid = this.props.userUid;
      console.log(userUid);
      console.log("On no events");
      var self = this;
      var userUnattendedEvents = {}
      let userRef =  database.ref('/events/' );
          userRef.on('value', function(snapshot) {
            snapshot.forEach(function(child){
              var key = child.key;
              var value = child.val();

              if (value['owner_id'] != self.props.userUid) {
                userUnattendedEvents[key] = value;
              }
            });
            self.setState({unattendEvents:userUnattendedEvents});


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
                      <View style={styles.container}>
                      <Text style={[{fontSize: 20},{textAlign:'center'},{color: '#000000'}]}> My Created Events </Text>
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
                          <TouchableOpacity>
                          <Text style={[{fontSize: 20},{color: '#000000'}]}> Create Events </Text>
                          <Icon name="ios-add-circle" size={100} style={[{color:'#4A90E2'},{marginLeft:40}]}/>
                          </TouchableOpacity>

                          </View>);

                      }
                    }

              } catch(e){
                console.log(e);
              }
            })()

          }


          {
            (() => {
              try {
                if (this.state.unattendEvents != null){


                  if(Object.keys(this.state.unattendEvents).length > 0){
                    return (
                      <View style={[styles.container,{marginTop:10}]}>
                      <Text style={[{fontSize: 20},{textAlign:'center'},{color: '#000000'}]}> Upcoming Events </Text>
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
                          <TouchableOpacity>
                          <Text style={[{fontSize: 20},{color: '#000000'}]}> Create Events </Text>
                          <Icon name="ios-add-circle" size={100} style={[{color:'#4A90E2'},{marginLeft:40}]}/>
                          </TouchableOpacity>

                          </View>);

                      }
                    }

              } catch(e){
                console.log(e);
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
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20


  }
});
