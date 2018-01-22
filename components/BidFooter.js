import React, { Component, PureComponent } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform
} from 'react-native';

export default class BidFooter extends PureComponent {
  constructor(props){
    super(props);

    this.auctionInfo = this.props.auctionInfo;

    console.log("This is the footer", this.auctionInfo);
  }

  render(){
    return(
      <View style={styles.container}>
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

        <View style={{flex: 2}}>

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
    )
  }
}

const styles = StyleSheet.create({
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
