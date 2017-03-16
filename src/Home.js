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
import EventsHome from './EventsHome';
import Settings from './Settings';

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
    } else {
      return(<Settings/>)
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


      <FontAwesome.TabBarItem
          title=""
          iconName="cog"


          selected={this.state.selectedTab === 'redTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'redTab',

            });
          }}>
          {this.renderScreen()}
        </FontAwesome.TabBarItem>

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
