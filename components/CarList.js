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
      refreshing: false,
      totalItems: 0
    }
	}

	componentDidMount() {
    // this.setState({
    //   isLoading: true,
    //   isLoadMore: false
    // })
    // getCars()
    //   .then((res) => {
    //     ticks = res.Ticks;

    //     this.setState({
    //       isLoading: false,
    //       dataSouce: ds.cloneWithRows(cars),
    //       totalItems: res.count,
    //       isLoadMore: false,
    //       data: res.Cars
    //     }, function(){

    //     });
    //   });
      this._onFetch();

      this.interval = setInterval(this.onTick.bind(this), refreshInterval);
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  onTick(){
    if(this.state.refreshing) return;

    getUpdatedCars()
      .then((res) => {

        if(res.Cars.length > 0){
          let cars = this.state.data;

          // cars = cars.concat(res.Cars);
          // let newCars = res.Cars.splice(cars.length, res.Cars.length - cars.length);

          // res.Cars.forEach((car, index) => {
            // cars = cars.concat(res.Cars);
            // let carIndex = cars.findIndex((elm) => {
            //   return elm.carID == car.carID;
            // });

            // if(carIndex !== -1){
            //   if(carIndex != index){
            //     cars.splice(carIndex, 1);
            //     cars[index] = car;
            //   }

            //   let foundCar = cars[carIndex];

            //   if(foundCar.AuctionInfo.bids < car.AuctionInfo.bids){
            //     cars[carIndex] = car;
            //     cars[carIndex].shouldFlash = true;
            //   }
            // } else {
            //   cars[index] = car;
            // }
          // });
          console.log(res.Cars);
          if(res.Cars.length > cars){
            cars = res.Cars.slice(0, cars.length);
          } else {
            cars = res.Cars;
          }

          this.setState({
            data: cars
          }, () => {
            // console.log(this.state.data);
          });
        }
      });
  }

  _onPress = (carId) => {
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

  _renderFooter = () => {
    return(
      <View style={{flex: 1, alignContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 20}}>
        <ActivityIndicator />
      </View>
    )
  }

  _onFetch = () => {
    if(this.state.isLoadMore) return;

    this.setState({
      isLoadMore: true
    });

    let totalCount = itemsPerPage * page;
    let totalItems = parseInt(this.state.totalItems);

    let itemsToFetch = itemsPerPage;

    console.log(totalCount, totalCount, totalItems);

    if((totalItems - totalCount) > totalItems - itemsPerPage){
      itemsPerPage = totalItems - totalCount;
    }

    getCars()
      .then((res) => {
        // cars = cars.map((x) => {
        //   let currentIndex = cars.findIndex(y => y.carID == x.carID);

        //   return currentIndex === -1;
        // });
        let cars = this.state.data;

        if(this.state.data && this.state.data.length > 0){
          cars = cars.concat(res.Cars);
        } else {
          cars = res.Cars
        }

        ticks = res.Ticks;

        this.setState({
          isLoadMore: false,
          data: cars,
          totalItems: res.count,
          isLoading: false
        }, function(){

        });

        page++;
      });
  }

  _onRefresh() {
    this.setState({
      refreshing: true
    });

    page = 1;
    itemsPerPage = 10;


    getCars()
      .then((res) => {
        ticks = res.Ticks;

        console.log(res.Cars.length)


        this.setState({
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
          ListFooterComponent={this._renderFooter}
          onEndReached={this._onFetch}
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)} />

			</View>
		)
	}
}

const getCars = () => {
  let endPoint = `${api.host}&page=${page}&itemperpage=${itemsPerPage}`;

  console.log(`Fetching, ${endPoint}`)

  return fetch(endPoint)
			.then((res) => res.json());
}

const getUpdatedCars = () => {
  let endPoint = `${api.host}&ticks=${ticks}`;

  console.log(endPoint);

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
