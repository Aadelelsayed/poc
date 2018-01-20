import React from 'react';
import {
  View,
  ActivityIndicator,
  ListView,
  Text,
  StyleSheet,
  TouchableHighlight,
  RefreshControl,
  FlatList
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import Car from './Car';
import Filters from './Filters';
import EAStatusBar from './EAStatusBar';

const api = require('../config/api.json');

let page = 1,
    itemsPerPage = 10,
    cars = [],
    ticks = 0;

const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1.carID != row2.carID })
const refreshInterval = 5000;

export default class CarList extends React.Component {
	constructor(props){
		super(props);

		this.state = {
      isLoading: true,
      refreshing: false
    }
	}

	componentDidMount() {
    getCars()
      .then((res) => {
        cars = res.Cars;
        ticks = res.Ticks;

        this.setState({
          isLoading: false,
          dataSouce: ds.cloneWithRows(cars),
          totalItems: res.count,
          isLoadMore: false,
          data: cars
        }, function(){

        });
      });

      this.interval = setInterval(this.onTick.bind(this), refreshInterval);
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  onTick(){
    console.log("This is on tick");

    getUpdatedCars()
      .then((res) => {
        let cars = this.state.data;

        if(res.Cars.length > 0){
          res.Cars.forEach((car) => {
            // let foundCar = cars.find((elm) => {
            //   return elm.carID == car.carID;
            // });

            let carIndex = cars.findIndex((elm) => {
              return elm.carID == car.carID;
            });


            if(carIndex !== -1){
              let foundCar = cars[carIndex];

              if(foundCar.AuctionInfo.bids < car.AuctionInfo.bids){
                cars[carIndex] = car;
                cars[carIndex].shouldFlash = true;
              }

              console.log(carIndex, foundCar.AuctionInfo.bids);
            }
          });

          this.setState({
            data: cars
          }, () => {
            console.log(this.state.data);
          });
        }
      });
  }

  _onPress = (carId) => {
    console.log("i am clicked");
    const nav = NavigationActions.navigate({
      routeName: 'Detail',
      params: {
        carId: carId
      }
    });

    this.props.navigation.dispatch(nav);
  }

  _renderItem = ({item}) => {
    return(
      <Car
        data={item}
        onPress={() => this._onPress(item.carID)}
        style={[{backgroundColor: '#FFFFFF'}, item.shouldFlash && styles.flashing]} />
    )
  }

  _renderHeader = () => {
    return (
      <View style={{zIndex: 1}}>
        <EAStatusBar
          style={{flex: 1, flexDirection: 'row', zIndex: 1}}
          title="Cars & Machinery"></EAStatusBar>
        <Filters></Filters>

        <Text
          style={styles.counter}>
          <Text style={{fontWeight: 'bold'}}>
            {this.state.totalItems}
          </Text> Items Available
        </Text>
      </View>
    )
  }

  _onFetch = () => {
    console.log("should load more");
    if(this.state.isLoadMore) return;

    page++;

    let totalCount = itemsPerPage * page;
    let totalItems = this.state.totalItems;
    let itemsToFetch = itemsPerPage;

    if(((totalItems * page) - totalCount) < totalItems){
      itemsPerPage = totalItems - totalCount;
    }

    getCars()
      .then((res) => {
        cars = cars.concat(res.Cars);
        ticks = res.Ticks;

        this.setState({
          isLoadMore: false,
          dataSouce: this.state.dataSouce.cloneWithRows(cars),
          data: cars
        }, function(){

        });
      });
  }

  _onRefresh() {
    this.setState({
      refreshing: true
    });

    page = 1;
    itemsPerPage = 25;

    getCars()
      .then((res) => {
        ticks = res.Ticks;

        this.setState({
          dataSouce: ds.cloneWithRows(res.Cars),
          refreshing: false,
          data: res.Cars
        })
      })
      .catch((error) => {
        console.log("Error: " + error);
      })
  }

  _renderRefreshView(){
    return(
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this._onRefresh.bind(this)} />
    )
  }

  _onChangeVisibleRows(visibleRows, changedRows) {
    console.log("rows changed", visibleRows, changedRows);
  }

  _keyExtractor = (item, index) => item.carID;

	render() {
		if(this.state.isLoading){
			return(
				<View style={styles.container}>
					<ActivityIndicator />
				</View>
			)
		}

		return(
      <View
        style={styles.container}>

      <FlatList
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          ListHeaderComponent={this._renderHeader}
          onEndReached={this._onFetch}
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)} />

			</View>
		)
	}
}

const getCars = () => {
  let endPoint = `${api.host}&page=${page}&itemperpage=${itemsPerPage}`;

  // console.log(`Fetching, ${endPoint}`)

  return fetch(endPoint)
			.then((res) => res.json());
}

const getUpdatedCars = () => {
  let endPoint = `${api.host}&ticks=${ticks}`;

  return fetch(endPoint)
			.then((res) => res.json());
}

const styles = StyleSheet.create({
	container: {
    flex: 1,
    zIndex: 2
    // backgroundColor: '#f8f9fd'
  },

  counter: {
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 0,
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: '#b6bfc6'
  },

  flashing: {
    backgroundColor: '#9b9b9b'
  }
});
