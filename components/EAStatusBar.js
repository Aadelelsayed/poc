import React,
  { Component } from 'react';
import {
  View,
  StyleSheet,
  Text
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

export default class EAStatusBar extends Component {
	constructor(props){
		super(props);
	}
	render() {
		return(
				<LinearGradient
					colors={gradient.colors}
					start={gradient.position.start}
					end={gradient.position.end}
					locations={gradient.locations}
					style={styles.statusBarBg}>

					<Text style={styles.title}>Cars & Machinery</Text>
				</LinearGradient>
		)
	}
}

const styles = StyleSheet.create({
	statusBarBg: {
		height: 65,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: -4
	},

	title: {
		color: '#FFF',
		fontSize: 15,
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold'
	}
});

const gradient = {
	colors: [
		'#ff2d4a',
		'#ff623f'
	],

	position: {
		start: { x: 0.0, y: 0.25},
		end: { x: 0.8, y: 1.0 }
	},

	locations: [
		0.2, 0.8
	]
};
