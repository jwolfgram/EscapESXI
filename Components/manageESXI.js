import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class ManageESXI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 'first'
    };
  }

  sendCMD() {
    this.props.navigator.push({
      component: Home,
      passProps: {
        name: name
      }
    })
  }

  render() {
    const { page } = this.state;
    return (
      <View style={styles.container}>
        <Text>oihwdf</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column',
  },
  tabbar: {
    backgroundColor:'white',
    height: 64,
    borderTopColor: 'red',
    borderTopWidth: 2,
  },
})
