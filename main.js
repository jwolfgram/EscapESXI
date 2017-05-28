/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, createElement } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  Dimensions
} from 'react-native';
import LoginView from './Components/LoginView.js'

export default class EscapESXI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      views: [
        {Component: LoginView,
          props: {},
          name: "Login"
        }
      ]
    }
    this.renderScene = this.renderScene.bind(this);
    this.renderNavigator = this.renderNavigator.bind(this);
    this.pushView = this.pushView.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {

  }
  pushView(view, props, name) {
    let pushThis = this.state.views.concat({Component: view, props: props, name: name});
    this.setState({views: pushThis});
  }

  goBack() {
    deleteView = this.state.views;
    deleteView.pop()
    this.setState({views: deleteView})
  }

  renderNavigator() {
    let currentView = this.state.views[this.state.views.length - 1]
    return (<View style={styles.navbarView}>
              <TouchableHighlight style={styles.leftNavButton} onPress={() => this.goBack()}><Text style={styles.leftNavButtonText}>{'<'}</Text></TouchableHighlight>
                <View  style={styles.titleView}>
                  <Text style={styles.title}>{currentView.name}</Text>
                </View>
              <TouchableHighlight style={styles.rightNavButton} onPress={() => console.log('shiot')}><Text style={styles.rightNavButtonText}></Text></TouchableHighlight>
            </View>)
  }

  renderScene() {
    let currentView = this.state.views[this.state.views.length - 1]
    return createElement(currentView.Component, {pushView: this.pushView, props: currentView.props})
  }

  render() {
    return (
      <View style={styles.container}>
      {this.renderNavigator()}
      <View style={styles.componentContainer}>
        {this.renderScene()}
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(29, 97, 179)',
    flexDirection:'column',
  },
  componentContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0
  },
  navbarView: {
    flexDirection:'row',
    height: 60,
    justifyContent:'space-around',
    alignItems:'center',
    alignSelf:'center',
    width: '100%',
    backgroundColor: 'rgba(0, 255, 0, 0.4)',
  },
  titleView: {
    flex: .8,
    alignItems:'center',
    alignSelf:'center',
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',

  },
  rightNavButtonText: {
    color: '#FFF',
    fontSize: 24,
    marginRight: 20,

  },
  leftNavButtonText: {
    color: '#FFF',
    fontSize: 24,
    marginLeft: 20,
  },
  rightNavButton: {
    flex: .1,
    alignItems:'center',
    alignSelf:'center',
  },
  leftNavButton: {
    flex: .1,
    alignItems:'center',
    alignSelf:'center',
  },
});
