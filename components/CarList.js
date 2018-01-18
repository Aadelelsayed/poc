import React from 'react';
import {
  View,
  ActivityIndicator,
  ListView,
  Text,
  StyleSheet } from 'react-native';

import Car from './Car';
import Filters from './Filters';
import EAStatusBar from './EAStatusBar';

let page = 1,
    itemsPerPage = 10,
    cars = [];

export default class CarList extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			isLoading: true
		}
	}

	componentDidMount() {
    let ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1.carID != row2.carID })

    getCars()
      .then((res) => {
        cars = res.Cars;

        this.setState({
          isLoading: false,
          dataSouce: ds.cloneWithRows(cars),
          totalItems: res.count,
          isLoadMore: false
        }, function(){

        });
      });
  }

  _renderRowView(rowData, sectionID, rowID, highlightRow) {
    return(
      <Car data={rowData} />
    )
  }

  _renderHeader = () => {
    return (
      <View style={{zIndex: 1}}>
        <EAStatusBar style={{flex: 1, flexDirection: 'row', zIndex: 1}}></EAStatusBar>
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
    if(this.state.isLoadMore) return;

    page++;

    let totalCount = itemsPerPage * page;
    let totalItems = this.state.totalItems;
    let itemsToFetch = itemsPerPage;

    if(((totalItems * page) - totalCount) < totalItems){
      itemsPerPage = totalItems - totalCount;
    }

    console.log(`Page: ${page}, itemsPerPage: ${itemsPerPage}, total: ${this.state.totalItems}`);

    getCars()
      .then((res) => {
        cars = cars.concat(res.Cars);

        this.setState({
          isLoadMore: false,
          dataSouce: this.state.dataSouce.cloneWithRows(cars)
        }, function(){

        });
      });
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

        <ListView
          dataSource={this.state.dataSouce}
          renderRow={this._renderRowView}
          onEndReached={this._onFetch}
          renderHeader={this._renderHeader}
        />

			</View>
		)
	}
}

const getCars = () => {
  let endPoint = `https://api.emiratesauction.com/v2/carsonline?source=mweb&page=${page}&itemperpage=${itemsPerPage}`;

  console.log(`Fetching, ${endPoint}`)

  return fetch(endPoint)
			.then((res) => res.json());
}

const styles = StyleSheet.create({
	container: {
    flex: 1,
    zIndex: 2
  },

  counter: {
    textAlign: 'center',
    paddingTop: 13,
    paddingBottom: 2,
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: '#b6bfc6'
  }
});
