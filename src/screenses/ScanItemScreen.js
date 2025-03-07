// src/screens/ScanItemScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import NfcManager, { NfcEvents } from "react-native-nfc-manager";
import { getInventoryItem } from "../utils/storage";

export default function ScanItemScreen({ navigation }) {
  const [scanning, setScanning] = useState(false);
  const [tagInfo, setTagInfo] = useState(null);

  useEffect(() => {
    const setupNfc = async () => {
      try {
        await NfcManager.start();
        startScan();
      } catch (error) {
        console.log("NFC setup error:", error);
        Alert.alert("Error", "Failed to initialize NFC");
        navigation.goBack();
      }
    };

    setupNfc();

    return () => {
      // Clean up NFC
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.unregisterTagEvent().catch(() => 0);
    };
  }, [navigation]);

  const startScan = () => {
    setScanning(true);
    setTagInfo(null);

    NfcManager.setEventListener(NfcEvents.DiscoverTag, async (tag) => {
      try {
        // Extract tag ID
        const tagId = tag.id;
        console.log("Tag detected:", tagId);

        // Check if item exists in inventory
        const existingItem = await getInventoryItem(tagId);

        // Cancel NFC scanning
        await NfcManager.unregisterTagEvent();

        setScanning(false);
        setTagInfo({ tagId, existingItem });

        // Navigate to the appropriate screen
        if (existingItem) {
          navigation.replace("ItemDetails", { tagId, isUpdate: true });
        } else {
          navigation.replace("AddNewItem", { tagId });
        }
      } catch (error) {
        console.log("Error processing tag:", error);
        Alert.alert("Error", "Failed to read NFC tag");
        setScanning(false);
      }
    });

    NfcManager.registerTagEvent().catch((error) => {
      console.log("Error registering for NFC events:", error);
      Alert.alert("Error", "Failed to register for NFC events");
      setScanning(false);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan NFC Tag</Text>

      {scanning ? (
        <View style={styles.scanningContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.scanningText}>
            Hold your device near an NFC tag
          </Text>
        </View>
      ) : (
        <Text style={styles.instructionText}>Preparing NFC scanner...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
  },
  scanningContainer: {
    alignItems: "center",
  },
  scanningText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  instructionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
});
