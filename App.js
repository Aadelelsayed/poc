/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
	View
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import CarList from './components/CarList';
import CarDetail from './components/CarDetail';

const MainApp = StackNavigator(
  {
    Home: { screen: CarList },
    Detail: { screen: CarDetail }
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
  });

class App extends Component<{}> {
  render() {
    return (
      <MainApp ref={nav => { this.navigator = nav; }} />
    );
  }
}

export default class Main extends React.Component {
	render() {
		return (
      <App />
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fd'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
