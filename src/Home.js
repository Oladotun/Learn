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
import ChatHome from './chat/ChatHome'
import Chat from './chat/Chats'
import ChatMoreInfo from './chat/ChatMoreInfo'
import AddNewEvent from './events/AddNewEvent';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import JoinEvent from './events/JoinEvent';
import SearchEvent from './events/SearchEvent';

export default class Home extends Component {

  constructor(props){
    super(props);
    if(this.props.chatUid == null){
      this.state = {
        selectedTab:'eventHome',
        rightButtonValidated: false
      }
    } else {
      this.state = {
        selectedTab:'chats',
        rightButtonValidated: false
      }
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
    // // console(this.refs);
    if (route.name === 'EventsHome') {
      // search view

    //  Get event box
    var eventArray = this.refs.nav.refs.eventsHome.goToEventSearch();
    // console('Search result');
    // console(eventArray);

      this.refs.nav.push({
        name:'SearchEvent',
        title: 'Find Event',
        openMenu: this.openMenu ,
        closeMenu: this.closeMenu,
        rightText: 'Done',
        leftIcon: <Icon name="ios-arrow-back" size={30} style={[{color:'#4A90E2'},{marginLeft:10}]}/>,
        displayName : this.props.displayName,
        userUid : this.props.userUid,
        eventArray: eventArray


    } );
    }
    else if (route.name === 'AddNewEvent') {
      this.refs.nav.refs.eventAdd.validate();
    } else if (route.name === 'ViewEvent') {
      // console("Event clicked");
      // console(route.eventDataLocation);

      if (route.rightText === 'Member Info'){

        this.refs.nav.push({
          name: 'ChatMoreInfo',
          title: 'Member Info',
          openMenu: route.openMenu ,
          closeMenu: route.closeMenu,
          rightText: '',
          leftIcon: <Icon name="ios-arrow-back" size={30} style={[{color:'#4A90E2'},{marginLeft:10}]}/>,
          eventUid: route.eventDataLocation,
          photoURL: this.props.photoURL,
          displayName: this.props.displayName,
          viewType: 'memberHome'

      } );
      } else if (route.rightText === 'Join'){

        this.refs.nav.push({
          name:'JoinEvent',
          title: route.eventObject.event_title,
          eventObject: route.eventObject,
          openMenu: this.openMenu ,
          closeMenu: this.closeMenu,
          rightText: 'Send',
          leftIcon: <Icon name="ios-arrow-back" size={30} style={[{color:'#4A90E2'},{marginLeft:10}]}/>,
          displayName : this.props.displayName,
          userUid : this.props.userUid,
          photoURL: this.props.photoURL,
          sex: this.props.sex,
          eventDataLocation: route.eventDataLocation

      } );

      } else {
        this.refs.nav.push({
          name:'EditNewEvent',
          title: route.eventObject.event_title,
          eventObject: route.eventObject,
          openMenu: this.openMenu ,
          closeMenu: this.closeMenu,
          rightText: 'Update',
          leftText: 'Close',
          eventDataLocation: route.eventDataLocation,
          displayName : this.props.displayName,
          userUid : this.props.userUid

      } );
      }


    } else if (route.name === 'EditNewEvent'){
      this.refs.nav.refs.editEvent.validate();
      // console('Updated');
    } else if (route.name === 'JoinEvent'){
      this.refs.nav.refs.joinEvent.updateEventInfo();
    } else if(route.name === 'Chat'){
      // console("what is route");
      // console(route);
      if (route.viewType === 'ChatHome'){

        this.refs.chatNav.push({
          name: 'ChatMoreInfo',
          title: 'Member Info',
          openMenu: route.openMenu ,
          closeMenu: route.closeMenu,
          rightText: '',
          leftIcon: <Icon name="ios-arrow-back" size={30} style={[{color:'#4A90E2'},{marginLeft:10}]}/>,
          eventUid: route.eventUid,
          photoURL: route.photoURL,
          displayName: route.displayName,
        });

      } else {
        this.refs.nav.push({
          name: 'ChatMoreInfo',
          title: 'Member List',
          openMenu: route.openMenu ,
          closeMenu: route.closeMenu,
          rightText: 'Update',
          leftText: 'Close',
          eventUid: route.eventUid,
          photoURL: route.photoURL,
          displayName: route.displayName,


        })
      }


    }


  }
  onSaveButton = (rightButtonValidated) => {
    if(rightButtonValidated){
      // console('Color save button');
    }
    // this.setState({ rightButtonValidated });

  }

  closeMenu = (route) => {
    // console('close in home');
    if (route.name === 'EventsHome') {
      this.refs.nav.push({name:'AddNewEvent',
                          title: 'Add Event',
                          openMenu: this.openMenu ,
                          closeMenu: this.closeMenu,
                          rightText: 'Save',
                          leftText: 'Cancel',
                          onSaveButton: this.onSaveButton,
                            rightValid: this.state.rightButtonValidated,
                            displayName : this.props.displayName,
                            userUid : this.props.userUid,
                            photoURL: this.props.photoURL,
                            sex: this.props.sex
                        });
    }else if(route.viewType === 'None'){
      this.refs.nav.popToTop();
      this.refs.nav.refs.eventsHome.loadParent();
      this.refs.nav.refs.eventsHome.loadAllNonEvents();
      this.setState({selectedTab:'chats'});

    }else if(!route.name.includes('Chat') || (route.viewType && route.viewType.includes('memberHome'))){
      // console('pop called');

      if(route.name === 'SearchEvent' || route.name === 'AddNewEvent' || route.name === 'ViewEvent'){
        this.refs.nav.refs.eventsHome.loadParent();
        this.refs.nav.refs.eventsHome.loadAllNonEvents();
      }
        this.refs.nav.pop();
    } else {
      if (this.refs.chatNav){
        this.refs.chatNav.pop();
      } else {
        this.refs.nav.pop();
      }

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
                            userUid : this.props.userUid,
                            displayName: this.props.displayName,
                            sex: this.props.sex,
                            photoURL: this.props.photoURL,
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
      return(<Settings displayName={this.props.displayName} photoURL={this.props.photoURL}/>)
    }
    // else if (this.state.selectedTab === 'contacts'){
    //   return(<Contacts/>)
    // }
    else if (this.state.selectedTab === 'chats'){
      // console("chat home screen");
      return(
        <Navigator
              initialRoute = {{ name: 'ChatHome',
                                title: 'Chat List',
                                openMenu: this.openMenu ,
                                closeMenu: this.closeMenu,
                                rightIcon: <FontAwesome name="pencil-square-o" size={30} style={[{color:'#4A90E2'},{marginRight:10}]}/> ,

                            userUid : this.props.userUid,
                            displayName: this.props.displayName,
                            photoURL: this.props.photoURL,
                            chatUid: this.props.chatUid
                      }}
              renderScene = { renderRouterScene  }
              configureScene = {(route, routeStack) => {

              return Navigator.SceneConfigs.FloatFromRight
              }

              }
              navigationBar = {
                 <Navigator.NavigationBar
                    style = { styles.navigationBar }
                    routeMapper = { NavigationBarRouteMapper } />
              }
              ref = "chatNav"
              sceneStyle={{paddingTop: 40}}
           />

      );



      // return(<ChatHome userUid= {this.props.userUid} displayName= {this.props.displayName} photoURL={this.props.photoURL}/>)
    }
  }


  render() {
    const { rightButtonValidated } = this.state.rightButtonValidated;
  // comment out contacts
    // <Icon.TabBarItem
    //     title=""
    //     iconName="ios-people-outline"
    //     selected={this.state.selectedTab === 'contacts'}
    //     onPress={() => {
    //       this.setState({
    //         selectedTab: 'contacts',
    //
    //       });
    //     }}>
    //     {this.renderScreen()}
    // </Icon.TabBarItem>

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
      // console(route);

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
               userUid = {route.userUid}
               displayName = {route.displayName}
               photoURL = {route.photoURL}
               sex = {route.sex}
               ref = 'eventsHome'
            />
         )
      }
      else if(route.name === 'AddNewEvent') {
         return (
            <AddNewEvent
               navigator = {navigator}
               {...route.passProps}
               route={route}
               ref='eventAdd'
               displayName={route.displayName}
               userUid = {route.userUid}
               photoURL = {route.photoURL}
               sex = {route.sex}
            />
         )
      }
      else if(route.name === 'EditNewEvent') {
        // console("gonna edit");
        // console(route.eventDataLocation);
         return (
            <AddNewEvent
               navigator = {navigator}
               {...route.passProps}
               route={route}
               ref='editEvent'
               eventObject={route.eventObject}
               eventDataLocation = {route.eventDataLocation}
               displayName={route.displayName}
               userUid = {route.userUid}
               photoURL = {route.photoURL}
            />
         )
      }

