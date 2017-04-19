import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {database,user} from '../Config'



export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };

        this.chatRef = database.ref('chat/').child(this.props.eventUid);
        this.chatRefData = this.chatRef.orderByChild('order')
        this.onSend = this.onSend.bind(this);

    }



    listenForItems(chatRef) {
        chatRef.on('value', (snap) => {
            // get children as an array
            var items = [];
            snap.forEach((child) => {
                items.push({
                    _id: child.val().createdAt,
                    text: child.val().text,
                    createdAt: new Date(child.val().createdAt),
                    user: {
                        _id: child.val().uid,
                        avatar: child.val().avatar,
                        name: child.val().name
                    }
                });
            });

            this.setState({
                loading: false,
                messages: items
            })


        });
    }

    componentDidMount() {
        this.listenForItems(this.chatRefData);
    }

    componentWillUnmount() {
        this.chatRefData.off()
    }

    onSend(messages = []) {

        // this.setState({
        //     messages: GiftedChat.append(this.state.messages, messages),
        // });
        messages.forEach(message => {
            var now = new Date().getTime()
            this.chatRef.push({
                _id: now,
                text: message.text,
                createdAt: now,
                uid: this.props.userUid,
                avatar: this.props.photoURL,
                name: this.props.displayName,
                order: -1 * now
            })
        })

    }
    render() {
        return (
          <View style={styles.container}>
          <GiftedChat
              messages={this.state.messages}
              onSend={this.onSend.bind(this)}
              user={{
                  _id: this.props.userUid,
              }}
              />
          </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 50
    }
})
