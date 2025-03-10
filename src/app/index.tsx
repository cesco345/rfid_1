// src/app/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { getAllInventoryItems } from "../utils/storage";

export default function InventoryHome() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadInventory = async () => {
    setLoading(true);
    const items = await getAllInventoryItems();
    setInventory(items);
    setLoading(false);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NFC Inventory Management</Text>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => router.push("/scan")}
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
                router.push({
                  pathname: "/itemDetails",
                  params: { tagId: item.tagId },
                })
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

      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => router.push("/reports")}
      >
        <Text style={styles.buttonText}>Generate Reports</Text>
      </TouchableOpacity>
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
  reportButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
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
