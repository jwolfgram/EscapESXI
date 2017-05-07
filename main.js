/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, createElement, Dimensions } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight
} from 'react-native';
import LoginView from './Components/LoginView.js'

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if(index > 0) {
      return (
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => { if (index > 0) { navigator.pop() } }}>
          <Text style={ styles.leftNavButtonText }>{'<'}</Text>
        </TouchableHighlight>)
    }
    else { return null }
  },
  RightButton(route, navigator, index, navState) {
    if (route.onPress) return (
      <TouchableHighlight
         onPress={ () => route.onPress() }>
         <Text style={ styles.rightNavButtonText }>
              { route.rightText || '' }
         </Text>
       </TouchableHighlight>)
  },
  Title(route, navigator, index, navState) {
    return <Text style={ styles.title }>{route.name || 'EscapESXI'}</Text>
  }
};

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
    console.log('delteing view');
    console.log(this.state);
    deleteView = this.state.views;
    deleteView.pop()
    console.log(deleteView);
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
    console.log(this.state.views);
    let currentView = this.state.views[this.state.views.length - 1]
    console.log(currentView);
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
    height: '100%',
    paddingTop: 60,
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
    flex: .33,
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
    flex: .33,
    alignItems:'center',
    alignSelf:'center',
  },
  leftNavButton: {
    flex: .33,
    alignItems:'center',
    alignSelf:'center',
  },
});
