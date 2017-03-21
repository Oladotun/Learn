import React, {Component} from 'react';
import firebase from "firebase";
import{
  View,
  Text,
  StyleSheet,
  Button,
  TabBarIOS,
  Navigator,
  TouchableOpacity
} from 'react-native';
import Background from './Background';
import EventsHome from './events/EventsHome';

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
      selectedTab:'eventHome'
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
    if (route.name === 'EventsHome') {
      this.refs.nav.push({name:'AddNewEvent',
                          title: 'Add New',
                          openMenu: this.openMenu ,
                          closeMenu: this.closeMenu,
                          rightText: 'Save',
                          leftText: 'Close'
                        });
    }

  }

  closeMenu = (route) => {
    console.log('close in home');
    if (route.name === 'AddNewEvent') {
        this.refs.nav.pop();
    }
    if (route.name === 'EventsHome') {
      this.refs.nav.push({name:'AddNewEvent',
                          title: 'Add Event',
                          openMenu: this.openMenu ,
                          closeMenu: this.closeMenu,
                          rightText: 'Save',
                          leftText: 'Close'
                        });
    }

  }



  renderScreen = () => {
    if (this.state.selectedTab === 'eventHome'){
      return(
        <Navigator
              initialRoute = {{ name: 'EventsHome',
                                title: 'EventsHome',
                                openMenu: this.openMenu ,
                                closeMenu: this.closeMenu,
                                rightText: 'Search',
                                leftText: 'Add'}}
              renderScene = { renderRouterScene  }
              navigationBar = {
                 <Navigator.NavigationBar
                    style = { styles.navigationBar }
                    routeMapper = { NavigationBarRouteMapper } />
              }
              ref = "nav"
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


  render() {

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
         return (

            <TouchableOpacity
               onPress = {() => route.closeMenu(route) }>
               <Text style={ styles.leftButton }>
                  { route.leftText || 'Add' }
               </Text>
            </TouchableOpacity>
         )
      // }
      // else { return null }
   },
   RightButton(route, navigator, index, navState) {
       return (
         <TouchableOpacity
            onPress = { () => route.openMenu(route) }>
            <Text style = { styles.rightButton }>
               { route.rightText || 'Menu' }
            </Text>
         </TouchableOpacity>
      )
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
            />
         )
      }
      if(route.name === 'AddNewEvent') {
         return (
            <AddNewEvent
               navigator = {navigator}
               {...route.passProps}
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
