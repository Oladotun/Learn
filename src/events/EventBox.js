import React, { Component, PropTypes } from 'react';
import { Image, Dimensions,Text,View,TouchableHighlight,StyleSheet,TouchableOpacity} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import {database} from '../ProfileSetup';
var {height, width} = Dimensions.get('window');

export default class EventBox extends Component {
  // Component prop types
  static propTypes = {
    eventObject: PropTypes.object.isRequired,
    openMenu: PropTypes.func.isRequired,
    closeMenu: PropTypes.func.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      currentEvent: null
    }

  }


  loadValues =() =>{
    var self = this;
    let eventObjectRef =  database.ref('events').child(this.props.dataLocation);
        eventObjectRef.once('value', function(snapshot) {
          self.setState({currentEvent:snapshot.val()});
          self.visitItem()

        });

  }



  visitItem = () =>{
    if(this.state.currentEvent){
      this.props.navigator.push({
        name:'ViewEvent',
        title: 'Event Info',
        eventObject:this.state.currentEvent,
        openMenu: this.props.openMenu ,
        closeMenu: this.props.closeMenu,
        eventDataLocation: this.props.dataLocation,
        rightText: 'Edit',
        leftIcon: <Icon name="ios-arrow-back" size={30} style={[{color:'#4A90E2'},{marginLeft:10}]}/>

    });

    }

  }

  render() {
    const{eventObject} = this.props;
    var date = eventObject['event_time'];
    var imageUrl = eventObject['uploadURL'];
    var name = eventObject['event_title'];
    var formattedDate = moment(new Date(date)).format('DD MMM YYYY');
    return (
      <TouchableOpacity  onPress={() => this.loadValues()}>
        <View style={styles.touchContainer}>
            <Image source={{uri:imageUrl}} style={styles.imageContainer}/>
              <Text style = {styles.message}>{name}</Text>
              <Text style={styles.dateMessage}>{formattedDate} </Text>
        </View>
        </TouchableOpacity>



    );
}
}

const styles = StyleSheet.create({
  imageContainer: {
    width: width/2,
    height: height/5,
    backgroundColor: '#f0f8ff',


  },

  message: {
    fontSize: 20

  },
  dateMessage: {
    fontSize: 10

  },
  touchContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginRight: 10,
    marginLeft: 10
  }

});
