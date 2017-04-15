/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  Text,
  TextInput,
  Alert,
  AsyncStorage,
  View
} from 'react-native';
import ManageESXI from './manageESXI';

export default class LoginView extends Component {
  constructor(props){
    super(props);
    this.state = {
      userData:'',
      userServerKey:''
    }
  }

  loginAction() {
    console.log(this.props);
    if (this.state.hasOwnProperty('username') && this.state.hasOwnProperty('password') && this.state.hasOwnProperty('hostname')) {
      this.props.navigator.push({
        component: ManageESXI,
          passProps: {
            user: this.state.username,
            password: this.state.password,
            host: this.state.hostname
          }
        })
    } else {
      console.log('needs the shit bitch');
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.title}>EscapESXI</Text>
          <TextInput
              style={styles.inputStyle}
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={(text) => this.setState({hostname: text})}
              value={this.state.hostname}
              placeholder={"Hostname or IP Address"}
              placeholderTextColor='grey'
          />
          <TextInput
              style={styles.inputStyle}
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={(text) => this.setState({username: text})}
              value={this.state.username}
              placeholder={"Username"}
              placeholderTextColor='grey'
          />
          <TextInput
            style={styles.inputStyle}
            autoCapitalize='none'
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
            secureTextEntry={true}
            placeholder={"Password"}
            placeholderTextColor='grey'
          />
        </View>
        <View style={styles.bottomGroup}>
          <TouchableHighlight style={styles.buttonBg} onPress={() => this.loginAction()}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>
        </View>
      </View>);
  }
}

var {width,height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'#FFF',
  },
  bottomGroup:{
    flex:2,
    flexDirection:'column',
  },
  inputGroup:{
    flex:3,
    flexDirection:'column',
    justifyContent: 'flex-end',
  },
  inputStyle:{
    height: 40,
    width:width - 40,
    marginBottom: 10,
    borderColor: 'grey',
    borderWidth: 0.5,
    backgroundColor:'#FFFFFF',
    textAlign:'center',
    color:'grey'
  },
  loginGroup:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  loginGroupAccount: {
    fontSize: 16,
    color:'#000000',
    textAlign:'right',
  },
  loginGroupBtnLabel: {
    fontSize: 16,
    margin: 20,
    color:'rgb(0,179,227)',
    textAlign:'left',
    flex:1
  },
  buttonBg:{
    backgroundColor:'rgb(0,181,80)',
    margin:20,
    width:220,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    height:50,
    borderRadius:5
  },
  buttonText:{
    fontSize:16,
    justifyContent:'center',
    color:'white',
    alignSelf:'center'
  }
});
