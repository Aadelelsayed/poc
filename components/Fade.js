import React, { PureComponent } from 'react';
import {
  View, Animated
} from 'react-native';

export default class Fade extends PureComponent {
  componentDidMount(){
    this._shown = new Animated.Value(0);
  }

  render(){
    return(
      <View style={
        {
          backgroundColor: '#00ff54',
          height: 2,
          marginTop: 4
          }}>

      </View>
    )
  }
}
