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
        createdEvents:{}
      }
      this.loadParent();
    }

    loadParent = async() =>{
      let userUid = await AsyncStorage.getItem('@userUid:key');
      console.log(userUid);
      var self = this;
      let userRef =  database.ref('users/' + userUid + '/createdEvents/' );
      // let starCountRef = firebase.database().ref('/users/' + userUid);
          userRef.on('value', function(snapshot) {
            console.log(snapshot.val());
            self.setState({createdEvents:snapshot.val()});
            var info = snapshot.val();
            for ((obj) in info) {
              console.log(info[obj]);
              console.log(obj);
              console.log('\n');
            }
            // console.log("In event db");

          });

          // console.log(this.state.createdEvents)

    }



    visitEvent = (event) => {
      console.log('my event pressed');
    }
    render() {
      console.log("In events home view ");
      console.log(this.props);

        return (

          <View style={styles.container}>
          {
            (() => {
              try {
                if (this.state.createdEvents != null){
                  console.log(Object.keys(this.state.createdEvents).length);

                  if(Object.keys(this.state.createdEvents).length > 0){
                    console.log('length is long');


                    return (
                      <ScrollView style={{height:height/4}} horizontal={true} vertical={false}
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

                      )}
                    }

              } catch(e){
                console.log(e);
              }
            })()

          }

          <View style={{height:height/3}}>
            <Text style = {styles.welcome}>help</Text>
          </View>







          </View>

        );
  }
}
var myStyles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    backgroundColor: '#F5FCFF',

  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
