
import React, {Component} from 'react';
import ReactNative from 'react-native';
// const styles = require('../styles.js')
const { View, TouchableHighlight, Text, Image,StyleSheet } = ReactNative;
import {groupsStyles,height,width} from '../styles'

export default class ListItem extends Component {
  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={styles.li}>
        <Image
          source={{ uri:this.props.item.photoURL}}
          style={ styles.image }>

        </Image>
          <Text style={styles.liText}>{this.props.item.title}</Text>
          <Text style={styles.liText}>{this.props.item.lastMessage}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  listview: {
    flex: 1,
  },

  li: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
    flexDirection: 'row'
  },
  liContainer: {
    flex: 2,
  },
  liText: {
    color: '#333',
    fontSize: 16,
    marginLeft: 20,
    marginTop: 10
  },
  image: {

    height: 50,
    width: 50,
    borderRadius: 25,


  }
});
