// src/screens/EditItemScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { saveInventoryItem } from "../utils/storage";

export default function EditItemScreen({ route, navigation }) {
  const { tagId, item } = route.params;
  const [itemData, setItemData] = useState({
    name: item.name || "",
    description: item.description || "",
    quantity: item.quantity.toString() || "0",
    location: item.location || "",
    category: item.category || "",
  });

  const updateItem = async () => {
    if (!itemData.name) {
      Alert.alert("Error", "Item name is required");
      return;
    }

    // Validate quantity is a number
    const quantity = parseInt(itemData.quantity);
    if (isNaN(quantity) || quantity < 0) {
      Alert.alert("Error", "Quantity must be a valid number");
      return;
    }

    const updatedItem = {
      ...item,
      ...itemData,
      quantity: quantity,
      lastUpdated: new Date().toISOString(),
    };

    const success = await saveInventoryItem(tagId, updatedItem);
    if (success) {
      Alert.alert("Success", "Item updated successfully", [
        {
          text: "OK",
          onPress: () => navigation.navigate("ItemDetails", { tagId }),
        },
      ]);
    } else {
      Alert.alert("Error", "Failed to update item");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Item</Text>
      <Text style={styles.tagId}>Tag ID: {tagId}</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Item Name *</Text>
        <TextInput
          style={styles.input}
          value={itemData.name}
          onChangeText={(text) => setItemData({ ...itemData, name: text })}
          placeholder="Enter item name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={itemData.description}
          onChangeText={(text) =>
            setItemData({ ...itemData, description: text })
          }
          placeholder="Enter item description"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          value={itemData.quantity}
          onChangeText={(text) => setItemData({ ...itemData, quantity: text })}
          placeholder="Enter quantity"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={itemData.location}
          onChangeText={(text) => setItemData({ ...itemData, location: text })}
          placeholder="Enter storage location"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={itemData.category}
          onChangeText={(text) => setItemData({ ...itemData, category: text })}
          placeholder="Enter category"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={updateItem}>
        <Text style={styles.saveButtonText}>Update Item</Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginBottom: 8,
  },
  tagId: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
