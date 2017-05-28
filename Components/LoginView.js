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
  View,
  Keyboard
} from 'react-native';
import SSH from 'react-native-ssh';
import ManageESXI from './manageESXI';
import Spinner from 'react-native-loading-spinner-overlay';


export default class LoginView extends Component {
  constructor(props){
    super(props);
    this.state = {
      userData:'',
      userServerKey:''
    }
    this.loginAction = this.loginAction.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
    AsyncStorage.multiGet(['hostname', 'username', 'password']).then((data) => {
      console.log(data);
      this.setState({hostname: data[0][1], username: data[1][1], password: data[2][1] })
    })
  }

  loginAction() {
    this.setState({loggingIn: true});
    if (this.state.hasOwnProperty('username') && this.state.hasOwnProperty('password') && this.state.hasOwnProperty('hostname')) {
      Keyboard.dismiss()
      AsyncStorage.multiSet([['hostname', this.state.hostname], ['username', this.state.username], ['password', this.state.password]])
      console.log(this.props);
      this.props.pushView(ManageESXI, {user: this.state.username, password: this.state.password, host: this.state.hostname}, "VMs");
    }
  }

  fixESXISSH() {
    sshConfigEcho = `echo '# running from inetd
# Port 2200
Protocol 2
HostKey /etc/ssh/ssh_host_rsa_key
HostKey /etc/ssh/ssh_host_dsa_key
UsePrivilegeSeparation no
SyslogFacility auth
LogLevel info
PermitRootLogin yes
PrintMotd yes
PrintLastLog no
TCPKeepAlive yes
X11Forwarding no
Ciphers aes128-ctr,aes192-ctr,aes256-ctr,3des-cbc
MACs hmac-sha2-256,hmac-sha2-512,hmac-sha1,hmac-sha1-96
UsePAM no
PasswordAuthentication yes
Banner /etc/issue
Subsystem sftp /usr/lib/vmware/openssh/bin/sftp-server -f LOCAL5 -l INFO
AuthorizedKeysFile /etc/ssh/keys-%u/authorized_keys
ClientAliveInterval 200' > /etc/ssh/sshd_config;`;
    SSH.execute({
      user: this.state.username,
      password: this.state.password,
      host: this.state.hostname
    }, "mv /etc/ssh/sshd_config /etc/ssh/sshd_config.BK;" + sshConfigEcho).then(
      result => console.log(result),
      error =>  console.log('Error:', error)
    );
  }

  showSSHFix() {
    if (this.state.loginTapCount >= 3) {
      return (<View style={styles.bottomGroup}>
                <TouchableHighlight style={styles.buttonBg} onPress={() => this.fixESXISSH()}>
                  <Text style={styles.buttonText}>Cannot Login? Try this...</Text>
                </TouchableHighlight>
              </View>)
    }
  }

  render() {
    if (this.state.loggingIn) {
      return <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',}}>
                <Spinner visible={true} textContent={"logging in..."}/>
              </View>
    }
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
          <TouchableHighlight style={[styles.card, styles.buttonBg]} onPress={() => this.loginAction()}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>
        </View>
      </View>);
  }
}

var {width} = Dimensions.get('window');

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
  btn: {
    padding: 3,
    margin: 5,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowRadius: 1,
    shadowOpacity: .8
  },
  inputGroup:{
    flex:3,
    paddingBottom: 20,
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
    width:220,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    height:50,
  },
  buttonText:{
    fontSize:16,
    justifyContent:'center',
    color:'white',
    alignSelf:'center',
    fontWeight: 'bold',
  }
});
