import React, {
  PureComponent
} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text
} from 'react-native';

import Carousel, { ParallaxImage } from 'react-native-snap-carousel';

const height = 250,
      width = 600;

export default class ImageCarousel extends PureComponent {
  constructor(props){
    super(props);

    console.log(props.images);
  }

  componentDidMount(){
    this.setState({
      images: this.props.images
    })
  }

  _renderItem({item, index}, parallaxProps) {
    return (
      <View style={styles.slide}>
        <ParallaxImage
          source={{uri: item.replace("[h]", height).replace("[w]", width) }}
          style={{height: height, width: width}}
          containerStyle={{height: height, width: width}}
          parallaxFactor={1}
          {...parallaxProps} />
      </View>
    )
  }

  render(){
    return(
      <Carousel
        data={this.props.images}
        renderItem={this._renderItem}
        hasParallaxImages={true}
        itemWidth={300}
        sliderWidth={300}
        itemHeight={500} />
    )
  }
}

const styles = StyleSheet.create({

});
