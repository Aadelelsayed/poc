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

import { ThemeProvider, Button } from 'react-native-material-ui';
import CarList from './components/CarList';
import EAStatusBar from './components/EAStatusBar';

class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
				<EAStatusBar style={{flex: 1, flexDirection: 'row'}}></EAStatusBar>
				<CarList style={{flex: 2}}></CarList>
			</View>
    );
  }
}

export default class Main extends React.Component {
	render() {
		return (
			<ThemeProvider>
				<App />
			</ThemeProvider>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f7fa'
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