      else if(route.name === 'ViewEvent') {
         return (
            <ViewEvent
               navigator = {navigator}
               {...route.passProps}
               route={route}
               eventObject = {route.eventObject}
               eventDataLocation = {route.eventDataLocation}
               userEventObject = {route.eventUserObject}
               displayName = {route.displayName}
               userUid = {route.userUid}
               photoURL = {route.photoURL}
               ref='eventView'
            />
         )
      }
      else if(route.name === 'JoinEvent'){
        return (
          <JoinEvent
          navigator = {navigator}
          {...route.passProps}
          route={route}
          eventObject = {route.eventObject}
          eventDataLocation = {route.eventDataLocation}
          displayName={route.displayName}
          userUid = {route.userUid}
          sex = {route.sex}
          photoURL = {route.photoURL}
          ref='joinEvent'
           />
        )
      }
      else if (route.name === 'SearchEvent'){
        return (<SearchEvent navigator = {navigator}
          route={route} eventArray = {route.eventArray} />)
      } else if(route.name === 'ChatHome'){
        // console('going to call chat home');
        return(<ChatHome
              navigator = {navigator}
            {...route.passProps}
            route={route}
            userUid= {route.userUid}
            displayName= {route.displayName}
            photoURL={route.photoURL}
            chatUid={route.chatUid}
        />)

      } else if(route.name === 'Chat'){
        return(<Chat navigator={navigator} route={route}
                userUid= {route.userUid}
              displayName= {route.displayName}
              photoURL={route.photoURL}
              eventUid= {route.eventUid}

        />)
      } else if(route.name === 'ChatMoreInfo'){
        return(<ChatMoreInfo navigator={navigator} route={route}
            eventUid = {route.eventUid}
          />)
      } else if(route.name === 'Settings'){
        return(<Settings navigator={navigator} route={route}
        displayName= {route.displayName}
        photoURL = {route.photoURL}
        />)
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
