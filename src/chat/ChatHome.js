import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import {sendBird} from '../Config';
import ChatGroupInfo from './ChatGroupInfo';

export default class ChatHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      channel: null
    }


  }

  componentDidMount(){
    this.connectSendBird();
  }

  connectSendBird = () => {

    var self = this;

    sendBird.connect(this.props.userUid,function(user, error) {
      if(!error){
        sendBird.OpenChannel.getChannel('oremi_main', function(channel, error) {
        if(error) {
            console.error(error);
            return;
        }
          console.log(channel);
          self.setState({channel:channel});
        });

      }

    });
  }

  componentWillMount() {

  }
  render() {
      return (
        <View style={styles.container}>
        {
          (() => {
            if (this.state.channel) {
              console.log('going to group chat');
              console.log(this.props);

              return (<ChatGroupInfo channel = {this.state.channel} route={this.props.route} userUid = {this.props.userUid}
              displayName= {this.props.displayName}
              photoURL={this.props.photoURL} navigator={this.props.navigator}/>)
            } else {
              return (<Text style={{fontSize:20}}> I am home </Text>);
            }
          }
          )()

        }

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
  }
  })
