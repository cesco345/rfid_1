// Create a new file: src/utils/storage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

// Store inventory data
export const saveInventoryItem = async (tagId, itemData) => {
  try {
    const key = `inventory_${tagId}`;
    await AsyncStorage.setItem(key, JSON.stringify(itemData));
    return true;
  } catch (error) {
    console.error("Error saving inventory item:", error);
    return false;
  }
};

// Retrieve inventory data
export const getInventoryItem = async (tagId) => {
  try {
    const key = `inventory_${tagId}`;
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error retrieving inventory item:", error);
    return null;
  }
};

// Get all inventory items
export const getAllInventoryItems = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const inventoryKeys = keys.filter((key) => key.startsWith("inventory_"));
    const results = await AsyncStorage.multiGet(inventoryKeys);

    return results.map(([key, value]) => {
      const tagId = key.replace("inventory_", "");
      return {
        tagId,
        ...JSON.parse(value),
      };
    });
  } catch (error) {
    console.error("Error retrieving all inventory items:", error);
    return [];
  }
};

export const deleteInventoryItem = async (tagId) => {
  try {
    const key = `inventory_${tagId}`;
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return false;
  }
};
