import React,
  { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Image,
  Text,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';

import SortModal from './modals/Sort';
import FilterModal from './modals/Filter';



export default class Filters extends PureComponent {
  constructor(props){
    super(props);
  }

  _onFilterPress = () => {
    // console.log("filter press");
  }

  _toggleSort = () => {
    // console.log("toggle sort");

    this.refs.sortModal._open();
  }

  _onSort = (sortKey, sortDir) => {
    this.props.onSort(sortKey, sortDir);
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={[styles.filter, { borderRightWidth: 1, borderRightColor: '#dbdfe2' }]}>
          <Image
            source={require('../assets/images/ic_filter.png')}
            style={styles.action} />
          <Text style={styles.actionTitle}>
            Filter
          </Text>
        </View>

        <TouchableOpacity
          style={styles.filter}
          onPress={() => this._toggleSort()}>
          <View style={styles.filter}>
            <Image
              source={require('../assets/images/ic_sort.png')}
              style={styles.action} />
            <Text style={styles.actionTitle}>
              Sort
            </Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.filter, { borderLeftWidth: 1, borderLeftColor: '#dbdfe2'}]}>
          <Image
            source={require('../assets/images/ic_grid.png')}
            style={styles.action} />
          <Text style={styles.actionTitle}>
            Grid View
          </Text>
        </View>

        <SortModal
          onPress={this._onSort}
          ref="sortModal" />

        <FilterModal
          carTypes={this.props.carTypes}
          onPress={this._onFilter}
          ref="filterModal" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginLeft: 20,
    marginRight: 20,
    marginTop: -10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    height: 50,
    ...Platform.select({
      ios: {

      },
      android: {
        elevation: 5
      }
    }),
    borderRadius: 4
  },

  filter: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },

  action: {
    height: 15,
    width: 15
  },

  actionTitle: {
    color: '#3e3e3e',
    fontSize: 12,
    marginLeft: 15
  }
});
