/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, createElement, createClass } from 'react';
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
      views: [],
      currentCount: 0
    }
    this.renderScene = this.renderScene.bind(this);
    this.renderNavigator = this.renderNavigator.bind(this);
    this.pushView = this.pushView.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentWillMount() {
    this.pushView(LoginView, {}, "Login")
  }

  pushView(view, props, name) {
    let stateViews = this.state.views
    let currentView = stateViews[this.state.views.length - 1]

    if (currentView && this.refs.current) {
      currentView.state = this.refs.current.state
      console.log(currentView)
    }

    let pushThis = stateViews.concat({Component: view, props: props, name: name});
    this.setState({views: pushThis});
  }

  goBack() {
    deleteView = this.state.views;
    console.log(deleteView)
    deleteView.pop()
    this.setState({views: deleteView})
  }

  renderNavigator() {
    let currentView = this.state.views[this.state.views.length - 1]
    return (<View style={styles.navbarView}>
              { this.state.views.length > 1 ? <TouchableHighlight style={styles.leftNavButton} onPress={() => this.goBack()}><Text style={styles.leftNavButtonText}>{'<'}</Text></TouchableHighlight> : <Text style={styles.leftNavButtonText}>{'  '}</Text>}
                <View  style={styles.titleView}>
                  <Text style={styles.title}>{currentView.name}</Text>
                </View>
              <TouchableHighlight style={styles.rightNavButton} onPress={() => console.log('shiot')}><Text style={styles.rightNavButtonText}></Text></TouchableHighlight>
            </View>)
  }

  renderScene() {
    let currentView = this.state.views[this.state.views.length - 1]
    let element = currentView.Component
    //SET INIT STATE HERE
    let elementFuncNames = Object.getOwnPropertyNames(element.prototype);
    let newObject = { //We can add custom callback functions here such as goBack() for navigation
                      getInitialState: function() {
                        console.log(this)
                        return currentView.state || {};
                      }
                    }
    for (let obj of elementFuncNames) {
      if (obj == 'constructor') { //TODO
      } else {
        newObject[obj] = element.prototype[obj]
      }
    }
    let classInstance = createClass(newObject)
    let elementInstance = createElement(classInstance, {pushView: this.pushView, props: {}})
    return <elementInstance.type ref="current" pushView={this.pushView} {...currentView.props}/>//element
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
    backgroundColor: '#455A64',
    flexDirection:'column',
  },
  componentContainer: {
    flex: 1,
    zIndex: -10,
  },
  navbarView: {
    flexDirection:'row',
    height: 60,
    justifyContent:'space-around',
    alignItems:'center',
    alignSelf:'center',
    width: '100%',
    paddingTop: 20,
    backgroundColor: '#607D8B',
    shadowColor: '#000000',
    shadowOffset: {
      width: 1,
      height: 2
    },
    shadowRadius: 1,
    shadowOpacity: .8
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
