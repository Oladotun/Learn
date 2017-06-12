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
var PushNotification = require('react-native-push-notification');

export default class ChatHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      channel: null,
      userRef: null,
      allEvents: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      totalItemsInList: 0,
      loaded: false,
      allItems: []
    }


  }

  componentDidMount(){
    this.loadUserChatInfo();
  }

  setDataSource = (item_sync, item_async) =>{
    var loadedItemsLength = 0;
    if (item_sync){
      loadedItemsLength = loadedItemsLength + item_sync.length;
    }
    if (item_async){
      loadedItemsLength = loadedItemsLength + item_async.length;
    }
    var allItems = [];
    if(this.state.totalItemsInList === loadedItemsLength){
       for (item in item_sync){
         allItems.push(item_sync[item]);
       }

       for (async_item in item_async){
         allItems.push(item_async[async_item]);
       }
       allItems.sort(function(a,b){
         var c = new Date(a.createdAt);
          var d = new Date(b.createdAt);
          return d - c;
       });
       this.setState({
         allItems: allItems,
         dataSource: this.state.dataSource.cloneWithRows(allItems),
         loaded: true
       });


    }
  }
  updateDataSource = (newItem) => {
    var allItemSlice = this.state.allItems.slice();
    // allItemSlice[newItem._key] = newItem;
    for (item in allItemSlice){
      if (allItemSlice[item]._key === newItem._key){
        allItemSlice[item] = newItem;
      }
    }
    // console.log(allItemSlice);
    allItemSlice.sort(function(a,b){
      var c = new Date(a.createdAt);
       var d = new Date(b.createdAt);
       return d - c;
    });
    this.sendPushNotification(newItem);
    this.setState({
      allItems: allItemSlice,
      dataSource: this.state.dataSource.cloneWithRows(allItemSlice),
      loaded: true
    });

  }
  sendPushNotification = (data) => {
    if (this.props.userUid !== data.uid){
      // console.log(data);
      if (this.state.loaded){
        PushNotification.localNotification({
          message: data.sender +":" + data.lastMessage, // (required)
          userInfo: {chatUid: data.uid},
          date: new Date(Date.now()) // in 60 secs
        });
      } else {
        PushNotification.localNotification({
          message: data.name+" : "+ data.text, // (required)
          userInfo: {chatUid: data.uid},
          date: new Date(Date.now()) // in 60 secs
        });

      }

    }

  }

  loadUserChatInfo = () => {

    var self = this;
    var userRef = database.ref('users').child(this.props.userUid)
    var chatGroupRef = database.ref('chat');
    var attendingEventsRef = userRef.child('attendingEvents');



    userRef.on('value', function(snapshot){
      // console("In value snapshot");
      if (snapshot.val()){
        var attendingEvents = snapshot.val().attendingEvents;
        var createdEvents = snapshot.val().createdEvents;
        var listLength = 0;

        if (attendingEvents){
          listLength = listLength + Object.keys(attendingEvents).length;
        }
        if (createdEvents){
          listLength = listLength + Object.keys(createdEvents).length;

        }

        self.setState({totalItemsInList: listLength});

        // Continue from here
        var allEvents = [];
        var items = [];
        var items_async = [];
        var items_sync = [];

       if (attendingEvents){
         Object.keys(attendingEvents).forEach(function(events) {

             var chatRef = chatGroupRef.child(events);
             var newArray;
             chatRef.orderByChild("order").limitToFirst(1).on("value",function(snapshot){
                 var data = snapshot.val();
                 attendingEventsRef.child(events).once("value", function(attendSnapshot){
                  var opened = attendSnapshot.val().lastOpened;
                  var delivered = attendSnapshot.val().lastDelivered;
                  var newMessage = false;
                  if(opened && delivered){
                    if(delivered > opened){
                       newMessage = true;
                    }
                  }

                  if(delivered){
                    if(!opened){
                      newMessage = true;
                    }

                  }


                  if(!self.state.loaded){
                    if (data) {
                      var count = 0;

                      var info = Object.keys(data)[0];
                      var value = data[info];


                      items_async.push({
                        title: attendingEvents[events].event_title,
                        photoURL: attendingEvents[events].uploadURL,
                        _key: events,
                        lastMessage: value.text,
                        createdAt: value.createdAt,
                        sender: value.name,
                        urlSender: value.avatar,
                        userEventRef: attendingEventsRef.child(events),
                        lastDelivered: attendingEventsRef.child(events).update({'lastDelivered': value.createdAt}),
                        newMessage : newMessage,
                        notifCount: self.props.notifCount

                      });
                      self.sendPushNotification(value);


                    } else {
                      console.log("no message");
                      items_sync.push({
                        title: attendingEvents[events].event_title,
                        photoURL: attendingEvents[events].uploadURL,
                        _key: events,
                        userEventRef: attendingEventsRef.child(events),
                        newMessage: newMessage,
                        notifCount: self.props.notifCount
                      });
                    }
                    self.setDataSource(items_sync, items_async);

                  } else {
                    if(data){
                      var info = Object.keys(data)[0];
                      var value = data[info];
                      self.updateDataSource({title: attendingEvents[events].event_title,
                      photoURL: attendingEvents[events].uploadURL,
                      _key: events,
                      lastMessage: value.text,
                      createdAt: value.createdAt,
                      sender: value.name,
                      urlSender: value.avatar,
                      userEventRef: attendingEventsRef.child(events),
                      lastDelivered: attendingEventsRef.child(events).update({'lastDelivered': value.createdAt}),
                      newMessage: newMessage,
                      notifCount: self.props.notifCount
                    });

                    }
                  }


                });


             });
         });
       }

       if(createdEvents){

         Object.keys(createdEvents).forEach(function(events) {

             var chatRef = chatGroupRef.child(events);
             chatRef.orderByChild("order").limitToFirst(1).on("value",function(snapshot){
                 var data = snapshot.val();
                 var createdRef = userRef.child('createdEvents');
                 createdRef.child(events).once("value", function(createdSnapshot){

                   var opened = createdSnapshot.val().lastOpened;
                   var delivered = createdSnapshot.val().lastDelivered;
                   var newMessage = false;
                   if(opened && delivered){
                     if(delivered > opened){
                        newMessage = true;
                     }
                   }

                   if(delivered){
                     if(!opened){
                       newMessage = true;
                     }

                   }


                   if(!self.state.loaded){
                    if (data) {
                      var count = 0;

                      var info = Object.keys(data)[0];
                      var value = data[info];

                      items_async.push({
                        title: createdEvents[events].event_title,
                        photoURL: createdEvents[events].uploadURL,
                        _key: events,
                        lastMessage: value.text,
                        createdAt: value.createdAt,
                        sender: value.name,
                        urlSender: value.avatar,
                        userEventRef: userRef.child('createdEvents').child(events),
                        lastDelivered: userRef.child('createdEvents').child(events).update({'lastDelivered': value.createdAt}),
                        newMessage: newMessage,
                        notifCount: self.props.notifCount

                      });
                      self.sendPushNotification(value);

                    } else {
                      items_sync.push({
                        title: createdEvents[events].event_title,
                        photoURL: createdEvents[events].uploadURL,
                        _key: events,
                        userEventRef: userRef.child('createdEvents').child(events),
                        newMessage: newMessage,
                        notifCount: self.props.notifCount
                      });
                    }
                    self.setDataSource(items_sync, items_async);

                  } else {
                    if(data){
                      var info = Object.keys(data)[0];
                      var value = data[info];
                      self.updateDataSource({title: createdEvents[events].event_title,
                      photoURL: createdEvents[events].uploadURL,
                      _key: events,
                      lastMessage: value.text,
                      createdAt: value.createdAt,
                      sender: value.name,
                      urlSender: value.avatar,
                      userEventRef: userRef.child('createdEvents').child(events),
                      lastDelivered: userRef.child('createdEvents').child(events).update({'lastDelivered': value.createdAt}),
                      newMessage: newMessage,
                      notifCount: self.props.notifCount
                    });

                    }
                  }

                 });


             });


         });

       }

      }
    });


  }


  render() {
    return (
      <View style={styles.listcontainer}>


        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>

      </View>
    )
  }

  _openFromNotification = (chatUid) =>{

    this.props.navigator.push({
                          name: 'Chat',
                          title: "TestChat",
                          openMenu: this.props.route.openMenu ,
                          closeMenu: this.props.route.closeMenu,
                          rightText: "More Info" ,
                          leftText: "Back",
                          displayName: this.props.displayName,
                          userUid: this.props.userUid,
                          photoURL: this.props.photoURL,
                          eventUid: chatUid,
                          viewType: "ChatHome"


      });

  }


  _renderItem(item) {

    const onPress = () => {
      // console("nothing");
      if(item.newMessage){
        item.notifCount(-1);
      }


      this.props.navigator.push({
                            name: 'Chat',
                            title: item.title,
                            openMenu: this.props.route.openMenu ,
                            closeMenu: this.props.route.closeMenu,
                            rightText: "More Info" ,
                            leftText: "Back",
                            displayName: this.props.displayName,
                            userUid: this.props.userUid,
                            photoURL: this.props.photoURL,
                            eventUid: item._key,
                            viewType: "ChatHome",
                            userEventRef: item.userEventRef,
                            lastOpened: item.userEventRef.update({'lastOpened': new Date().getTime()})


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
