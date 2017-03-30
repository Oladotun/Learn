import React, { Component, PropTypes } from 'react';
import { NavigatorIOS,Image, Text,View,TouchableHighlight,StyleSheet,Button,Navigator ,TouchableOpacity} from 'react-native';
import AddNewEvent from './AddNewEvent'
import Icon from 'react-native-vector-icons/Ionicons'
import { globals,styles } from '../styles';

// import {database} from '../ProfileSetup'



// export const EventBoxes = ({ groups, visitEvent, visitCreateGroup }) => {
//   console.log('GROUPS', groups);
//   if (! groups.length ) { return <EmptyGroupBoxes handlePress={visitCreateGroup}/> }
//   return (
//     <View style={styles.boxContainer}>
//       {groups.map((event, idx) => {
//         if (!group) { return <EmptyGroupBox key={idx}/>}
//
//       })}
//     </View>
//   );
// }

export default class EventsHome extends Component {

    constructor(props){
      super(props);
      this.state = {
        screen:''
      }
    }
    visitEvent = (event) => {
      console.log('my event pressed');
    }
    render() {

      return (
        <View style={myStyles.wrapper}>
          <Text style={myStyles.welcome}>Hello, Chat App!</Text>

              <Image source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}} style={{width: 50, height: 50}}>

              </Image>
        </View>
      );
  }
}
var myStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: 80
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
