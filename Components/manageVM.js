import React, { Component } from 'react';
import { View, Text, StyleSheet,  TouchableHighlight, ScrollView, Image } from 'react-native';
import SSH from 'react-native-ssh';
import Spinner from 'react-native-loading-spinner-overlay';

export default class ManageVM extends Component {
  constructor(props) {
    super(props);

    this.state = {
      poweredOn: null,
      status: "Getting VM Status..."
    };
    this.powerStateOptions = this.powerStateOptions.bind(this);
    this.getPowerState = this.getPowerState.bind(this);
  }

  componentWillMount() {
    this.setState({poweredOn: null, status: "Getting VM Status..."}, () => {
      this.getPowerState()
      this.getVMScreenShot()
    })

  }

  getPowerState() {
    this.setState({poweredOn: null, status: "Getting VM Status..."});
    SSH.execute(this.props.sshConfig, ' vim-cmd vmsvc/power.getstate ' + this.props.vmSessionID).then((result) =>{
        if (result[1] == "Powered off") {
          this.setState({poweredOn: false})
        } else {
          if (result[1] == "Powered on") {
            this.setState({poweredOn: true})
          }
        }
    })
    SSH.execute(this.props.sshConfig, 'esxcli vm process list').then((result) =>{
        for (let i = 0; i < result.length; i+=8) {
          if (this.props.vmName == result[i]) {
            this.setState({worldID: result[i + 1].substr(result[i + 1].indexOf(":") + 1)})
          }
        }
    })
    SSH.execute(this.props.sshConfig, 'vim-cmd vmsvc/get.guest ' + this.props.vmSessionID).then((result) =>{
      let ipAddressArr = []
      for (let i = 0; i < result.length; i++) {
        if (result[i].includes('ipAddress = "')) {
          let ipAddress = result[i].split('"')[1];
          ipAddressArr.push(<Text key={i} style={styles.buttonText}>{ipAddress}</Text>)
        }
      }
      this.setState({ipAddressEl: ipAddressArr.splice(1, ipAddressArr.length - 1)})
    })
  }

  powerOffVM(vmSessionID) {
    this.setState({poweredOn: null, status: "Sending Power Off..."});
    SSH.execute(this.props.sshConfig, 'vim-cmd vmsvc/power.off ' + vmSessionID).then(
      result => this.setState({poweredOn: false}),
      error =>  console.log('Error:', error)
    );
  }

  softPowerOffVM(vmSessionID) {
    console.log('vim-cmd vmsvc/power.shutdown ' + vmSessionID)
    this.setState({poweredOn: null, status: "Sending Soft Power Off..."});
    SSH.execute(this.props.sshConfig, 'vim-cmd vmsvc/power.shutdown ' + vmSessionID).then(
      result => this.setState({poweredOn: true}),
      error =>  console.log('Error:', error)
    );
  }

  powerOnVM(vmSessionID) {
    this.setState({poweredOn: null, status: "Sending Power On..."});
    SSH.execute(this.props.sshConfig, 'vim-cmd vmsvc/power.on ' + vmSessionID).then(
      result => this.setState({poweredOn: true}),
      error =>  console.log('Error:', error)
    );
  }

  getVMScreenShot() {
    fetch('https://root:pinetree@192.168.3.2/screen?id=33').then((response) => {
      return response.blob();
    }).then((jsonData) => {
      console.log('data:image/png;base64,' + btoa(jsonData));
      this.setState({vmScreenShotData: 'data:image/png;base64,' + btoa(jsonData)});
    })
  }

  suspendVM(vmSessionID) {
    this.setState({poweredOn: null, status: "Sending Suspend Signal..."});
    SSH.execute(this.props.sshConfig, 'vim-cmd vmsvc/power.suspend ' + vmSessionID).then(
      result => this.setState({poweredOn: true}),
      error =>  console.log('Error:', error)
    );
  }

  powerStateOptions() {
    if (this.state.poweredOn == null) {
      return (<View style={{flex: 1,justifyContent: 'center',alignItems: 'center',}}>
                <Spinner visible={true} textContent={this.state.status}/>
              </View>)
    } else {
      if (this.state.poweredOn == false) {
        return (
          <View style={styles.actionsView}>
            <TouchableHighlight style={styles.vmSelectionBtn} onPress={() => this.powerOnVM(this.props.vmSessionID)}>
              <Text style={styles.buttonText}>Power On</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.vmSelectionBtn} onPress={() => this.getPowerState()}>
              <Text style={styles.buttonText}>Refresh VM's Status</Text>
            </TouchableHighlight>
          </View>
        )
      } else {
        if (this.state.poweredOn == true) {
          return (<ScrollView style={styles.scrollView}>
                    <View style={[styles.card, styles.actionsView]}>
                      <TouchableHighlight style={[styles.btn, styles.vmSelectionBtn]} onPress={() => this.softPowerOffVM(this.props.vmSessionID)}>
                        <Text style={styles.buttonText}>Soft Power Off</Text>
                      </TouchableHighlight>
                      <TouchableHighlight style={[styles.btn, styles.vmSelectionBtn]} onPress={() => this.powerOffVM(this.props.vmSessionID)}>
                        <Text style={styles.buttonText}>Force Power Off</Text>
                      </TouchableHighlight>
                      <TouchableHighlight style={[styles.btn, styles.vmSelectionBtn]} onPress={() => this.suspendVM(this.props.vmSessionID)}>
                        <Text style={styles.buttonText}>Suspend VM</Text>
                      </TouchableHighlight>
                      <TouchableHighlight style={[styles.btn, styles.vmSelectionBtn]} onPress={() => this.getPowerState()}>
                        <Text style={styles.buttonText}>Refresh VM's Status</Text>
                      </TouchableHighlight>
                    </View>
                    <View style={styles.card}>
                      {this.state.ipAddressEl || <Text>Loading...</Text>}
                    </View>
                  </ScrollView>)
        }
      }
    }
  }

  render() {
    return (
      <View style={styles.Container}>
        {this.powerStateOptions()}
        <View style={styles.vmDetailsView}>

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollView: {
    width: "100%",
    padding: 10
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
  actionsView: {
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  vmScreenShotView: {
    flex: .5,
    width: "90%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  vmDetailsView: {
    flex: .5,
    paddingBottom: 20,
    width: "90%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
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
    height:50,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
})
