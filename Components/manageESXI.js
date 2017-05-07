import React, { Component } from 'react';
import { View, Text, StyleSheet,  TouchableHighlight, ScrollView } from 'react-native';
import SSH from 'react-native-ssh';
import Spinner from 'react-native-loading-spinner-overlay';
import ManageVM from './manageVM.js';


export default class ManageESXI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sshConfig: {user: this.props.props.user, host: this.props.props.host, password: this.props.props.password},
      // sshConfig: {user: "root", host: "192.168.3.2", password: "pinetree"},
      response: false
    };
    this.getAllVMs = this.getAllVMs.bind(this);
    this.powerOnVM = this.powerOnVM.bind(this);
    this.powerOffVM = this.powerOffVM.bind(this);
    this.vmList = this.vmList.bind(this);
    this.openVMDetails = this.openVMDetails.bind(this);
  }

  componentDidMount() {
    this.getAllVMs()
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

  getAllVMs() {
    this.setState({response: null});
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
                              <View key={i} style={styles.vmSelectionBtn}>
                                <Text style={styles.vmName}>{vmName}</Text>
                                <TouchableHighlight style={styles.vmPowerBtnOn} onPress={() => this.powerOffVM(vmSessionID)}>
                                <Text style={styles.whiteColorText}>Power Off</Text>
                                </TouchableHighlight>
                              </View>
                            </TouchableHighlight>)
          } else {
            VMState.isVMOn = false;
            VMDataArray.push(<TouchableHighlight key={i} onPress={() => this.openVMDetails(vmName, vmSessionID)}>
                              <View style={styles.vmSelectionBtn}>
                                <Text style={styles.vmName}>{vmName}</Text>
                                <TouchableHighlight style={styles.vmPowerBtnOff} onPress={() => this.powerOnVM(vmSessionID)}>
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
    const { page } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {this.vmList()}
        </ScrollView>
        <TouchableHighlight style={styles.buttonBg} onPress={() => this.getAllVMs()}>
          <Text style={styles.buttonText}>{this.state.response ? "Refresh VMs Status" : "List All VMs"}</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  scrollView: {
    height: "90%",
  },
  buttonText: {
    color: 'white',
  },
  buttonBg:{
    backgroundColor:'rgb(0,181,80)',
    margin:20,
    width: "90%",
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    height: "5%",
    borderRadius:5
  },
  vmName: {
    width: '60%',
    color: 'white',
  },
  whiteColorText: {
    color: 'white',
  },
  vmSelectionBtn: {
    backgroundColor:'#1E90FF',
    margin:20,
    width: "90%",
    flexDirection: 'row',
    justifyContent:'space-around',
    alignItems:'center',
    alignSelf:'center',
    height:50,
    borderRadius:5
  },
  vmPowerBtnOn: {
    backgroundColor: '#32CD32',
    borderRadius:5,
    height:40,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  vmPowerBtnOff: {
    backgroundColor: '#FF4500',
    borderRadius:5,
    height:40,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabbar: {
    backgroundColor:'white',
    height: 64,
    borderTopColor: 'red',
    borderTopWidth: 2,
  },
})
