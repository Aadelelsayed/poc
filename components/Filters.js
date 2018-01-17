import React,
  { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform
} from 'react-native';

export default class Filters extends Component {
  render() {
    return(
      <View style={styles.container}>
        <View style={styles.filter}>

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginLeft: 25,
    marginRight: 25,
    marginTop: -10,
    height: 60,
    ...Platform.select({
      ios: {

      },
      android: {
        elevation: 1
      }
    })
  }
});
