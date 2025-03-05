import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform, Button } from "react-native";

// Safely import NFC manager
let NfcManager = null;
try {
  NfcManager = require("react-native-nfc-manager").default;
} catch (error) {
  console.log("Failed to import NFC manager");
}

function App() {
  const [nfcState, setNfcState] = useState({
    isSupported: false,
    isEnabled: false,
    error: null,
    loading: true,
  });

  useEffect(() => {
    async function checkNfc() {
      // If NFC manager wasn't imported successfully, skip checks
      if (!NfcManager) {
        setNfcState({
          isSupported: false,
          isEnabled: false,
          error: "NFC module not available",
          loading: false,
        });
        return;
      }

      try {
        // Try to check if the device supports NFC
        const isSupported = await NfcManager.isSupported();
        console.log("NFC supported:", isSupported);

        // If NFC is supported, check if it's enabled
        let isEnabled = false;
        if (isSupported) {
          try {
            isEnabled = await NfcManager.isEnabled();
            console.log("NFC enabled:", isEnabled);

            // Try to initialize NFC if enabled
            if (isEnabled) {
              try {
                await NfcManager.start();
                console.log("NFC started successfully");
              } catch (startError) {
                console.log("Error starting NFC:", startError);
              }
            }
          } catch (enabledError) {
            console.log("Error checking if NFC is enabled:", enabledError);
          }
        }

        setNfcState({
          isSupported,
          isEnabled,
          error: null,
          loading: false,
        });
      } catch (error) {
        console.log("Error in NFC check:", error);
        setNfcState({
          isSupported: false,
          isEnabled: false,
          error: error.message || "Unknown NFC error",
          loading: false,
        });
      }
    }

    checkNfc();

    // Cleanup function
    return () => {
      if (NfcManager) {
        try {
          NfcManager.cancelTechnologyRequest().catch(() => {});
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  // Always render a UI regardless of NFC state
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>NFC Tag Counter</Text>

      {nfcState.loading ? (
        <Text style={styles.text}>Checking NFC capabilities...</Text>
      ) : (
        <>
          <Text style={styles.text}>Platform: {Platform.OS}</Text>

          {nfcState.error ? (
            <Text style={styles.errorText}>Error: {nfcState.error}</Text>
          ) : (
            <>
              <Text style={styles.text}>
                NFC Supported: {nfcState.isSupported ? "Yes" : "No"}
              </Text>
              {nfcState.isSupported && (
                <Text style={styles.text}>
                  NFC Enabled: {nfcState.isEnabled ? "Yes" : "No"}
                </Text>
              )}
            </>
          )}

          {nfcState.isSupported && nfcState.isEnabled ? (
            <Text style={styles.readyText}>Ready to scan NFC tags</Text>
          ) : (
            <Text style={styles.notReadyText}>
              NFC is not available or not enabled
            </Text>
          )}

          <Text style={styles.welcomeText}>Hello World</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  text: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: "#ff3b30",
    marginBottom: 10,
  },
  readyText: {
    fontSize: 20,
    color: "#34c759",
    marginTop: 20,
    marginBottom: 20,
  },
  notReadyText: {
    fontSize: 20,
    color: "#ff9500",
    marginTop: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007aff",
    marginTop: 30,
  },
});

export default App;
