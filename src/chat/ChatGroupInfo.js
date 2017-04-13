import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';
import {styles} from '../styles';

export default class ChatGroupInfo extends Component {


  render() {
    var channel = this.props.channel;
      return (
        <View style={otherStyles.container}>
        <Image
          source={{ uri:channel.coverUrl}}
          style={ styles.image }>

        </Image>
        </View>

      );
  }
}

const otherStyles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'stretch',
      marginRight: 10,
      marginLeft: 10,
      marginBottom: 50
  }
});
