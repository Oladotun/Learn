import React, {Component} from 'react';
import firebase from "firebase";
import{
  View,
  Text,
  StyleSheet,
  Button,
  TabBarIOS
} from 'react-native';
import Background from './Background';
import EventsHome from './events/EventsHome';
import Settings from './settings/Settings';
import Contacts from './contacts/Contact';
import Chats from './chat/Chats'

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

  renderScreen = () => {
    if (this.state.selectedTab === 'eventHome'){
      return(<EventsHome/>)
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
      // <View style={styles.container}>
      // <Background>
      //   <Text style={styles.welcome}>Home page</Text>
      //   <Button title="Testing"
      //   style={styles.welcome}
      //   onPress={this._getClick}
      //   color="#841584"
      //   />
      // </Background>
      // // </View>

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

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,

  },
});
