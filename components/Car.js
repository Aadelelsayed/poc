import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform
} from 'react-native';

const settings = {
  preview: {
    h: 100,
    w: 160
  },

  container: {
    marginLeft: 15,
    marginRight: 15
  }
}

export default class Car extends Component {
  constructor(props){
    super(props);
  }

	render() {
		return(
			<View style={styles.container}>
        <Image
          source={{uri: getPreview(this.props.data.image, settings.preview.h, settings.preview.w)}}
          style={styles.preview} />

        <View style={styles.details}>
          <Text
            style={styles.title}>
              {this.props.data.makeEn || this.props.data.modelEn}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
              <Text
                style={styles.price}>
                {this.props.data.AuctionInfo.currentPrice}
              </Text>
              <Text style={styles.currency}>
                {this.props.data.AuctionInfo.currencyEn}
              </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.lot}>
              Lot #
              {this.props.data.AuctionInfo.lot}
            </Text>
            <Text style={styles.bids}>
              Bids
              {this.props.data.AuctionInfo.bids}
            </Text>
            <Text style={styles.time}>
              Time Remaining
              {this.props.data.AuctionInfo.endDate}
            </Text>
          </View>
        </View>
			</View>
		)
	}
}

const getPreview = (uri, h, w) => {
  uri = uri.replace("[h]", h)
  uri = uri.replace("[w]", w);

  return uri;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 2,
    marginLeft: settings.container.marginLeft,
    marginRight: settings.container.marginRight,
    marginTop: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.75,
        shadowRadius: 5,
        shadowColor: 'red',
        shadowOffset: { height: 0, width: 0 }
      },
      android: {
        elevation: 2
      }
    })
  },

  preview: {
    height: settings.preview.h,
    width: settings.preview.w,
    flex: 1,
    flexDirection: 'row'
  },

  details: {
      flex: 1.4,
      padding: 15
  },

  title: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#3f3f3f'
  },

  price: {
    color: '#fc1935',
    fontSize: 16,
    lineHeight: 30,
    fontFamily: 'Roboto-Medium'
  },

  currency: {
    color: '#fc1935',
    fontFamily: 'Roboto-Light',
    fontSize: 11,
    lineHeight:18,
    padding: 5
  },

  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent:'center'
  },

  lot: {
    flex: 1,
    borderRightWidth: 1
  },

  bids: {
    flex: 1,
    borderRightWidth: 1
  },

  time: {
    flex: 1
  }
})
