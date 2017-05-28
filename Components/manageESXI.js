import React, { Component } from 'react';
import { View, Text, StyleSheet,  TouchableHighlight, ScrollView, Dimensions } from 'react-native';
import SSH from 'react-native-ssh';
import Spinner from 'react-native-loading-spinner-overlay';
import ManageVM from './manageVM.js';


export default class ManageESXI extends Component {

  componentWillMount() {
    this.setState({sshConfig: {user: this.props.user, host: this.props.host, password: this.props.password}}, () => {this.getAllVMs(!this.state.response)})
  }

  openVMDetails(vmName, vmSessionID) {
    console.log(vmName);

    this.props.pushView(ManageVM,
      {
      vmName: vmName + vmSessionID,
      vmSessionID: vmSessionID,
      sshConfig: this.state.sshConfig
    },
    vmName);
  }

  sendCMD() {
    this.props.navigator.push({
      component: Home,
      passProps: {
        name: name
      }
    })
  }

  powerOffVM(vmSessionID) {
    SSH.execute(this.state.sshConfig, 'vim-cmd vmsvc/power.off ' + vmSessionID).then(
      result => console.log(result),
      error =>  console.log('Error:', error)
    );
  }

  powerOnVM(vmSessionID) {
    SSH.execute(this.state.sshConfig, 'vim-cmd vmsvc/power.on ' + vmSessionID).then(
      result => console.log(result),
      error =>  console.log('Error:', error)
    );
  }

  getAllVMs(refresh) {
    if (refresh) {
      this.setState({response: null});
    }
    SSH.execute(this.state.sshConfig, 'vim-cmd vmsvc/getallvms').then((result) => {
      result.splice(0,1);
      let VMPromiseArray = [];
      result.map((VMdata) => {
        VMPromiseArray.push(SSH.execute(this.state.sshConfig, 'vim-cmd vmsvc/power.getstate ' + VMdata.substr(0,VMdata.indexOf(' '))));
      })
      Promise.all(VMPromiseArray).then(pwrStateArr => {
        let VMDataArray = [];
        let VMStateArr = [];
        for (let i = 0; i < pwrStateArr.length; i++) {
          let vmSessionID = result[i].substr(0,result[i].indexOf(' '));
          let vmName = result[i].substr(result[i].indexOf(' ')+1).match(/.*?(?=\[|$)/i)[0].trim();
          let VMState = {name: vmName, isVMOn: true, showControls: false}
          if (pwrStateArr[i][1].includes('on')) {
            VMState.isVMOn = true;
            VMDataArray.push(<TouchableHighlight key={i} onPress={() => this.openVMDetails(vmName, vmSessionID)}>
                              <View style={[styles.card, styles.vmSelectionBtn]}>
                                <Text style={styles.vmName}>{vmName}</Text>
                                <TouchableHighlight style={[styles.btn, styles.vmPowerBtnOn]} onPress={() => this.powerOffVM(vmSessionID)}>
                                <Text style={styles.whiteColorText}>Power Off</Text>
                                </TouchableHighlight>
                              </View>
                            </TouchableHighlight>)
          } else {
            VMState.isVMOn = false;
            VMDataArray.push(<TouchableHighlight key={i} onPress={() => this.openVMDetails(vmName, vmSessionID)}>
                              <View style={[styles.card, styles.vmSelectionBtn]}>
                                <Text style={styles.vmName}>{vmName}</Text>
                                <TouchableHighlight style={[styles.btn, styles.vmPowerBtnOff]} onPress={() => this.powerOnVM(vmSessionID)}>
                                  <Text style={styles.whiteColorText}>Power On</Text>
                                </TouchableHighlight>
                              </View>
                            </TouchableHighlight>)
          }
          VMStateArr.push(VMState)
        }
        this.setState({response: VMDataArray, VMStateArray: VMStateArr})
      });
    }).catch((err) => {
      console.log(err);
      this.setState({response: <View><Text>Error: {err}</Text></View>})
    })
  }

  vmList() {
    if (this.state.response == null) {
      return <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',}}>
                <Spinner visible={true} textContent={"Refreshing VM Status..."}/>
              </View>
    } else {
      if (this.state.response == false) {
        return
      }
    }
    return this.state.response
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {this.vmList()}
        </ScrollView>
        <TouchableHighlight style={[styles.btn, styles.buttonBg]} onPress={() => this.getAllVMs(true)}>
          <Text style={styles.buttonText}>{this.state.response ? "Refresh VMs Status" : "List All VMs"}</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  card: {
    padding: 8,
    margin: 5,
    width: '100%',
    backgroundColor: '#fff',
    justifyContent:'space-around',
    alignItems:'center',
    alignSelf:'center',
    borderRadius: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowRadius: 1,
    shadowOpacity: .8
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
  scrollView: {
    height: window.height - 120,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonBg:{
    backgroundColor:'rgb(0,181,80)',
    margin:20,
    width: "90%",
    height: "5%",
  },
  vmName: {
    fontFamily: 'System',
    fontWeight: 'bold',
  },
  whiteColorText: {
    color: 'white',
  },
  vmSelectionBtn: {
    justifyContent:'space-between',
    margin:20,
    width: "90%",
    flexDirection: 'row',
    height:50,
  },
  vmPowerBtnOn: {
    backgroundColor: '#32CD32',
    height:40,
    width: 80
  },
  vmPowerBtnOff: {
    backgroundColor: '#FF4500',
    height:40,
    width: 80
  },
  tabbar: {
    backgroundColor:'white',
    height: 64,
    borderTopColor: 'red',
    borderTopWidth: 2,
  },
})
