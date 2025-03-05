import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import NFCfcManager, { NfcEvents, nfcManager } from "react-native-nfc-manager";

function Game(props) {
  React.useEffect(() => {
    nfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
      console.warn("tag found", tag);
    });
    return () => {
      nfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    };
  }, []);
  async function scanTag() {
    await nfcManager.registerTagEvent();
  }

  return (
    <View style={styles.wrapper}>
      <Text>NFC Game</Text>
      <TouchableOpacity style={styles.btn} onPress={scanTag}>
        <Text style={styles.text}>Start NFC</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#ccc",
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  text: {
    color: "black",
  },
});

export default Game;
