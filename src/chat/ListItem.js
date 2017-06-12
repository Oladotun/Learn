
import React, {Component} from 'react';
import ReactNative from 'react-native';
// const styles = require('../styles.js')
const { View, TouchableHighlight, Text, Image,StyleSheet } = ReactNative;
import {groupsStyles,height,width} from '../styles'

export default class ListItem extends Component {

  render() {
    var lastMessageInfo = '';
    var type = '';
    if (this.props.item.lastMessage){
      lastMessageInfo = this.props.item.lastMessage.length < 25? this.props.item.lastMessage : this.props.item.lastMessage.substring(0,25) + "...";
    }





    console.log(this.props.item);


    return (

      <TouchableHighlight onPress={this.props.onPress}>
        <View style={styles.li}>

        <Image
          source={{ uri:this.props.item.photoURL}}
          style={ styles.image }>

        </Image>
          <View style={{flexDirection:'column'}}>
          <Text style={styles.liText}>{this.props.item.title.length < 25?  this.props.item.title : this.props.item.title.substring(0,25)}</Text>
          <Text style={styles.liText}>{lastMessageInfo }</Text>
          </View>
          <View style={{ flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
      }}>
          {
            (() => {
              return(this.props.item.newMessage? <View style={styles.liImage}></View> : <View><Text>{''}</Text></View>)
            }) ()


          }
          </View>
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
  liImage: {
    color: '#333',
    height: 10,
    width: 10,
    borderRadius: 5,
    marginLeft: 20,
    marginTop: 10,
    marginRight: 10,
    borderWidth: 1,
    backgroundColor: '#0000ff',

  },
  image: {

    height: 50,
    width: 50,
    borderRadius: 25,


  }
});
