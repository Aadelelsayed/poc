import React, {
  PureComponent
} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  SectionList,
  TouchableOpacity,
  ListView
} from 'react-native';

import Accordion from 'react-native-collapsible/Accordion';

export default class FilterModal extends PureComponent {
  constructor(probs){
    super(probs);

    this.sections = [
      'Car Type', 'Makers', 'Models', 'Year'
    ]
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps)
  }

  state = {
    visible: false
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

  _renderHeader(content, index, isActive, sections){
    return(
      <View style={{ borderBottomColor: '#EEE', borderBottomWidth: 1, paddingBottom: 10, paddingTop: 10, marginLeft: 10, marginRight: 10, flexDirection: 'row', paddingRight: 10}}>
        <Text style={{fontSize: 14, color: '#3f3f3f', flex: 2}}>{content}</Text>
        <Icon name="caret-down" size={14} color ="#fa493e" />
      </View>
    )
  }

  _renderContent(content, index, isActive, sections){
    console.log(index);
    if(index == 0){
      console.log(this.props);
      return(this.props.carTypes.map((type) => {
        <Text>{type}</Text>
      }));
    }
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
            <TouchableOpacity style={{flex: 1}} onPress={this._close.bind(this)} />

            <View style={{flex: 4.2, backgroundColor: 'white', alignContent: 'flex-start'}}>
              <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold', backgroundColor: '#EEE', paddingBottom: 10, paddingTop: 10, paddingLeft: 10, alignContent: 'flex-end'}}>
                Filters
              </Text>

              <Accordion
                sections={this.sections}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent.bind(this)}
              />
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
