import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';

export default class BidFooter extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <View style={styles.container}>
        <View style={styles.priceContainer}>
          <Text style={{color: '#979db3', fontSize: 11}}>
            Current Price
          </Text>

          <Text style={styles.price}>
            {this.auctionInfo.startPrice || this.auctionInfo.currentPrice}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {

  }
})
