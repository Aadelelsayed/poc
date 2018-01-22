import React, {
  PureComponent
} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  SectionList,
  TouchableOpacity
} from 'react-native';

const sortItems = [
    {
      title: "High Price",
      sortKey: "currentPrice",
      sortDir: 1
    },
    {
      title: "Low Price",
      sortKey: "currentPrice",
      sortDir: 2
    },
    {
      title: "High Lot",
      sortKey: "AuctionInfo.currentPrice",
      sortDir: 1
    },
    {
      title: "Low Lot",
      sortKey: "AuctionInfo.currentPrice",
      sortDir: 2
    },
    {
      title: "High Bids",
      sortKey: "AuctionInfo.currentPrice",
      sortDir: "desc"
    },
    {
      title: "Low Bids",
      sortKey: "AuctionInfo.currentPrice",
      sortDir: "desc"
    },
    {
      title: "Ending Soon",
      sortKey: "AuctionInfo.currentPrice",
      sortDir: "desc"
    }
]

export default class SortModal extends PureComponent {
  constructor(probs){
    super(probs);
  }

  state = {
    visible: true
  }

  _open(){
    this.setState({ visible: true });
  }

  _close(){
    this.setState({ visible: false });
  }

  _onPress = (item) => {
    this.props.onPress(item.sortKey, item.sortDir);

    this.setState({ visible: false });
  }

  _getItem = (item, index) => {
    return(
      <TouchableOpacity
        onPress={_ => this._onPress(item)}
        style={{paddingTop: 10, paddingBottom: 10, borderBottomColor: '#EEE', borderBottomWidth: 1, paddingLeft: 10}}
        key={index}>
        <Text style={{fontSize: 16, color: 'blue'}}>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View>
        <Modal
         style={styles.container}
          visible={this.state.visible}
          transparent={true}
          animationType={'fade'}
          onRequestClose={() => this._close()}>

          <View style={[styles.modalContainer]}>
            <TouchableOpacity style={{flex: 2}} onPress={this._close.bind(this)} />

            <View style={{flex: 3.2, backgroundColor: 'white', alignContent: 'flex-start'}}>
              <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold', backgroundColor: '#EEE', paddingBottom: 10, paddingTop: 10, paddingLeft: 10, alignContent: 'flex-end'}}>
                Sort items
              </Text>

              {sortItems.map((item, index) =>
                  this._getItem(item, index)
              )}

            </View>
          </View>



        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  }
})
