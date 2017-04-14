import React, { Component } from 'react';
import { View, Text, StyleSheet,  TouchableHighlight, ScrollView } from 'react-native';
import SSH from 'react-native-ssh';

export default class ManageESXI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sshConfig: {user: 'root', host: '192.168.2.7', password: 'pinetree'}
    };
    this.openVmActionSheet = this.openVmActionSheet.bind(this);
    this.getAllVMs = this.getAllVMs.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
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
//Can work on this one, but seems unnessesarry for the end goal.
  // listRunningVMs() {
  //   SSH.execute(this.state.sshConfig, 'esxcli vm process list').then((result) => {
  //     console.log('list running vms');
  //     console.log((result.length + 1) / 8); //Total VMs
  //     console.log(result);
  //     this.setState({response: result})
  //   }).catch((err) => {
  //     console.log(err);
  //   })
  // }
  openVmActionSheet(worldID) {
    console.log(worldID);
    // SSH.execute(this.state.sshConfig, 'ls /').then(
    //   result => console.log(result),
    //   error =>  console.log('Error:', error)
    // );
  }

  getAllVMs() {
    SSH.execute(this.state.sshConfig, 'vim-cmd vmsvc/getallvms').then((result) => {
      result.splice(0,1);
      // console.log('get all vms');
      // console.log(result);
      let VMPromiseArray = [];
      result.map((VMdata) => {
        // console.log(VMdata.substr(0,VMdata.indexOf(' ')))
        // console.log(VMdata.substr(VMdata.indexOf(' ')+1).match(/.*?(?=\[|$)/i)[0]) //Everything after the worldID (used to start / stop VMs)
        VMPromiseArray.push(SSH.execute(this.state.sshConfig, 'vim-cmd vmsvc/power.getstate ' + VMdata.substr(0,VMdata.indexOf(' '))));
      })
      Promise.all(VMPromiseArray).then(pwrStateArr => {
        let VMDataArray = [];
        let VMStateArr = [];
        for (let i = 0; i < pwrStateArr.length; i++) {
          let worldID = result[i].substr(0,result[i].indexOf(' '));
          let vmName = result[i].substr(result[i].indexOf(' ')+1).match(/.*?(?=\[|$)/i)[0].trim();
          if (pwrStateArr[i][1].includes('on')) {
            VMStateArr.push({name: vmName, isVMOn: true})
            VMDataArray.push(<TouchableHighlight onPress={() => this.openVmActionSheet(worldID)} key={i} style={styles.vmSelectionBtnOn}>
                              <Text>{result[i].substr(result[i].indexOf(' ')+1).match(/.*?(?=\[|$)/i)[0]} - {pwrStateArr[i][1]}</Text>
                            </TouchableHighlight>)
          } else {
            VMStateArr.push({responseStr: vmName, isVMOn: false})
            VMDataArray.push(<TouchableHighlight onPress={() => this.openVmActionSheet(worldID)} key={i} style={styles.vmSelectionBtnOff}>
                  <Text>{result[i].substr(result[i].indexOf(' ')+1).match(/.*?(?=\[|$)/i)[0]} - {pwrStateArr[i][1]}</Text>
                </TouchableHighlight>)
          }

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
    alignItems: 'center',
  },
  scrollView: {
    height: "90%",
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
  vmSelectionBtnOn: {
    backgroundColor: 'green',
    margin:20,
    width: "90%",
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    height:50,
    borderRadius:5
  },
  vmSelectionBtnOff: {
    backgroundColor: 'red',
    margin:20,
    width: "90%",
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    height:50,
    borderRadius:5
  },
  tabbar: {
    backgroundColor:'white',
    height: 64,
    borderTopColor: 'red',
    borderTopWidth: 2,
  },
})
