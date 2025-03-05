import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import NfcManager, { NfcEvents } from "react-native-nfc-manager";

function Game(props) {
  const [start, setStart] = React.useState(null);
  const [duration, setDuration] = React.useState(0);
  const [hasNfc, setHasNfc] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  // Check NFC support when component mounts
  React.useEffect(() => {
    const checkNfc = async () => {
      try {
        const supported = await NfcManager.isSupported();
        if (supported) {
          await NfcManager.start();
          setHasNfc(true);
          setIsReady(true);
        } else {
          setHasNfc(false);
          setIsReady(true);
        }
      } catch (error) {
        console.log("NFC init error:", error);
        setHasNfc(false);
        setIsReady(true);
      }
    };

    checkNfc();

    return () => {
      // Cleanup when component unmounts
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.unregisterTagEvent().catch(() => 0);
    };
  }, []);

  // Set up tag discovery event listener when game starts
  React.useEffect(() => {
    if (!start || !hasNfc) return;

    let count = 5;

    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
      console.log("Tag detected:", tag);
      count--;
      if (count <= 0) {
        NfcManager.unregisterTagEvent().catch(() => 0);
        setDuration(new Date().getTime() - start.getTime());
      }
    });

    return () => {
      if (hasNfc) {
        NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      }
    };
  }, [start, hasNfc]);

  async function scanTag() {
    if (!hasNfc) return;

    try {
      await NfcManager.registerTagEvent();
      setStart(new Date());
      setDuration(0);
    } catch (error) {
      console.log("Error starting NFC scan:", error);
    }
  }

  if (!isReady) {
    return (
      <View style={styles.wrapper}>
        <Text>Checking NFC capabilities...</Text>
      </View>
    );
  }

  if (!hasNfc) {
    return (
      <View style={styles.wrapper}>
        <Text>NFC is not supported on this device</Text>
        <Text>Platform: {Platform.OS}</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>NFC Game</Text>
      {duration > 0 && (
        <Text style={styles.result}>Duration: {duration} ms</Text>
      )}
      <TouchableOpacity style={styles.btn} onPress={scanTag}>
        <Text style={styles.btnText}>Start NFC Game</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  result: {
    fontSize: 18,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#007AFF",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Game;
