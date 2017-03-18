import React, { Component, PropTypes } from 'react';
import { NavigatorIOS, Text,View,TouchableHighlight,StyleSheet } from 'react-native';
import Settings from '../settings/Settings'

export default class EventsHome extends Component {

  render() {
    return (
      <NavigatorIOS
        ref = "nav"
        initialRoute={{
          component: MyScene,
          title: 'My Initial Scene',
          rightButtonTitle: 'Right',
          leftButtonTitle: 'Left',
          onLeftButtonPress: () => {
            this.refs.nav.navigator.push({
              title: 'settings',
               component: Settings
            });
          }

                }}
        style={styles.container}
      />
    );
  }
}

class MyScene extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    navigator: PropTypes.object.isRequired,
  }

  _onForward = () => {
    this.props.navigator.push({
      title: 'settings',
       component: Settings
    });
  }

  render() {
    return (
      <View style={styles.wrapper} >
        <Text >Current Scene: { this.props.title }</Text>
        <TouchableHighlight onPress={this._onForward}>
          <Text>Tap me to load the next scene</Text>
        </TouchableHighlight>
      </View>
    )
  }
}


// import React, {Component} from 'react';
// import{
//   Text,
//   StyleSheet,
//   View
// } from 'react-native';
// import NavigationBar from 'react-native-navbar';
//
//
// export default class EventsHome extends Component {
//
//   render(){
//     return (
//     <View style={styles.container}>
//       <NavigationBar
//         title={titleConfig}
//         rightButton={rightButtonConfig}
//       />
//     </View>
//   );
//   }
// }

// const styles = StyleSheet.create({
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//
//   },
// });

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: 80
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

const rightButtonConfig = {
  title: 'Next',
  handler: () => alert('hello!'),
};

const titleConfig = {
  title: 'Hello, world',
};
