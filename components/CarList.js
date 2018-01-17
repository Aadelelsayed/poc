import React from 'react';
import {
  View,
  ActivityIndicator,
  ListView,
  Text,
  StyleSheet } from 'react-native';

import Car from './Car';
import Filters from './Filters';

let page = 1,
    itemsPerPage = 10;

export default class CarList extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			isLoading: true
		}
	}

	componentDidMount() {
      getCars()
        .then((res) => {
          let ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 != row2 });
          this.setState({
            isLoading: false,
            dataSouce: ds.cloneWithRows(res.Cars),
            totalItems: res.count
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
        <Filters></Filters>

        <Text
          style={styles.counter}>
          <Text style={{fontWeight: 'bold'}}>
            {this.state.totalItems}
          </Text> Items Available
        </Text>

				<ListView
					dataSource={this.state.dataSouce}
					renderRow={(rowData) =>
						<Car data={rowData} />
					} />
			</View>
		)
	}
}

const getCars = () => {
  return fetch(`https://api.emiratesauction.com/v2/carsonline?source=mweb&page=${page}&itemperpage=${itemsPerPage}`)
			.then((res) => res.json());
}

const styles = StyleSheet.create({
	container: {
		flex: 1
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
