import React, {
  PureComponent
} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions
} from 'react-native';

import Carousel, { ParallaxImage } from 'react-native-snap-carousel';

const height = 250,
      width = 600;

export default class ImageCarousel extends PureComponent {
  constructor(props){
    super(props);

    this.state = {

    }

    const { activeSlide } = this.state;
    // console.log(props.images);
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
          style={{height: height, width: width, borderRadius: 4}}
          containerStyle={{height: 200, width: 320}}
          parallaxFactor={0}
          showSpinner={true}
          spinnerColor={'rgba(255,255,255,0.4)'}
          {...parallaxProps} />
      </View>
    )
  }

  render(){
    return(
      <Carousel
        data={this.props.images}
        inactiveSlideScale={0.70}
        inactiveSlideOpacity={0.8}
        snapToAlignment={'center'}
        enableMomentum={false}
        removeClippedSubviews={false}
        activeSlideOffset={0}
        renderItem={this._renderItem}
        hasParallaxImages={true}
        itemWidth={320}
        containerCustomStyle={{ marginTop: -10}}
        activeSlideAlignment={'center'}
        sliderWidth={width}
        onSnapToItem={(index) => {
          this.setState({ activeSlide: index })

          if(this.props.onSwipe) {
            this.props.onSwipe(index);
          }
        }}
        itemHeight={height} />
    )
  }
}

const styles = StyleSheet.create({

});
