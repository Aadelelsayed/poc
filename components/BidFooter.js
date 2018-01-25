import React, { Component, PureComponent } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Switch
} from 'react-native';
import Icon from '../node_modules/react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

export default class BidFooter extends PureComponent {
  constructor(props){
    super(props);
    this.auctionInfo = this.props.auctionInfo;

    this.state = {
      bidAmount: this.auctionInfo.currentPrice + this.auctionInfo.minIncrement
    }

  }

  _adjustPrice(dir){
    this.setState({
      bidAmount: dir == 1 ? (this.state.bidAmount + this.auctionInfo.minIncrement) : (this.state.bidAmount - this.auctionInfo.minIncrement)
    }, () => {

    })
  }

  componentWillReceiveProps(newProps){
    console.log(newProps);
  }

  render(){
    return(
      <View style={styles.mainContainer}>
        <View style={[styles.container, {flex: 1}]}>
          <View style={[styles.priceContainer, { flex: 2.5 }]}>
            <Text style={{color: '#979db3', fontSize: 15}}>
              Current Price
            </Text>

            <View style={{flexDirection: 'row'}}>
                <Text
                  style={styles.price}>
                  {this.auctionInfo.currentPrice.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace(/\.00$/,'')}
                </Text>
                <Text style={styles.currency}>
                  {this.auctionInfo.currencyEn}
                </Text>
            </View>
          </View>

          <View style={{flex: 3.1}}>

            <Text style={styles.footerTitle}>
              Min. Increment:

              <Text style={{color: '#f0eeef', fontWeight: 'bold', paddingLeft: 1}}>
                {this.auctionInfo.minIncrement} {this.auctionInfo.currencyEn}
              </Text>
            </Text>

            <Text>

            </Text>


          </View>
        </View>

        <View style={{backgroundColor: '#424a64', flex: 3.5, paddingTop: 10, paddingRight: 20, paddingLeft: 20}}>
          <Text style={{color: '#42d6e6', textAlign: 'center', fontSize: 15}}>
            My Bidding Limit: 2,179,300 AED
          </Text>

          <Text style={{color: '#99a1b9', marginTop: 10, fontSize: 14, lineHeight: 23}}>
            I agree to the Terms and Conditions & i have inspected the vehicle.
          </Text>

          <View style={{flexDirection: 'row', height: 60}}>
            <View style={{flex: 2, borderColor: '#626a83', borderWidth: 1,
              borderRadius: 35, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
              <TouchableOpacity

                onPress={() => this._adjustPrice(0)}
                style={{
                  flex: 1.1,
                  alignItems: 'center'
                }}>
                <Icon name="remove"
                  size={25}
                  color="#626a83" />
              </TouchableOpacity>

              <Text style={{flex: 2, textAlign: 'center', fontWeight: 'bold', color: '#ffffff', fontSize: 17}}>
                {this.state.bidAmount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace(/\.00$/,'')}
              </Text>

              <TouchableOpacity
                onPress={() => this._adjustPrice(1)}
                style={{
                  flex: 1.1,
                  alignItems: 'center'
                }}>
                <Icon name="add"
                  size={25}
                  color="#626a83" />
              </TouchableOpacity>
            </View>

            <View style={{flex: 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Switch
                   />

                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18, paddingRight: 3}}>AUTO BID</Text>

                <Icon name="info"
                  size={20}
                  color="#ff4644" />
            </View>
          </View>

          <View style={{height: 60, marginTop: 15}}>
            <LinearGradient
              colors={gradient.colors}
              start={gradient.position.start}
              end={gradient.position.end}
              locations={gradient.locations}
              style={[styles.statusBarBg, {borderRadius: 35, paddingTop: 13, paddingBottom: 13, alignItems: 'center', justifyContent: 'center'}]}>

              <TouchableOpacity style={{flexDirection: 'row'}}>
                <Icon name="check"
                  color="#ffffff"
                  size={25} />

                <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', paddingLeft:4}}>BID NOW</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column'
  },

  container: {
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    paddingTop: 10,
    flexDirection: 'row',
    flex: 1,
    overflow: 'hidden'
  },

  priceContainer: {
    flex: 1,
    alignContent: 'center'
  },

  price: {
    color: '#fdfffa',
    fontSize: 20,
    lineHeight: 30,
    fontWeight: 'bold'
  },

  currency: {
    color: '#fdfffa',
    fontSize: 14,
    lineHeight:18,
    padding: 5
  },

  bidIcon: {
    height: 80,
    width: 80,
    marginTop: -20,
    zIndex: 10,
    position: 'absolute'
  },

  footerTitle: {
    color: '#9aa0b8',
    marginTop: 23
  }
})

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

