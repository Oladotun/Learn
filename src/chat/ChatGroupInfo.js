import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';

import {groupsStyles,height,width} from '../styles'


export default class ChatGroupInfo extends Component {
  constructor(props) {
    super(props);



  }

  enterChatRoom = () => {
    var self = this;
    console.log(this.props);

      self.props.navigator.push({
                            name: 'Chat',
                            title: self.props.channel.event_title,
                            openMenu: self.props.route.openMenu ,
                            closeMenu: self.props.route.closeMenu,
                            rightText: "More Info" ,
                            leftText: "Back",
                            displayName: self.props.displayName,
                            userUid: self.props.userUid,
                            photoURL: self.props.photoURL,
                            eventUid: this.props.eventUid


        });

  }
  render() {
    var channel = this.props.channel;
      return (
        <View style={styles.container}>
        <TouchableOpacity onPress = { () =>

            this.enterChatRoom()

        }>
        <Image
          source={{ uri:channel.uploadURL}}
          style={ styles.image }>

        </Image>
        <Text style={groupsStyles.h2}>{channel.event_title}</Text>
        </TouchableOpacity>
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
  },
  image: {
    height: width/3,
    width: width/3,

  },
});
