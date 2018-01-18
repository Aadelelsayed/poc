import React,
  { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Image,
  Text
} from 'react-native';

export default class Filters extends Component {
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

        <View style={styles.filter}>
          <Image
            source={require('../assets/images/ic_sort.png')}
            style={styles.action} />
          <Text style={styles.actionTitle}>
            Sort
          </Text>
        </View>

        <View style={[styles.filter, { borderLeftWidth: 1, borderLeftColor: '#dbdfe2'}]}>
          <Image
            source={require('../assets/images/ic_grid.png')}
            style={styles.action} />
          <Text style={styles.actionTitle}>
            Grid View
          </Text>
        </View>
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
        elevation: 1
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
    height: 17,
    width: 17
  },

  actionTitle: {
    color: '#3e3e3e',
    fontSize: 12,
    marginLeft: 15
  }
});
