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
import Icon from '../node_modules/react-native-vector-icons/FontAwesome';
import TimerCountDown from 'react-native-timer-countdown';
import ImageCarousel from './ImageCarousel';

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
      <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'transparent'}}>
        <ScrollView>
          <EAStatusBar
            showIcon={true}
            iconClick={() => this.props.navigation.goBack(null)}
            title={"Lot #" + this.state.car.AuctionInfo.lot}></EAStatusBar>

          <View style={styles.container}>
            <View style={{alignItems: 'center'}}>
              {/* <Image
                source={{uri: this._getImagePreview(this.state.car.Info.image, settings.preview.h, settings.preview.w)}}
                style={styles.image} /> */}

              <ImageCarousel
                images={this.state.car.Info.Images}
                style={styles.image} />

              <Text style={styles.imageCounter}>
                {`Image ${this.state.currentImage} of ${this.state.car.Info.Images.length}`}
              </Text>
            </View>
            <View>
              <Text style={styles.title}>
                {this.state.car.Specifications.Make.en} {this.state.car.Specifications.Model.en}
              </Text>

              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Icon name="gavel" size={20} color='#b5bec7' />

                  <Text style={styles.detailTitle}>Bids</Text>
                  <Text style={styles.detailValue}>{this.state.car.AuctionInfo.bids}</Text>
                </View>

                <View style={{flex: 1.3}}>
                  <Icon name="tachometer" size={20} color='#b5bec7' />

                  <Text style={styles.detailTitle}>Odometer</Text>
                  <Text style={styles.detailValue}>{this.state.car.Specifications.mileage} {this.state.car.Specifications.odometer}</Text>
                </View>

                <View style={{flex: 2.3}}>
                  <Icon name="clock-o" size={20} color='#b5bec7' />

                  <Text style={styles.detailTitle}>Time Remaining</Text>
                  <Text style={[styles.detailValue, {color: '#43d5e4'}]}>
                    <TimerCountDown
                        initialSecondsRemaining={this.state.car.AuctionInfo.endDate * 60}
                        allowFontScaling={true} />
                  </Text>
                  <Text style={{fontSize: 14, color: '#6c6d71', fontWeight: '300'}}>
                    Ends on {this.state.car.AuctionInfo.endDateEn}
                  </Text>
                </View>
              </View>

              <View style={styles.infoWrapper}>
                <View style={{borderBottomWidth: 1, borderBottomColor: '#dadada', paddingTop: 4, paddingBottom: 5}}>
                  <Text style={{color: '#3e3e40', fontSize: 17, fontWeight: 'bold',
                    alignSelf: 'flex-start',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ff1735',
                    marginBottom: -6,
                    paddingBottom: 5}}>{'Overview'.toUpperCase()}</Text>
                </View>

                <Text style={styles.description}>
                  {this.state.car.Info.descriptionEn}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <Image
          source={require('../assets/images/ic_bid.png')}
          style={{height: 80, width: 80, marginBottom: -23, zIndex: 20, alignSelf: 'flex-end', marginRight: 30, backgroundColor: 'transparent'}} />

        <View style={styles.footer}>
          <BidFooter auctionInfo={this.state.car.AuctionInfo} />
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
    flexDirection: 'column',
    paddingStart: 18,
    paddingEnd: 18
  },

  image: {
    height: 180,
    width: 320,
    borderRadius: 3,
    marginTop: -30
  },

  imageCounter: {
    color: '#b6bdc5',
    paddingTop: 8,
    fontSize: 12
  },

  title: {
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    color: '#424244',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingTop: 5,
    paddingBottom: 15,
    flex: 5,
    flexDirection: 'row'
  },

  detailsIcon: {
    height: 15,
    width: 15
  },

  detailTitle: {
    paddingTop: 5,
    color: '#b6bfc6'
  },

  description: {
    color: '#404042',
    lineHeight: 27,
    fontSize: 15,
    marginTop: 4
  },
  footer: {
    backgroundColor: '#2f3448',
    height: 70,
    overflow: 'visible'
  },

  infoWrapper: {
    marginTop: 13
  },

  detailValue: {
    color: '#3c3c3c',
    fontWeight: 'bold',
    flex: 1,
    flexDirection: 'row'
  }
});
