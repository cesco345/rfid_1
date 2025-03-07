// src/services/NfcService.js
import NfcManager, { NfcEvents } from "react-native-nfc-manager";

class NfcService {
  constructor() {
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return true;

    try {
      await NfcManager.start();
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("NFC initialization error:", error);
      return false;
    }
  }

  async startScan(callback) {
    if (!this.isInitialized) {
      const success = await this.initialize();
      if (!success) return false;
    }

    try {
      await this.stopScan(); // Make sure any previous scan is stopped

      NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
        callback(tag);
      });

      await NfcManager.registerTagEvent();
      return true;
    } catch (error) {
      console.error("Error starting NFC scan:", error);
      return false;
    }
  }

  async stopScan() {
    try {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      await NfcManager.unregisterTagEvent();
      return true;
    } catch (error) {
      console.error("Error stopping NFC scan:", error);
      return false;
    }
  }

  async cleanUp() {
    try {
      await this.stopScan();
      return true;
    } catch (error) {
      console.error("Error cleaning up NFC:", error);
      return false;
    }
  }
}

// Singleton instance
export default new NfcService();
