import React, {Component} from 'react';
import firebase from "firebase";
import{
  View,
  Text,
  StyleSheet,
  Button,
  TabBarIOS,
  Navigator,
  TouchableOpacity,
  Alert
} from 'react-native';
import Background from './Background';
import EventsHome from './events/EventsHome';
import ViewEvent from './events/ViewEvent';

import {SimpleApp} from './events/EventsHome';
import Settings from './settings/Settings';
import Contacts from './contacts/Contact';
import Chats from './chat/Chats'
import AddNewEvent from './events/AddNewEvent';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class Home extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedTab:'eventHome',
      rightButtonValidated: false
    }
  }




  _getClick = () => {
    var self = this;
    firebase.auth().signOut().then(function() {
    }).catch(function(error) {
      // An error happened.
    });
  }
  openMenu = (route) => {
    // console.log(this.refs);
    if (route.name === 'EventsHome') {
      // this.refs.nav.push({name:'AddNewEvent',
      //                     title: 'Add New',
      //                     openMenu: this.openMenu ,
      //                     closeMenu: this.closeMenu,
      //                     rightText: 'Save',
      //                     leftText: 'Close'
      //                   });
      // search view
    }
    else if (route.name === 'AddNewEvent') {
      this.refs.nav.refs.eventAdd.validate();
    } else if (route.name === 'ViewEvent') {
      console.log("Event clicked");
      console.log(route.eventDataLocation);

      this.refs.nav.push({
        name:'EditNewEvent',
        title: route.eventObject.event_title,
        eventObject: route.eventObject,
        openMenu: this.openMenu ,
        closeMenu: this.closeMenu,
        rightText: 'Update',
        leftText: 'Close',
        eventDataLocation: route.eventDataLocation,
        updateEventInView: this.refs.nav.refs.eventView.updateEvent,
        displayName : this.props.displayName

    } );
    } else if (route.name === 'EditNewEvent'){
      this.refs.nav.refs.editEvent.validate();
      console.log('Updated');
    }


  }
  onSaveButton = (rightButtonValidated) => {
    if(rightButtonValidated){
      console.log('Color save button');
    }
    // this.setState({ rightButtonValidated });

  }

  closeMenu = (route) => {
    console.log('close in home');
    if (route.name === 'EventsHome') {
      this.refs.nav.push({name:'AddNewEvent',
                          title: 'Add Event',
                          openMenu: this.openMenu ,
                          closeMenu: this.closeMenu,
                          rightText: 'Save',
                          leftText: 'Cancel',
                          onSaveButton: this.onSaveButton,
                            rightValid: this.state.rightButtonValidated,
                            displayName : this.props.displayName
                        });
    }else {
        this.refs.nav.pop();
    }

  }

// ios-add

  renderScreen = () => {
    if (this.state.selectedTab === 'eventHome'){
      return(
        <Navigator
              initialRoute = {{ name: 'EventsHome',
                                title: 'EventsHome',
                                openMenu: this.openMenu ,
                                closeMenu: this.closeMenu,
                                rightIcon: <Icon name="ios-search" size={30} style={[{color:'#4A90E2'},{marginRight:10}]}/> ,
                                leftIcon: <Icon name="ios-add" size={40} style={[{color:'#4A90E2'},{marginLeft:10}]}/>,
                            onSaveButton: this.onSaveButton,
                          rightValid: true}}
              renderScene = { renderRouterScene  }
              configureScene = {(route, routeStack) => {
                if(route.name === 'EditNewEvent'){
                  return Navigator.SceneConfigs.FloatFromBottom;
                } else {
                  return Navigator.SceneConfigs.FloatFromRight;
                }
              }

              }
              navigationBar = {
                 <Navigator.NavigationBar
                    style = { styles.navigationBar }
                    routeMapper = { NavigationBarRouteMapper } />
              }
              ref = "nav"
              sceneStyle={{paddingTop: 64}}
           />



        )
    } else if (this.state.selectedTab === 'settings'){
      return(<Settings/>)
    }else if (this.state.selectedTab === 'contacts'){
      return(<Contacts/>)
    }else if (this.state.selectedTab === 'chats'){
      return(<Chats/>)
    }
  }

  componentWillMount(){
    console.log('nothing');

  }


  render() {
    const { rightButtonValidated } = this.state.rightButtonValidated;

    return (

      <TabBarIOS>
      <MaterialIcon.TabBarItem
        title=""
        iconName="event-note"

        selected={this.state.selectedTab === 'eventHome'}
        onPress={() => {
          this.setState({
            selectedTab: 'eventHome',

          });
        }}
        >
         {this.renderScreen()}
      </MaterialIcon.TabBarItem>

      <Icon.TabBarItem
          title=""
          iconName="ios-people-outline"
          selected={this.state.selectedTab === 'contacts'}
          onPress={() => {
            this.setState({
              selectedTab: 'contacts',

            });
          }}>
          {this.renderScreen()}
      </Icon.TabBarItem>

      <Icon.TabBarItem
        title=""
        iconName="ios-text-outline"

        selected={this.state.selectedTab === 'chats'}
        onPress={() => {
          this.setState({
            selectedTab: 'chats',

          });
        }}
        >
         {this.renderScreen()}
      </Icon.TabBarItem>

      <Icon.TabBarItem
          title=""
          iconName="ios-settings-outline"
          selected={this.state.selectedTab === 'settings'}
          onPress={() => {
            this.setState({
              selectedTab: 'settings',

            });
          }}>
          {this.renderScreen()}
      </Icon.TabBarItem>

    </TabBarIOS>


    );
  }
}



