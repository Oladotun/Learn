import React, { Component, PropTypes } from 'react';
import { Image, Dimensions,Text,View,TouchableHighlight,StyleSheet,TouchableOpacity} from 'react-native';
import moment from 'moment';
var {height, width} = Dimensions.get('window');

export default class EventBox extends Component {
  // Component prop types
  static propTypes = {


    eventObject:  PropTypes.object.isRequired,
    openMenu: PropTypes.func.isRequired,
    closeMenu: PropTypes.func.isRequired
  }



  visitItem = () =>{
    console.log("Visiting view");
    console.log(this.props);
    this.props.navigator.push({
      name:'ViewEvent',
      title: this.props.eventObject.event_title,
      eventObject:this.props.eventObject,
      openMenu: this.props.openMenu ,
      closeMenu: this.props.closeMenu,
      rightText: 'Edit',
      leftText: 'Back'

  }


  );
  }

  render() {
    const{eventObject} = this.props;
    var date = eventObject['event_time'];
    var imageUrl = eventObject['uploadURL'];
    var name = eventObject['event_title'];
    var formattedDate = moment(new Date(date)).format('DD MMM YYYY');
    return (
      <TouchableOpacity  onPress={() => this.visitItem()}>
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
