// src/app/editItem.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getInventoryItem, saveInventoryItem } from "../utils/storage";

export default function EditItemScreen() {
  const { tagId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    quantity: "0",
    location: "",
    category: "",
  });
  const [originalItem, setOriginalItem] = useState(null);

  useEffect(() => {
    const loadItem = async () => {
      const item = await getInventoryItem(tagId as string);
      if (item) {
        setOriginalItem(item);
        setItemData({
          name: item.name || "",
          description: item.description || "",
          quantity: item.quantity.toString() || "0",
          location: item.location || "",
          category: item.category || "",
        });
      } else {
        Alert.alert("Error", "Item not found");
        router.back();
      }
      setLoading(false);
    };

    loadItem();
  }, [tagId, router]);

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

    if (!originalItem) {
      Alert.alert("Error", "Cannot update: original item data missing");
      return;
    }

    const updatedItem = {
      ...originalItem,
      ...itemData,
      quantity: quantity,
      lastUpdated: new Date().toISOString(),
    };

    const success = await saveInventoryItem(tagId as string, updatedItem);
    if (success) {
      Alert.alert("Success", "Item updated successfully", [
        {
          text: "OK",
          onPress: () =>
            router.push({
              pathname: "/itemDetails",
              params: { tagId: tagId as string },
            }),
        },
      ]);
    } else {
      Alert.alert("Error", "Failed to update item");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading item data...</Text>
      </View>
    );
  }

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
