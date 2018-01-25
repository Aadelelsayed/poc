import React, { PureComponent } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableHighlight,
  RefreshControl,
  ScrollView,
  Dimensions,
  AsyncStorage,
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

const ROW_HEIGHT = 109,
      refreshInterval = 5000;

export default class CarList extends PureComponent {
	constructor(props){
    super(props);

    this.allCars = [];
    this.options = {};

		this.state = {
      isLoading: true,
      refreshing: false,
      totalItems: 0,
      carTypes: []
    }
	}

	componentDidMount() {
      this._onFetch();
      this._getAllCars();

      this.interval = setInterval(this.onTick.bind(this), refreshInterval);
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  _getAllCars() {
    getAllCars()
        .then((res) => {
          this.allCars = res.Cars;
          this.options.sort = {
            option: res.sortOption,
            direction: res.sortDirection.toLowerCase() == "desc" ? 1 : 1
          }

          //extract filters
          // this.allCars.map((car) => {
          //   if(car.makeEn && car.makeEn != "" && carTypes.indexOf(car.makeEn) == -1){
          //     carTypes.push(car.makeEn);
          //   }
          // });
        });
  }

  onTick(){
    if(this.state.refreshing) return;

    getUpdatedCars()
      .then((res) => {

        if(res.Cars.length > 0){
          let cars = this.state.data;

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

  _onSort(sortKey, sortDir){
    if(this.state.data && this.state.data.length > 0){
      if(sortKey == null){
        let cars = this.state.data;

        cars.sort((a, b) => {
          if(this.options.sort.direction == 1){
            return a[this.options.sort.option.toLowerCase()] < b[this.options.sort.option.toLowerCase()];
          }

          return a[this.options.sort.option.toLowerCase()] > b[this.options.sort.option.toLowerCase()];
        });

        this.setState({
          data: cars.slice(0, this.state.data.length)
        });

        return;
      }

      let cars = this.state.data;

      if(this.allCars && this.allCars.length > 0){
        cars = this.allCars;
      }

      cars = cars.sort((a, b) => {
        if(sortDir == 1){
          return a["AuctionInfo"][sortKey] < b["AuctionInfo"][sortKey];
        }

        return a["AuctionInfo"][sortKey] > b["AuctionInfo"][sortKey];
      });

      this.allCars = cars;

      this.setState({
        data: cars.slice(0, this.state.data.length)
      })
    }
  }

  _renderRow = ({item}) => {
    return(
      <Car
        data={item}
        onPress={() => this._onPress(item.carID)}
        style={[{backgroundColor: '#FFFFFF', height: ROW_HEIGHT}, item.shouldFlash && styles.flashing]} />
    )
  }

  _renderHeader() {
    return (
      <View style={{zIndex: 1}}>
        <EAStatusBar
          style={{flex: 1, flexDirection: 'row', zIndex: 1}}
          title="Cars & Machinery"></EAStatusBar>
        <Filters
          ref={(Filters) => this.filters = Filters }
          carTypes={[]}
          onSort={this._onSort.bind(this)} />

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

    if(this.allCars){
      //TODO
    }

    this.setState({
      isLoadMore: true
    });

    let totalCount = itemsPerPage * page;
    let totalItems = parseInt(this.state.totalItems);

    let itemsToFetch = itemsPerPage;

    // console.log(totalCount, totalCount, totalItems);

    if((totalItems - totalCount) > totalItems - itemsPerPage){
      itemsPerPage = totalItems - totalCount;
    }

    if(this.allCars && this.allCars.length > 0){
      let cars = this.allCars;
      cars.splice(0, totalCount);
      cars = cars.slice(0, itemsPerPage);
      cars = this.state.data.concat(cars);

      this.setState({
        data: cars,
        totalItems: this.allCars.length,
        isLoadMore: false,
        isLoading: false
      }, function(){

      });


      page++;
    } else {
      getCars()
        .then((res) => {
          // cars = cars.map((x) => {
          //   let currentIndex = cars.findIndex(y => y.carID == x.carID);

          //   return currentIndex === -1;
          // });
          let cars = this.state.data;
          // console.log(cars);

          if(cars && cars.length > 0){
            cars = cars.concat(res.Cars);
          } else {
            cars = res.Cars
          }

          ticks = res.Ticks;

          this.setState({
            data: cars,
            totalItems: res.count,
            isLoadMore: false,
            isLoading: false
          }, function(){

          });

          page++;

        });
    }


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

        this.setState({
          refreshing: false,
          data: res.Cars
        });

        this._getAllCars();
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

  _getItemLayout(data, index){
    return {};
  }

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
          renderItem={this._renderRow}
          keyExtractor={this._keyExtractor}
          ListHeaderComponent={this._renderHeader.bind(this)}
          ListFooterComponent={this._renderFooter}
          onEndReached={this._onFetch}
          onEndReachedThreshold={0.1}
          removeClippedSubviews={false}
          getItemLayout={(data, index) => (
            {length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index}
          )}
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

const getAllCars = () => {
  let endPoint = `${api.host}`;

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
