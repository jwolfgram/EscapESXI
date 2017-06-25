import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Image
} from "react-native";
import SSH from "react-native-ssh";
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-menu";
import Spinner from "react-native-loading-spinner-overlay";

export default class SystemMenuESXI extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.menuSelection = this.menuSelection.bind(this);
    this.checkHostUp = this.checkHostUp.bind(this);
  }

  componentWillMount() {}

  powerOnVM(vmSessionID) {
    this.setState({ poweredOn: null, status: "Sending Power On..." });
    SSH.execute(
      this.props.sshConfig,
      "vim-cmd vmsvc/power.on " + vmSessionID
    ).then(
      result => this.setState({ poweredOn: true }),
      error => console.log("Error:", error)
    );
  }

  menuSelection(option) {
    if (option === "reboot") {
      // SSH.execute(this.props.sshConfig, "reboot").then(
      //   result => this.setState({ pressedReboot: true }),
      //   error => console.log("Error:", error)
      // );
    }
    this.setState({ pressedReboot: true });
  }

  checkHostUp() {
    SSH.execute(this.props, "ls").then(
      result => this.setState({ pressedReboot: false }),
      error => console.log("Error:", error)
    );
  }

  render() {
    if (this.state.pressedReboot) {
      window.setTimeout(this.checkHostUp, 5000); //Two mins
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Spinner visible={true} textContent={"Rebooting ESXI Host..."} />
        </View>
      );
    }
    return (
      <View style={styles.Container}>
        <MenuContext style={{ flex: 1 }}>
          <Menu onSelect={this.menuSelection}>
            <MenuTrigger>
              <Text style={{ fontSize: 20 }}>&#8942;</Text>
            </MenuTrigger>
            <MenuOptions>
              <MenuOption value={"reboot"}>
                <Text>
                  {this.state.pressedReboot ? "Rebooting..." : "Reboot"}
                </Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </MenuContext>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    flexDirection: "row",
    padding: 10
  }
});
