// src/app/scan.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import NfcManager, { NfcEvents } from "react-native-nfc-manager";
import { getInventoryItem } from "../utils/storage";

export default function ScanScreen() {
  const [state, setState] = useState({
    scanning: false,
    error: null,
    nfcAvailable: null,
  });
  const router = useRouter();
  const scanTimeoutRef = useRef(null);

  // Force complete reset of NFC Manager
  const hardResetNfc = async () => {
    console.log("Performing hard NFC reset");

    try {
      // Try all possible cleanup methods
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);

      try {
        await NfcManager.unregisterTagEvent();
      } catch (e) {
        console.log("Unregister failed:", e);
      }

      try {
        await NfcManager.cancelTechnologyRequest();
      } catch (e) {
        console.log("Cancel tech request failed:", e);
      }

      // Wait a moment before reinitializing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Go back to initial state
      setState({
        scanning: false,
        error: null,
        nfcAvailable: null,
      });
    } catch (e) {
      console.log("Hard reset failed:", e);
    }
  };

  // Check if NFC is available
  const checkNfcAvailability = async () => {
    try {
      const isSupported = await NfcManager.isSupported();
      setState((prev) => ({ ...prev, nfcAvailable: isSupported }));
      return isSupported;
    } catch (error) {
      console.error("Error checking NFC support:", error);
      setState((prev) => ({
        ...prev,
        nfcAvailable: false,
        error: "Failed to check NFC availability",
      }));
      return false;
    }
  };

  // Initialize and start scanning
  const startScanning = async () => {
    // If NFC state is unknown, check availability first
    if (state.nfcAvailable === null) {
      const isAvailable = await checkNfcAvailability();
      if (!isAvailable) return;
    }

    setState((prev) => ({ ...prev, error: null, scanning: true }));

    try {
      await NfcManager.start();
      console.log("NFC started successfully");

      // Set timeout to prevent indefinite scanning
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = setTimeout(() => {
        stopScanning();
        setState((prev) => ({
          ...prev,
          scanning: false,
          error: "Scan timed out. Please try again.",
        }));
      }, 20000);

      // Register for tag discovery
      NfcManager.setEventListener(NfcEvents.DiscoverTag, handleTagDiscovered);
      await NfcManager.registerTagEvent();
    } catch (error) {
      console.error("Error starting NFC scan:", error);
      setState((prev) => ({
        ...prev,
        scanning: false,
        error:
          "Failed to initialize NFC. Try returning to home screen and scanning again.",
      }));
    }
  };

  const stopScanning = async () => {
    try {
      // Clear the timeout if it exists
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = null;
      }

      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      await NfcManager.unregisterTagEvent();
    } catch (error) {
      console.error("Error stopping NFC scan:", error);
    }
  };

  const handleTagDiscovered = async (tag) => {
    try {
      // Stop active scanning
      await stopScanning();

      const tagId = tag.id || "";
      console.log("Tag detected:", tagId);

      // Look up the item in inventory
      const existingItem = await getInventoryItem(tagId);

      // Navigate based on item existence - don't reset NFC, just navigate
      if (existingItem) {
        router.push({
          pathname: "/itemDetails",
          params: { tagId, isUpdate: true },
        });
      } else {
        router.push({
          pathname: "/addItem",
          params: { tagId },
        });
      }
    } catch (error) {
      console.error("Error processing tag:", error);
      setState((prev) => ({
        ...prev,
        scanning: false,
        error: "Failed to process NFC tag. Please try again.",
      }));
    }
  };

  // Component mount effect
  useEffect(() => {
    // Start the initial scan
    startScanning();

    // Cleanup function when component unmounts
    return () => {
      // Clear any timeouts
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }

      // Stop NFC scanning
      stopScanning();
    };
  }, []);

  // Handle return to home screen with complete reset
  const returnToHome = async () => {
    await hardResetNfc();
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan NFC Tag</Text>

      {state.scanning ? (
        <View style={styles.scanningContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.scanningText}>
            Hold your device near an NFC tag
          </Text>
        </View>
      ) : state.error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{state.error}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={hardResetNfc}
            >
              <Text style={styles.buttonText}>Reset NFC</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#34C759" }]}
              onPress={startScanning}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : state.nfcAvailable === false ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            NFC is not available on this device or is disabled.
          </Text>
          <TouchableOpacity style={styles.actionButton} onPress={returnToHome}>
            <Text style={styles.buttonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.instructionText}>Preparing NFC scanner...</Text>
      )}

      <TouchableOpacity style={styles.returnButton} onPress={returnToHome}>
        <Text style={styles.buttonText}>Return to Home</Text>
      </TouchableOpacity>
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
  errorContainer: {
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff3b30",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
    margin: 5,
  },
  returnButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "#ff3b30",
    padding: 12,
    borderRadius: 8,
    minWidth: 160,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
