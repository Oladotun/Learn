import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ListView
} from 'react-native';

import ChatGroupInfo from './ChatGroupInfo';
import firebase from 'firebase';
import {database} from '../Config';
import ListItem from './ListItem';

export default class ChatHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      channel: null,
      userRef: null,
      allEvents: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }


  }

  componentDidMount(){
    this.loadUserChatInfo();
  }

  loadUserChatInfo = () => {

    var self = this;
    var userRef = database.ref('users').child(this.props.userUid);

    userRef.once('value', function(snapshot){
      console.log("In value snapshot");
      var attendingEvents = snapshot.val().attendingEvents;
      var createdEvents = snapshot.val().createdEvents;

      var subgroupInfo = snapshot.val().subgroupInfo;

      console.log(attendingEvents);
      console.log(createdEvents);
      var allEvents = [];
      var items = [];
     if (attendingEvents){
       Object.keys(attendingEvents).forEach(function(events) {
         var obj = {};
         obj[events] = attendingEvents[events];
           allEvents.push(obj);
           items.push({
             title: attendingEvents[events].event_title,
             photoURL: attendingEvents[events].uploadURL,
             _key: events
           });
       });
     }

     if(createdEvents){
       Object.keys(createdEvents).forEach(function(events) {
         var obj = {};
         obj[events] = createdEvents[events];
           allEvents.push(obj);
           items.push({
             title: createdEvents[events].event_title,
             photoURL: createdEvents[events].uploadURL,
             _key: events
           });
       });

     }

     if(subgroupInfo){
       Object.keys(subgroupInfo).forEach(function(events){

         var obj = {};
         obj[events] = subgroupInfo[events];
         allEvents.push(obj);
         items.push({
           title: subgroupInfo[events].event_title,
           photoURL: subgroupInfo[events].uploadURL,
           _key: events
         });

       });
     }


      self.setState({allEvents: allEvents});

      self.setState({
        dataSource: self.state.dataSource.cloneWithRows(items)
      });

      // for (events in attendingEvents){
      //   allEvents.push({events: attendingEvents[events]});
      // }
      //
      // for (created in createdEvents){
      //   allEvents.push({created: createdEvents[created]});
      // }
      console.log(items);
      // console.log(allEvents);
    });


  }

  componentWillMount() {

  }
  componentWillUnmount(){

  }

  render() {
    return (
      <View style={styles.listcontainer}>


        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={false}
          style={styles.listview}/>

      </View>
    )
  }
  // render() {
  //     return (
  //       <View style={styles.container}>
  //       <ScrollView
  //
  //       >
  //
  //       {
  //
  //         (() => {
  //           var chatInfos = []
  //           if (this.state.allEvents.length > 0) {
  //             console.log('going to group chat');
  //             console.log(this.props);
  //
  //             var itemChat = [];
  //             for (items in this.state.allEvents) {
  //               var eachEvent = this.state.allEvents[items];
  //               var userKey = null;
  //               var value = null;
  //               Object.keys(eachEvent).forEach(function(key) {
  //                 userKey = key;
  //                 value = eachEvent[key];
  //               });
  //               chatInfos.push(<ChatGroupInfo key = {userKey} channel = {value} route={this.props.route} userUid = {this.props.userUid}
  //               displayName= {this.props.displayName}
  //               eventUid = {userKey}
  //               callingFrom = {'ChatHome'}
  //               photoURL={this.props.photoURL} navigator={this.props.navigator}/>)
  //
  //             }
  //             return chatInfos;
  //
  //           } else {
  //             return (<Text style={{fontSize:20}}> I am home </Text>);
  //           }
  //         }
  //         )()
  //
  //       }
  //
  //       </ScrollView>
  //
  //       </View>
  //
  //     );
  // }


  _renderItem(item) {

    const onPress = () => {
      console.log("nothing");

      this.props.navigator.push({
                            name: 'Chat',
                            title: item.title,
                            openMenu: this.props.route.openMenu ,
                            closeMenu: this.props.route.closeMenu,
                            rightText: "More Info" ,
                            leftText: "Back",
                            displayName: this.props.displayName,
                            userUid: this.props.userUid,
                            photoURL: item.photoURL,
                            eventUid: item._key,
                            viewType: "ChatHome"


        });
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }
  }

  const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexDirection: 'row'
  },
  listcontainer: {
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
