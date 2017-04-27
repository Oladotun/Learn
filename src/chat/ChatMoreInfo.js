import React, {Component} from 'react';
import ReactNative from 'react-native';

// const ListItem = require('./ListItem');
import ListItem from './ListItem';

const {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
} = ReactNative;

import {database,user} from '../Config'

// Initialize Firebase

export default class ChatMoreInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };

    this.chatRef = database.ref('chatMembers/').child(this.props.eventUid);
    this.chatRefData = this.chatRef.orderByChild('displayName')

  }



  listenForItems(itemsRef) {
    console.log("going to listen for items");
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        console.log("getting child");
        console.log(child.val());
        console.log(child.key);
        items.push({
          title: child.val().displayName,
          photoURL: child.val().photoURL,
          _key: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

  componentDidMount() {
    this.listenForItems(this.chatRef);
  }

  render() {
    return (
      <View style={styles.container}>


        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>

      </View>
    )
  }



  _renderItem(item) {

    const onPress = () => {
      console.log("nothing");
    };

    return (
      <ListItem item={item} onPress={onPress} />
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
  },
  liContainer: {
    flex: 2,
  },
  liText: {
    color: '#333',
    fontSize: 16,
  }
});
