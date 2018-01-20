import React, {
  Component
} from 'react';

import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  Text,
  ScrollView
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import EAStatusBar from './EAStatusBar';
import BidFooter from './BidFooter';

const api = require('../config/api.json');

const settings = {
  preview: {
    h: 600,
    w: 600
  },

  container: {
    marginLeft: 15,
    marginRight: 15
  }
}

export default class CarDetail extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      car: null,
      isLoading: true,
      currentImage: 1
    };
  }

  componentDidMount(){
    console.log(this.props);

    //fetch the car
    fetchCar(this.props.navigation.state.params.carId)
      .then((res) => {
        console.log(res);
        this.setState({
          car: res,
          isLoading: false
        });
      })
  }

  componentWillMount() {

  }

  _getImagePreview = (uri, w, h) => {
    uri = uri.replace("[h]", h)
    uri = uri.replace("[w]", w);

    console.log(uri);

    return uri;
  }

  render(){
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, alignContent: 'center', alignItems: 'center', flexDirection: 'column', justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      )
    }

    return(
      <View style={{flex: 1, flexDirection: 'column'}}>
        <ScrollView style={styles.container}>
          <View style={styles.container}>
            <EAStatusBar
              title={"Lot #" + this.state.car.AuctionInfo.lot}></EAStatusBar>

            <View style={{alignItems: 'center'}}>
              <Image
                source={{uri: this._getImagePreview(this.state.car.Info.image, settings.preview.h, settings.preview.w)}}
                style={styles.image} />

              <Text style={styles.imageCounter}>
                {`Image ${this.state.currentImage} of ${this.state.car.Info.Images.length}`}
              </Text>

              <Text style={styles.title}>
                {this.state.car.Specifications.Make.en} {this.state.car.Specifications.Model.en}
              </Text>

              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Image
                    source={require('../assets/images/ic_filter.png')}
                    style={styles.detailsIcon} />
                  <Text style={styles.detailTitle}>Bids</Text>
                  <Text style={styles.detailValue}>{this.state.car.AuctionInfo.bids}</Text>
                </View>

                <View style={{flex: 1}}>
                  <Image
                    source={require('../assets/images/ic_filter.png')}
                    style={styles.detailsIcon} />
                  <Text style={styles.detailTitle}>Odometer</Text>
                  <Text style={styles.detailValue}>{this.state.car.Specifications.odometer}</Text>
                  <Text style={styles.detailValue}>{this.state.car.Specifications.mileage}</Text>
                </View>

                <View style={{flex: 1}}>
                  <Image
                    source={require('../assets/images/ic_filter.png')}
                    style={styles.detailsIcon} />
                  <Text style={styles.detailTitle}>Time Remaining</Text>
                  <Text style={styles.detailValue}>{this.state.car.AuctionInfo.endDate}</Text>
                  <Text style={styles.detailValue}>
                    Ends on {this.state.car.AuctionInfo.endDateEn}
                  </Text>
                </View>
              </View>

              <View style={styles.infoWrapper}>
                <Text>Overview</Text>

                <Text style={styles.description}>
                  {this.state.car.Info.descriptionEn}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {/* <BidFooter auctionInfo={this.state.car.AuctionInfo} /> */}
        </View>
      </View>
    )
  }
}

const fetchCar = (carId) => {
  const endPoint = `https://api.emiratesauction.com/v2/carsonline/${carId}`;

  return fetch(endPoint)
    .then((res) => res.json());
}

const styles = StyleSheet.create({
  scroller: {
    flex: 1
  },

  container: {
    flex: 1,
    flexDirection: 'column'
  },

  image: {
    height: 160,
    width: 300,
    borderRadius: 3,
    marginTop: -10
  },

  imageCounter: {
    color: '#b6bdc5',
    paddingTop: 8,
    fontSize: 11
  },

  title: {
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    color: '#424244',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left'
  },

  detailsIcon: {
    height: 15,
    width: 15
  },

  description: {
    color: '#454648'
  },
  footer: {
    backgroundColor: '#2f3448',
    height: 55
  }
});