var NavigationBarRouteMapper = {
   LeftButton(route, navigator, index, navState) {
      // if(index > 0) {
      console.log(route);

      if(route.leftIcon) {
        return(
          <TouchableOpacity
             onPress = { () =>

                 route.closeMenu(route)

             }>
             {route.leftIcon}
          </TouchableOpacity>

        )

        } else {
          return (
            <TouchableOpacity

               onPress = { () =>

                   route.closeMenu(route)

               }>
               <Text style={ styles.leftButton }> {route.leftText} </Text>
            </TouchableOpacity>
          )

        }
   },
   RightButton(route, navigator, index, navState) {


     if(route.rightIcon) {
       return (
         <TouchableOpacity
            onPress = { () =>

                route.openMenu(route)

            }>
            {route.rightIcon}
         </TouchableOpacity>

       );

       } else {
         return (
           <TouchableOpacity
              onPress = { () =>

                  route.openMenu(route)

              }>
              <Text style = {styles.rightButton}> {route.rightText} </Text>
           </TouchableOpacity>
         );

       }


   },
   Title(route, navigator, index, navState) {
      return (
         <Text style = { styles.title }>
            {route.title}
         </Text>
      )
   }
};

const renderRouterScene = (route, navigator) => {
      if(route.name === 'EventsHome') {
         return (
            <EventsHome
               navigator = {navigator}
               {...route.passProps}
               openMenu = {route.openMenu}
               closeMenu = {route.closeMenu}
            />
         )
      }
      if(route.name === 'AddNewEvent') {
         return (
            <AddNewEvent
               navigator = {navigator}
               {...route.passProps}
               route={route}
               ref='eventAdd'
               displayName={route.displayName}
            />
         )
      }
      if(route.name === 'EditNewEvent') {
        console.log("gonna edit");
        console.log(route.eventDataLocation);
         return (
            <AddNewEvent
               navigator = {navigator}
               {...route.passProps}
               route={route}
               ref='editEvent'
               eventObject={route.eventObject}
               eventDataLocation = {route.eventDataLocation}
               displayName={route.displayName}
            />
         )
      }

      if(route.name === 'ViewEvent') {
         return (
            <ViewEvent
               navigator = {navigator}
               {...route.passProps}
               route={route}
               eventObject = {route.eventObject}
               ref='eventView'
            />
         )
      }
   }



const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,

  },

  navigationBar: {
      backgroundColor: '#ffffff',
   },
   leftButton: {
      color: '#4A90E2',
      margin: 10,
      fontSize: 17,
   },
   title: {
      paddingVertical: 10,
      color: '#000000',
      justifyContent: 'center',
      fontSize: 18
   },
   rightButton: {
     color: '#4A90E2',
      margin: 10,
      fontSize: 16
   }
});
