import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
  Animated
} from 'react-native';
import Fade from './Fade';
import { NavigationActions } from 'react-navigation';
import TimerCountdown from 'react-native-timer-countdown';
import * as Animatable from 'react-native-animatable';

const settings = {
  preview: {
    h: 105,
    w: 210
  },

  container: {
    marginLeft: 15,
    marginRight: 15
  }
}

let cIndex = 0;
const colors = ['#37d1dd', '#43ddb9', '#4edc8a', '#57dd62'];

const threshold = 60 * 5;

export default class Car extends PureComponent {
  constructor(props){
    super(props);

    this.state = {
      counterStyle: styles.counter,
      isPending: false
    }

    if(!this.props.data.AuctionInfo){
      console.log(this.props);
    }
  }

  componentDidMount() {
    if(this.props.data.AuctionInfo.isMoified){
      this.setState({
        isModified: true,
        color: styles.title.color
      });

      this.animateTitle();
    }
  }

  animateTitle = () => {
    console.log(colors.length, cIndex, colors[cIndex]);
    if(cIndex != (colors.length - 1) && colors[cIndex] !== 'undefined'){

      this.setState({
        color: colors[cIndex],
        isModified: true
      });

      cIndex++;

      setTimeout(() => {
        this.animateTitle();
      }, 1000)
    } else {
      cIndex = 0;

      this.setState({
        isModified: true,
        color: '#3f3f3f'
      });
    }
  }

  _onTimeTick = () => {
    // if(threshold > (this.props.data.AuctionInfo.endDate * 60)){

    // }
  }

  _getTitle = () => {
    // let title = "";

    // if(this.props.data.makeEn){
    //   title = this.props.data.makeEn.length > 80 ?
    //     this.props.data.makeEn.substring(0, 80) : this.props.data.makeEn;
    // } else if(this.props.data.modelEn){
    //   title = this.props.data.modelEn.length > 80 ?
    //     this.props.data.modelEn.substring(0, 80) : this.props.data.modelEn;
    // }

    return `${this.props.data.makeEn} ${this.props.data.modelEn} ${this.props.data.year != 0 ? this.props.data.year : ''}`;
  }
	render() {
		return(
      <TouchableHighlight
        underlayColor="transparent"
        // onPress={this.props.onPress}>
        onPress={() => {
          this.animateTitle();
        }}>

        <View style={styles.container}>
          <Image
            source={{uri: getPreview(this.props.data.image, settings.preview.h, settings.preview.w)}}
            style={styles.preview} />

          <View style={styles.details}>
            <Animatable.Text
              transition="color"
              duration={1500}
              style={[styles.title, this.state.isModified && { color: this.state.color }]}>
                {this._getTitle()}
            </Animatable.Text>
            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <Text
                  style={styles.price}>
                  {this.props.data.AuctionInfo.currentPrice.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace(/\.00$/,'')}
                </Text>
                <Text style={styles.currency}>
                  {this.props.data.AuctionInfo.currencyEn}
                </Text>
            </View>
            <View style={styles.info}>
              <View style={styles.infoItem}>
                <Text style={styles.infoItemTitle}>
                  Lot #
                </Text>
                <Text style={styles.infoItemValue}>
                  {this.props.data.AuctionInfo.lot}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoItemTitle}>
                  Bids
                </Text>
                <Text style={styles.infoItemValue}>
                  {this.props.data.AuctionInfo.bids}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoItemTitle}>
                  Time Left
                </Text>
                <Text style={[this.state.counterStyle, (this.props.data.AuctionInfo.endDate * 1000) < (60 * 60 * 24 * 5) && styles.almostFinished]}>
                  <TimerCountdown
                    initialSecondsRemaining={this.props.data.AuctionInfo.endDate * 1000}
                    allowFontScaling={true}
                    onTick={this._onTimeTick} />
                </Text>

              </View>
            </View>

            {/* <Fade style={styles.newBid}></Fade> */}
          </View>
        </View>
      </TouchableHighlight>
		)
	}
}

const getPreview = (uri, h, w) => {
  if(!uri) return "";

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
    marginTop: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    padding: 2,
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
    flex: 1.3,
    flexDirection: 'row'
  },

  details: {
      flex: 1.4,
      padding: 10
  },

  title: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#3f3f3f'
  },

  price: {
    color: '#fc1935',
    fontSize: 14,
    lineHeight: 30,
    fontFamily: 'Roboto-Medium'
  },

  currency: {
    color: '#fc1935',
    fontFamily: 'Roboto',
    fontSize: 9,
    lineHeight:18,
    padding: 5
  },

  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent:'center',
    height: 25
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
  },

  infoItem: {
    flex: 1,
    alignItems: 'flex-start'
  },

  infoItemTitle: {
    color: '#c4cccf',
    fontSize: 11,
    fontFamily: 'Roboto-Regular'
  },

  infoItemValue: {
    color: '#404040',
    fontFamily: 'Roboto-Medium',
    fontSize: 12
  },

  counter: {
    color: '#44d5e6',
    fontSize: 12
  },

  almostFinished: {
    color: '#ff2d4a',
    fontWeight: 'bold'
  },

  newBid: {
    height: 2,
    marginTop: 4
  }
})
