/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
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
              { route.rightText || 'Right Button' }
         </Text>
       </TouchableHighlight>)
  },
  Title(route, navigator, index, navState) {
    return <Text style={ styles.title }>{route.component.name || 'EscapESXI'}</Text>
  }
};

export default class EscapESXI extends Component {

  renderScene(route, navigator) {
    console.log(route.component);
     return React.createElement(route.component, { ...this.props, ...route.passProps, route, navigator } )
  }

  render() {
    return (
      <View style={styles.container}>
      <Navigator
        style={styles.navigationView}
        initialRoute={{ component: LoginView }}
        renderScene={ this.renderScene }
        routeMapper={ NavigationBarRouteMapper }
        navigationBar={ <Navigator.NavigationBar
                          style={ styles.navbarView }
                          routeMapper={ NavigationBarRouteMapper } />
                      }
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    flexDirection:'row',
  },
  navigationView: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: 'rgb(29, 97, 179)',
  },
  navbarView: {
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
