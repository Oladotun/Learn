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
    // console(this.props);

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
                            eventUid: this.props.eventUid,
                            viewType: self.props.callingFrom


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
        <Text style={{fontSize:10}}>{channel.event_title}</Text>
        <Text style={{fontSize:10}}>{channel.version}</Text>
        </TouchableOpacity>
        </View>

      );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',

  },
  image: {

    height: width/4,
    width: width/4,
    borderRadius: width/6,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center'

  },
  groupContainer: {
    height: width/4,
    width: width/2,
    alignItems: 'center'

  }
});
