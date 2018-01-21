import React,
  { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight
} from 'react-native';
import Icon from '../node_modules/react-native-vector-icons/MaterialIcons';

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

          { this.props.showIcon ?
            <TouchableHighlight onPress={this.props.iconClick}  style={{flex: 1, display: 'flex'}} underlayColor="transparent"  >
              <View>
                <Icon name="keyboard-backspace" size={27} color ="#FFF" />
              </View>
            </TouchableHighlight>
            : <View style={{flex: 1}}></View>
          }


          <View style={{flex: 2}}>
					  <Text style={styles.title}>{this.props.title}</Text>
          </View>
				</LinearGradient>
		)
	}
}

const styles = StyleSheet.create({
	statusBarBg: {
		height: 65,
		alignItems: 'center',
		justifyContent: 'center',
    marginTop: -4,
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20
	},

	title: {
		color: '#FFF',
		fontSize: 15,
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
		justifyContent: 'center',
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
