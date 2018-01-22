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
  AsyncStorage
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import {
  RecyclerListView,
  LayoutProvider,
  DataProvider
} from 'recyclerlistview';

import Car from './Car';
import Filters from './Filters';
import EAStatusBar from './EAStatusBar';

const api = require('../config/api.json');
const allCars = [];

let page = 1,
    itemsPerPage = 10,
    cars = [],
    ticks = 0;

const ROW_HEIGHT = 109;

const refreshInterval = 50000,
      ViewTypes = {
        HEADER: 0,
        ROW: 1
      };

export default class CarList extends PureComponent {
	constructor(props){
    super(props);

    let { width } = Dimensions.get("window");

    let dataProvider = new DataProvider((r1, r2) => {
      return r1 != r2;
    });

    this._layoutProvider = new LayoutProvider(
      index => {
        console.log(index);

        if(index == 0){
          return ViewTypes.HEADER;
        } else {
          return ViewTypes.ROW;
        }
      },
      (type, dim) => {
          switch(type){
            case ViewTypes.HEADER: {
              dim.height = 130;
              dim.width = width;

              break;
            }

            case ViewTypes.ROW:
            default: {
              dim.height = ROW_HEIGHT;
              dim.width = width;

              break;
            }
          }
       }
    );

    this._renderItem = this._renderItem.bind(this);

		this.state = {
      isLoading: true,
      refreshing: false,
      totalItems: 0,
      dataProvider: dataProvider.cloneWithRows([])
    }
	}

	componentDidMount() {
      this._onFetch();

      getAllCars()
        .then((res) => {
          allCars = res.Cars;
        });

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

  _renderItem(type, item) {
    console.log("render item", type);
    switch(type){
      case ViewTypes.HEADER:
        return this._renderHeader();

      case ViewTypes.ROW:
        return this._renderRow(item);
      default:
        return null;
    }

  }

  _renderRow(item) {
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
          onSort={(sortKey, sortDir) => {
            if(this.state.dataProvider && this.state.dataProvider.getAllData().length > 0){
              let cars = this.state.dataProvider.getAllData();

              if(allCars && allCars.length > 0){
                cars = allCars;
              }

              cars = cars.sort((a, b) => {
                if(sortDir == 1){
                  return a["AuctionInfo"][sortKey] < b["AuctionInfo"][sortKey]
                }

                return a["AuctionInfo"][sortKey] > b["AuctionInfo"][sortKey]
              });

              this.setState({
                dataProvider: this.state.dataProvider.cloneWithRows(cars)
              })
            }
          }} />

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

    if(allCars){
      console.log(allCars);
    }

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
        let cars = this.state.dataProvider.getAllData();

        console.log(cars);

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
          isLoading: false,
          dataProvider: this.state.dataProvider.cloneWithRows(cars)
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

      {/* <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this._onRefresh.bind(this)}>
      </RefreshControl> */}

        <RecyclerListView
          layoutProvider={this._layoutProvider}
          dataProvider={this.state.dataProvider}
          rowRenderer={this._renderItem}
          renderFooter={this._renderFooter}
          onEndReached={this._onFetch}
          refreshControl={
            this._renderRefreshView()}
          />

      {/* <FlatList
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          ListHeaderComponent={this._renderHeader}
          ListFooterComponent={this._renderFooter}
          onEndReached={this._onFetch}
          onEndReachedThreshold={0.1}
          initialNumToRender={5}
          getItemLayout={(data, index) => (
            {length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index}
          )}
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)} /> */}
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
