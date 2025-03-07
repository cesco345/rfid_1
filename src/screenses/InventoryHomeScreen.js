// src/screens/InventoryHomeScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { getAllInventoryItems } from "../utils/storage";

export default function InventoryHomeScreen({ navigation }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInventory = async () => {
    setLoading(true);
    const items = await getAllInventoryItems();
    setInventory(items);
    setLoading(false);
  };

  useEffect(() => {
    loadInventory();

    // Refresh inventory when screen comes into focus
    const unsubscribe = navigation.addListener("focus", loadInventory);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Management</Text>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate("ScanItem")}
      >
        <Text style={styles.buttonText}>Scan New Item</Text>
      </TouchableOpacity>

      {loading ? (
        <Text style={styles.loadingText}>Loading inventory...</Text>
      ) : inventory.length === 0 ? (
        <Text style={styles.emptyText}>
          No items in inventory. Scan an item to get started.
        </Text>
      ) : (
        <FlatList
          data={inventory}
          keyExtractor={(item) => item.tagId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemCard}
              onPress={() =>
                navigation.navigate("ItemDetails", { tagId: item.tagId })
              }
            >
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemDetails}>
                Last updated: {new Date(item.lastUpdated).toLocaleString()}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  scanButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 40,
  },
  itemCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  itemDetails: {
    color: "#666",
    fontSize: 14,
    marginBottom: 4,
  },
});
