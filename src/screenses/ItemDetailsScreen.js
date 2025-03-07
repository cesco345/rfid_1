// src/screens/ItemDetailsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getInventoryItem, saveInventoryItem } from "../utils/storage";

export default function ItemDetailsScreen({ route, navigation }) {
  const { tagId, isUpdate } = route.params;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      const itemData = await getInventoryItem(tagId);
      if (itemData) {
        setItem(itemData);
      } else {
        Alert.alert("Error", "Item not found");
        navigation.goBack();
      }
      setLoading(false);
    };

    loadItem();
  }, [tagId, navigation]);

  const handleUpdateQuantity = async (change) => {
    const newQuantity = Math.max(0, parseInt(item.quantity) + change);
    const updatedItem = {
      ...item,
      quantity: newQuantity,
      lastUpdated: new Date().toISOString(),
    };

    const success = await saveInventoryItem(tagId, updatedItem);
    if (success) {
      setItem(updatedItem);
    } else {
      Alert.alert("Error", "Failed to update quantity");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading item details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.tagId}>Tag ID: {tagId}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>
          {item.description || "No description provided"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inventory Details</Text>

        <View style={styles.quantityContainer}>
          <Text style={styles.label}>Quantity:</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleUpdateQuantity(-1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantityText}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleUpdateQuantity(1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.detailText}>
            {item.location || "Not specified"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.detailText}>
            {item.category || "Uncategorized"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>History</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Last Updated:</Text>
          <Text style={styles.detailText}>
            {new Date(item.lastUpdated).toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Created:</Text>
          <Text style={styles.detailText}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditItem", { tagId, item })}
        >
          <Text style={styles.editButtonText}>Edit Item</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tagId: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    width: 100,
    color: "#555",
  },
  detailText: {
    fontSize: 16,
    flex: 1,
    color: "#333",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  quantityButton: {
    backgroundColor: "#e0e0e0",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 16,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 40,
  },
  editButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
