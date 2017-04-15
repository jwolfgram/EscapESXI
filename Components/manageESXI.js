import React, { Component } from 'react';
import { View, Text, StyleSheet,  TouchableHighlight, ScrollView } from 'react-native';
import SSH from 'react-native-ssh';

export default class ManageESXI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sshConfig: {user: this.props.user, host: this.props.host, password: this.props.password}
    };
    this.getAllVMs = this.getAllVMs.bind(this);
    this.powerOnVM = this.powerOnVM.bind(this);
    this.powerOffVM = this.powerOffVM.bind(this);
  }

  componentWillMount() {
    console.log(this.props);
    // this.setState({user: this.props.user, host: this.props.host, password: this.props.password})
    // SSH.execute(this.state.sshConfig, 'ls /').then(
    //   result => console.log(result),
    //   error =>  console.log('Error:', error)
    // );
  }

  sendCMD() {
    this.props.navigator.push({
      component: Home,
      passProps: {
        name: name
      }
    })
  }

  powerOffVM(worldID) {
    console.log('powretr off')
    SSH.execute(this.state.sshConfig, 'vim-cmd vmsvc/power.off ' + worldID).then(
      result => console.log(result),
      error =>  console.log('Error:', error)
    );
  }

  powerOnVM(worldID) {
    console.log('[pwer on]')
    SSH.execute(this.state.sshConfig, 'vim-cmd vmsvc/power.on ' + worldID).then(
      result => console.log(result),
      error =>  console.log('Error:', error)
    );
  }

  getAllVMs() {
    this.setState({response: (<Text>Wait for it....</Text>)});
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
          let worldID = result[i].substr(0,result[i].indexOf(' '));
          let vmName = result[i].substr(result[i].indexOf(' ')+1).match(/.*?(?=\[|$)/i)[0].trim();
          let VMState = {name: vmName, isVMOn: true, showControls: false}
          if (pwrStateArr[i][1].includes('on')) {
            VMState.isVMOn = true;
            VMDataArray.push(<View key={i} style={styles.vmSelectionBtn} onPress={() => this.powerOnVM(worldID)}>
                                <Text style={styles.vmName}>{vmName}</Text>
                                <TouchableHighlight style={styles.vmPowerBtnOn} onPress={() => this.powerOffVM(worldID)}>
                                <Text style={styles.whiteColorText}>Power Off</Text>
                                </TouchableHighlight>
                              </View>)
          } else {
            VMState.isVMOn = false;
            VMDataArray.push(<View key={i} style={styles.vmSelectionBtn} onPress={() => this.powerOffVM(worldID)}>
                                <Text style={styles.vmName}>{vmName}</Text>
                                <TouchableHighlight style={styles.vmPowerBtnOff} onPress={() => this.powerOnVM(worldID)}>
                                  <Text style={styles.whiteColorText}>Power On</Text>
                                </TouchableHighlight>
                              </View>)
          }
          VMStateArr.push(VMState)
        }
        console.log(VMStateArr);
        this.setState({response: VMDataArray, VMStateArray: VMStateArr})
      });
    }).catch((err) => {
      console.log(err);
    })
  }

  render() {
    const { page } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {this.state.response}
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
