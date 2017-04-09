
import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ListView,
  StyleSheet
} from 'react-native';
import SearchBar from 'react-native-searchbar';
import EventBox from './EventBox'

export default class SearchContainer extends Component {

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(this.props.eventArray)
    };
  }

  render() {
    return (
      <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={(data) => <View>{data}</View>}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF1F3'
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
});
