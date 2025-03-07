// src/screens/ReportsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Share,
} from "react-native";
import { getAllInventoryItems } from "../utils/storage";

export default function ReportsScreen() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    const items = await getAllInventoryItems();
    setInventory(items);
    setLoading(false);
  };

  const generateCSVReport = () => {
    // Create CSV header
    let csvContent =
      "Name,Description,Quantity,Location,Category,Last Updated\n";

    // Add each inventory item
    inventory.forEach((item) => {
      const row = [
        `"${item.name}"`,
        `"${item.description || ""}"`,
        item.quantity,
        `"${item.location || ""}"`,
        `"${item.category || ""}"`,
        `"${new Date(item.lastUpdated).toLocaleString()}"`,
      ].join(",");

      csvContent += row + "\n";
    });

    // Share the report
    Share.share({
      message: csvContent,
      title: "Inventory Report",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Reports</Text>

      <TouchableOpacity style={styles.reportButton} onPress={loadInventory}>
        <Text style={styles.buttonText}>Refresh Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.reportButton} onPress={generateCSVReport}>
        <Text style={styles.buttonText}>Generate CSV Report</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Inventory Summary</Text>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>Total Items: {inventory.length}</Text>
        <Text style={styles.summaryText}>
          Total Quantity:{" "}
          {inventory.reduce(
            (sum, item) => sum + (parseInt(item.quantity) || 0),
            0
          )}
        </Text>
        <Text style={styles.summaryText}>
          Categories:{" "}
          {
            Array.from(
              new Set(inventory.map((item) => item.category).filter(Boolean))
            ).length
          }
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Items by Category</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading data...</Text>
      ) : (
        <FlatList
          data={getCategorySummary(inventory)}
          keyExtractor={(item) => item.category}
          renderItem={({ item }) => (
            <View style={styles.categoryItem}>
              <Text style={styles.categoryName}>{item.category}</Text>
              <Text style={styles.categoryCount}>{item.count} items</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

// Helper function to summarize items by category
function getCategorySummary(inventory) {
  const categories = {};

  inventory.forEach((item) => {
    const category = item.category || "Uncategorized";
    if (!categories[category]) {
      categories[category] = { count: 0, items: [] };
    }
    categories[category].count += 1;
    categories[category].items.push(item);
  });

  return Object.keys(categories).map((category) => ({
    category,
    count: categories[category].count,
    items: categories[category].items,
  }));
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
  },
  reportButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 8,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
  },
  categoryCount: {
    color: "#666",
  },
});
