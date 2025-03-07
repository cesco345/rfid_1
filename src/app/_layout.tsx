// src/app/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "NFC Inventory Manager" }} />
      <Stack.Screen name="scan" options={{ title: "Scan NFC Tag" }} />
      <Stack.Screen name="addItem" options={{ title: "Add New Item" }} />
      <Stack.Screen name="itemDetails" options={{ title: "Item Details" }} />
      <Stack.Screen name="editItem" options={{ title: "Edit Item" }} />
      <Stack.Screen name="reports" options={{ title: "Inventory Reports" }} />
    </Stack>
  );
}
